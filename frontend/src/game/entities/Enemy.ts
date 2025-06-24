import { DistanceMethod, Pathfinding } from "../components/phaser-pathfinding";
import { BaseScene } from "../core/BaseScene";
import { EventManager } from "../core/EventBus";
import { IMelee, IEnemy, Directions, MeleeCollectableTypes, ProjectileCollectableTypes, IProjectile,  } from "../types";
import TweenManager from "./TweenManager";
import { GameEvents } from "../types";
import { Shooter } from "./Attack";

export default class Enemy extends Phaser.Physics.Arcade.Sprite implements IEnemy {
    // Propriedades básicas
    name: string;
    override scene: BaseScene;
    spriteKey: string;
    spawnRegion: string = 'Não importa aqui. Apenas para EnemyManager';
    weapon: IMelee;
    projectileWeapon: IProjectile;
    baseHealth: number;
    damageMultiplier: number;
    baseSpeed: number;
    pointGain: number;
    isBoss: boolean = false;
    tweenSweep: Phaser.Tweens.Tween | null = null;
    baseAngle: number = 0;
    halfArc: number;
    orbitRadius: number;
    currentAngle: number = 0;
    private shooter?: Shooter;
    // Sistema de pathfinding
    pathFinder!: Pathfinding;
    private path: Phaser.Math.Vector2[] = [];
    private nextNode = 0;
    private tts: number = 5000;
    canSpawn: boolean = true;
    private currentWaypointPath: Phaser.Math.Vector2[] = [];

    // Controle de estado
    private timeStuck: number = 0;
    private lastPos = new Phaser.Math.Vector2(0, 0);
    private lastTileTarget = new Phaser.Math.Vector2(0, 0);
    private randomPivot: number = 0;

    constructor(scene: BaseScene, position: Phaser.Math.Vector2, spriteKey: string) {
        super(scene, position.x, position.y, spriteKey);

        // Configuração inicial
        this.randomPivot = Phaser.Utils.Array.GetRandom([ -3, -4, -5, -6, -7, -8, 3, 4, 5, 6, 7, 8 ]);
        this.spriteKey = spriteKey;

        // Adiciona à cena e física
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Ajuste do corpo físico
        this.setBodySize(16, 32)
            .setOffset(0, 0)
            .setScale(1.5)
            .setCollideWorldBounds(true)
            .setDepth(100);
    }

    public setPathFinder(pf: Pathfinding): void {
        this.pathFinder = pf;
    }

    configureEnemy(config: IEnemy): void {
      // Configura propriedades do inimigo
      this.path = [];
      this.currentWaypointPath = [];
      this.nextNode = 0;
      this.timeStuck = 0;
      this.lastPos.set(this.x, this.y);
      this.lastTileTarget.set(this.x, this.y);
      this.canSpawn = false;
      this.baseHealth = config.baseHealth; 

      this.orbitRadius = config.weapon.range * 0.6;
      this.halfArc = Phaser.Math.DegToRad(45);

      if ("projectileWeapon" in config && config.projectileWeapon) {
        this.shooter = new Shooter(this.scene, config.projectileWeapon as IProjectile, 30);
      }

      this.setTexture(config.spriteKey);
      this.name = config.name;
      this.spriteKey = config.spriteKey;
      this.damageMultiplier = config.damageMultiplier;
      this.weapon = config.weapon;
      this.baseHealth = config.baseHealth;
      this.baseSpeed = config.baseSpeed;
      this.pointGain = config.pointGain;
    }

    /**
     * Método para animação de dano.
     *
     * @param position A posição do jogador.
     */
    sweepTween(position: Phaser.Math.Vector2): void {
      if (!this.body || !this.active || !position || !this.weapon || !this.scene) {
        console.warn('sweepTween: Condições inválidas detectadas');
        return;
      }

      this.tweenSweep?.stop();

      this.baseAngle = Phaser.Math.Angle.Between(this.x, this.y, position.x, position.y);

      const toFlip = (this.baseAngle > Math.PI/2 && this.baseAngle < 3*Math.PI/2) ? -1 : 1;

      const R = this.orbitRadius * 0.6;
      const trailWidth = Phaser.Math.RadToDeg(this.halfArc) * 2;
      const trailInterval = 40;
      let lastTrailTime = 0;

    this.tweenSweep = this.scene.tweens.add({
      targets: this,
      currentAngle: {
        from: -this.halfArc * toFlip,
        to: this.halfArc * toFlip
      },
      ease: 'Sine.InOut',
      duration: this.weapon.duration,
      onUpdate: () => {
        if (!this.scene || !this.scene.time) return;

        const now = this.scene.time.now;

        if (now - lastTrailTime > trailInterval) {
          lastTrailTime = now;
          this.createTrailEffect(R, trailWidth);
        }
      },
    });
  }

