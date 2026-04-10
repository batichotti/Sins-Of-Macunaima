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
    private shooter: Shooter | null;
    private path: Phaser.Math.Vector2[] = [];
    private nextNode = 0;
    private tts: number = 5000;
    canSpawn: boolean = true;

    // Controle de estado
    private timeStuck: number = 0;
    private lastPos = new Phaser.Math.Vector2(0, 0);
    private lastTileTarget = new Phaser.Math.Vector2(0, 0);

    constructor(scene: BaseScene, position: Phaser.Math.Vector2, spriteKey: string) {
        super(scene, position.x, position.y, spriteKey);

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

    configureEnemy(config: IEnemy): void {
      // Configura propriedades do inimigo
      this.path = [];
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
      } else {
          this.shooter?.destroy();
          this.shooter = null;
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
        if (!this.body) return;

        if (this.shouldRecalculatePath(targetPx)) {
            this.calculatePath(targetPx);
            this.lastTileTarget = targetPx.clone();
        }
    }

    private shouldRecalculatePath(target: Phaser.Math.Vector2): boolean {
      return Phaser.Math.Distance.BetweenPoints(target, this.lastTileTarget) > this.scene.map.tileWidth * 3;
    }

    private calculatePath(target: Phaser.Math.Vector2): void {
      const path = this.scene.navMesh.findPath({ x: this.x, y: this.y }, { x: target.x, y: target.y });
      if(path) {
          this.path = path.map(p => new Phaser.Math.Vector2(p.x, p.y));
          this.nextNode = 0;
          return;
      }
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
      this.tweenSweep?.stop();

      super.destroy();
    }
}