  private createTrailEffect(radius: number, trailWidth: number): void {
    if (!this.scene || !this.active) return;

    const startDeg = Phaser.Math.RadToDeg(this.baseAngle + this.currentAngle) - trailWidth/2;
    const endDeg = startDeg + trailWidth;

    const arc = this.scene.add.arc(
        this.x, this.y,
        radius,
        startDeg, endDeg,
        false,
        0xffffff, 0.3
    )
    .setOrigin(0.5)
    .setDepth(110)
    .setBlendMode(Phaser.BlendModes.ADD);

    if (this.scene.gameCameras && this.scene.gameCameras.ui) {
      this.scene.gameCameras.ui.ignore(arc);
    }

    const currentScene = this.scene;

    currentScene.tweens.add({
        targets: arc,
        alpha: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        ease: 'Quad.easeOut',
        duration: 200,
        onComplete: () => {
          if (arc && arc.active) {
            arc.destroy();
          }
        }
      });
    }

    updatePathing(targetPx: Phaser.Math.Vector2): void {
        if (!this.body || !this.pathFinder) return;

        if (this.shouldRecalculatePath(targetPx)) {
            const targetPos = this.scene.enemyManager.getTargetPosition(
                new Phaser.Math.Vector2(this.x, this.y),
                targetPx
            );

            this.calculatePath(targetPos);
            this.lastTileTarget = targetPx.clone();
        }
    }

    private shouldRecalculatePath(target: Phaser.Math.Vector2): boolean {
      return Phaser.Math.Distance.BetweenPoints(target, this.lastTileTarget) > this.scene.map.tileWidth * 3;
    }

    private calculatePath(target: Phaser.Math.Vector2): void {
        const directDistance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        if (directDistance > this.scene.enemyManager.maxDirectDistance) {
            const waypointPath = this.scene.enemyManager.findPathViaWaypoints(
                new Phaser.Math.Vector2(this.x, this.y),
                target
            );

            this.path = this.convertWaypointPath(waypointPath);
            this.nextNode = 0;
            this.currentWaypointPath = waypointPath;
            return;
        }

        const startTile = this.scene.map.worldToTileXY(this.x, this.y);
        const targetTile = this.scene.map.worldToTileXY(target.x, target.y);
        const cacheKey = this.getCacheKey(targetTile!);
        const cachedPath = this.scene.enemyManager.pathCache.get(cacheKey) ?? [];

        if (this.scene.enemyManager.pathCache.isValid(cacheKey) && cachedPath.length > 0) {
            this.path = cachedPath;
            this.nextNode = 0;
            this.lastTileTarget = targetTile!.clone();
            return;
        }

        const raw = this.pathFinder.findPathBetweenTl(startTile!, targetTile!, {
            distanceMethod: DistanceMethod.Octile,
            diagonal: true,
            simplify: true
        });

        this.path = raw.map(n => this.scene.map.tileToWorldXY(n.tileX, n.tileY)!.add(new Phaser.Math.Vector2(this.scene.map.tileWidth/2, this.scene.map.tileHeight/2)));

        this.scene.enemyManager.pathCache.set(cacheKey, this.path);
        this.nextNode = 0;
        this.lastTileTarget = targetTile!.clone();
    }

    private convertWaypointPath(waypoints: Phaser.Math.Vector2[]): Phaser.Math.Vector2[] {
        return waypoints.flatMap((wp, i) => {
            if (i === waypoints.length - 1) return [wp];

            const next = waypoints[i + 1];
            const steps = Math.ceil(Phaser.Math.Distance.Between(wp.x, wp.y, next.x, next.y) / 32);
            const points: Phaser.Math.Vector2[] = [];

            for (let j = 0; j <= steps; j++) {
                const t = j / steps;
                points.push(new Phaser.Math.Vector2(
                    Phaser.Math.Linear(wp.x, next.x, t),
                    Phaser.Math.Linear(wp.y, next.y, t)
                ));
            }
            return points;
        });
    }

    updateMovement(): void {
      if (!this.body) return;

      const delta = this.scene.game.loop.delta;

      const currentDistance = Phaser.Math.Distance.Between(this.lastPos.x, this.lastPos.y, this.x, this.y);
      if (currentDistance < 8) {
          this.timeStuck += delta;

          if (this.timeStuck >= 2000) {
              this.path = [];
              this.nextNode = 0;
              this.timeStuck = 0;
          }
      } else {
          this.timeStuck = 0;
          this.lastPos.set(this.x, this.y);
      }

      if (this.nextNode >= this.path.length) {
        this.setVelocity(0, 0);
        return;
      }

      const dest = this.path[this.nextNode];
      const dir = new Phaser.Math.Vector2(dest.x - this.x, dest.y - this.y);

      if (dir.length() > 0) {
        dir.normalize();
      }

      const speed = this.baseSpeed;
      this.walkAnimation(dir);
      this.setVelocity(dir.x * speed, dir.y * speed);

      if (Phaser.Math.Distance.Between(this.x, this.y, dest.x, dest.y) < 16) {
        this.nextNode++;
      }
  }

    private walkAnimation(direction: Phaser.Math.Vector2) {
        if (direction.length() === 0) {
            this.setFrame(0);
            return;
        }

        if (Math.abs(direction.x) > Math.abs(direction.y)) {
            if (direction.x > 0) {
                this.play(`${this.spriteKey}_${Directions.RIGHT}`, true);
            } else {
                this.play(`${this.spriteKey}_${Directions.LEFT}`, true);
            }
        } else {
            if (direction.y > 0) {
                this.play(`${this.spriteKey}_${Directions.DOWN}`, true);
            } else {
                this.play(`${this.spriteKey}_${Directions.UP}`, true);
            }
        }
    }

    private getCacheKey(targetTile: Phaser.Math.Vector2): string {
      const startTile = this.scene.map.worldToTileXY(this.x, this.y)!;
      return this.scene.enemyManager.pathCache.generateKey(startTile, targetTile, 3);
    }

    takeDamage(damage: number): boolean {
      if (!this.active || !this.body) return false;
      this.baseHealth -= damage;
      TweenManager.Instance.damageTween(this);

      if (this.baseHealth <= 0) {
        if (this.isBoss) {
          EventManager.Instance.emit(GameEvents.BOSS_DEFEATED, null);
        }

        else if(Phaser.Math.Between(1, 10) <= 3) {
          let collectable = Object.values(MeleeCollectableTypes).find(it => it.name.toUpperCase() === this.weapon.name.toUpperCase());

          if (!collectable) {
            collectable = Object.values(ProjectileCollectableTypes).find(it => it.name.toUpperCase() === this.weapon.name.toUpperCase());
          }

          if (collectable && collectable.dropable) {
            EventManager.Instance.emit(GameEvents.WEAPON_DROPPED, { weapon: { asIWeapon: this.weapon, asICollectable: collectable }, position: this.body.position });
          }
        }
        this.disableBody(true, true);
        return true;
      }
      return false;
    }

    override preUpdate(time: number, delta: number) {
      super.preUpdate(time, delta);
      this.updateBehavior();
    }

    private updateBehavior() {
      this.updateMovement();
      this.tryShootAtPlayer();
    }

    private tryShootAtPlayer() {
      if (!this.shooter) return;
      const player = this.scene.player.character;
      const dist = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        player.x,
        player.y
      );
      if (dist <= this.shooter.weaponConfig.range) {
        const angle = Phaser.Math.Angle.Between(
          this.x,
          this.y,
          player.x,
          player.y
        );
        this.shooter.fire(this.x, this.y, angle);
      }
    }

    override disableBody(disableGameObject: boolean = false, hideGameObject: boolean = false): this {
      this.setActive(false);
      this.setVisible(false);
      this.canSpawn = false;
      this.path = [];
      this.nextNode = 0
      this.currentWaypointPath = [];
      const effect = this.scene.add.circle(this.x, this.y, 10, 0xFF0000, 0.8);
      this.scene.gameCameras.ui.ignore(effect);
      this.scene.tweens.add({
        targets: effect,
        scaleX: 2,
        scaleY: 2,
        alpha: 0,
        duration: 200,
        onUpdate: () => {
          effect.x = this.x;
          effect.y = this.y;
        },
        onComplete: () => {
          super.disableBody(disableGameObject, hideGameObject);
          effect.destroy();
        }
      });
      this.scene.time.delayedCall(this.tts, () => { this.canSpawn = true });
      return this;
    }

    override destroy(): void {
      this.path = [];
      this.nextNode = 0;
      this.currentWaypointPath = [];
      this.tweenSweep?.stop();

      super.destroy();
    }
}
