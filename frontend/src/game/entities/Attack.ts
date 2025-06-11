import { WeaponType, IWeapon, BaseProjectileStats, WeaponSet, IMelee, AttackMode, bossThreshold } from "../types";
import { BaseScene } from "../core/BaseScene";
import Enemy from "./Enemy";
import PlayerProgressionSystem from "./PlayerProgressionSystem";
import { EventManager } from "../core/EventBus";
import { GameEvents } from "../types";

export default class AttackManager {
    private projectiles: Phaser.Physics.Arcade.Group;
    private melee: Melee;
    private scene: BaseScene;
    private canAttack: boolean = true;
    private weaponSet: WeaponSet;
    private currentWeapon: IWeapon;
    private kills: number = 0;
    private playerProgressionSystem: PlayerProgressionSystem;
    attackMode: AttackMode = AttackMode.AUTO;

    constructor(scene: BaseScene, playerProgessionSystem: PlayerProgressionSystem, weaponSet: WeaponSet) {
      this.scene = scene;
      this.playerProgressionSystem = playerProgessionSystem;
      this.weaponSet = weaponSet;
      this.currentWeapon = weaponSet.projectile;

      this.melee = new Melee(scene, weaponSet.melee, scene.player.character);
      this.projectiles = scene.physics.add.group({ classType: Projectile, maxSize: BaseProjectileStats.groupSize, runChildUpdate: true });

      this.scene.physics.add.overlap(this.projectiles, this.scene.enemyManager.enemyPool, this.handleHit);
      this.scene.physics.add.overlap(this.melee, this.scene.enemyManager.enemyPool, this.handleHit);

      const blockers = this.scene.map.getLayer('colisao')?.tilemapLayer;
      if(blockers) this.scene.physics.add.collider(this.projectiles, blockers, this.eraseProjectile);

      EventManager.Instance.on(GameEvents.TOGGLE_WEAPON, this.toggleWeapon, this);
      EventManager.Instance.on(GameEvents.TOGGLE_ATTACK_MODE, this.toggleAttackMode, this);

      this.updateMeleeMode();
    }

    private handleHit = (obj1: object, obj2: object) => {
        if (obj1 instanceof Melee && !(obj1 as Melee).active) return;

        const attacker = obj1 instanceof Melee ? this.melee : obj1 as Projectile;
        const enemy = obj2 as Enemy;

        if (attacker instanceof Melee) {
          if (!attacker.active) return;

          if (attacker.hasHitEnemy(enemy)) {
            return;
          }

          attacker.markEnemyAsHit(enemy);
        }

        const weaponDamage = attacker instanceof Melee ? this.weaponSet.melee.baseDamage : this.weaponSet.projectile.baseDamage;

        const damage = weaponDamage * this.scene.player.level.damageIncrease;

        if (enemy.takeDamage(damage)) {
          this.kills += 1;
          if(this.kills % 10 == 0) {
            this.scene.player.character.heal();
            EventManager.Instance.emit(GameEvents.HEALTH_CHANGE, this.scene.player.character.health);
          }

          if(this.kills % bossThreshold == 0) {
            EventManager.Instance.emit(GameEvents.SHOULD_SPAWN_BOSS, null);
          }

          this.playerProgressionSystem.increasePoints(enemy.pointGain);
          this.playerProgressionSystem.increaseXP(enemy.pointGain * 0.5);
          EventManager.Instance.emit(GameEvents.ENEMY_DIED, { points: this.playerProgressionSystem.pointsGained, kills: this.kills });
        }

        if (attacker instanceof Projectile) {
          attacker.disableBody(true, true);
        }
    };

    private eraseProjectile = (obj1: object) => {
        (obj1 as Projectile).disableBody(true, true);
    };

    private toggleAttackMode = () => {
        if(this.attackMode === AttackMode.AUTO) {
            this.attackMode = AttackMode.MANUAL;
        } else {
          this.attackMode = AttackMode.AUTO;
        }
        this.updateMeleeMode();
        EventManager.Instance.emit(GameEvents.TOGGLE_ATTACK_MODE_SUCCESS, this.attackMode);
    }

    private updateMeleeMode(): void {
      const shouldBeActive = this.attackMode === AttackMode.AUTO && this.currentWeapon.weaponType === WeaponType.MELEE;
      this.melee.setAutoMode(shouldBeActive);
    }

    private toggleWeapon = () => {
        if(this.currentWeapon.weaponType === WeaponType.PROJECTILE) {
          this.currentWeapon = this.weaponSet.melee;
        } else {
          this.currentWeapon = this.weaponSet.projectile;
        }
        this.updateMeleeMode();
        EventManager.Instance.emit(GameEvents.TOGGLE_WEAPON_SUCCESS, this.currentWeapon);
    }

    get weapon(): IWeapon {
        return this.currentWeapon;
    }

    fire(x: number, y: number, angle: number): void {
        if (!this.canAttack) return;

        switch (this.currentWeapon.weaponType) {
          case WeaponType.PROJECTILE:
            this.fireProjectile(x, y, angle);
            break;

          case WeaponType.MELEE:
            this.executeMeleeAttack(x, y, angle);
            break;
        }

        EventManager.Instance.emit(GameEvents.WEAPON_COOLDOWN, this.currentWeapon.baseCooldown);

        this.startCooldown();
    }

    private fireProjectile(x: number, y: number, angle: number): void {
        const projectile = this.projectiles.get(x, y, this.weaponSet.projectile.spriteKey, this.weaponSet.projectile.baseSpeed) as Projectile;

        if (projectile) {
            this.scene.gameCameras.ui.ignore(projectile);
            projectile.fire(x, y, angle);
        }
    }

    private executeMeleeAttack(x: number, y: number, angle: number): void {
      this.melee.attack({ x: x, y: y } as Phaser.Math.Vector2, angle);
    }

    private startCooldown(): void {
        this.canAttack = false;
        this.scene.time.delayedCall(this.currentWeapon.baseCooldown, () => { this.canAttack = true });
    }

    destroy(): void {
      this.projectiles.destroy();
      this.melee.destroy();
    }
}

class Projectile extends Phaser.Physics.Arcade.Sprite {
    spriteKey: string;
    baseSpeed: number;
    lifespanTimer: Phaser.Time.TimerEvent | null = null;

    constructor(scene: Phaser.Scene, x: number, y: number, spritekey: string, baseSpeed: number) {
        super(scene, x, y, spritekey);
        this.spriteKey = spritekey;
        this.baseSpeed = baseSpeed;
        this.setDepth(1000);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    fire(x: number, y: number, angle: number): void {
        if(this.lifespanTimer) {
            this.lifespanTimer.destroy();
            this.lifespanTimer = null;
        }

        this.enableBody(true, x, y, true, true);

        const velocity = this.scene.physics.velocityFromRotation(angle, this.baseSpeed);
        this.setRotation(angle);
        this.setVelocity(velocity.x, velocity.y);

        this.lifespanTimer = this.scene.time.delayedCall(2000, () => { if(this.active) this.disableBody(true, true) });
    }

    override destroy(): void {
      this.lifespanTimer?.destroy();
      super.destroy();
    }
}

class Melee extends Phaser.Physics.Arcade.Sprite {
  private attackDuration: number;
  private config: IMelee;
  private isAttacking: boolean = false;
  public  isAutoMode: boolean = false;
  private halfArc: number;
  private tweenSweep: Phaser.Tweens.Tween | null = null;
  private orbitRadius: number;
  private currentAngle: number = 0;
  private player: Phaser.Physics.Arcade.Sprite;
  private baseAngle: number = 0;
  private hitEnemiesInCurrentAttack: Set<Enemy> = new Set();

  constructor(scene: BaseScene, config: IMelee, player: Phaser.Physics.Arcade.Sprite) {
    super(scene, player.x, player.y, config.spriteKey || 'melee_weapon');
    scene.gameCameras.ui.ignore(this);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.config = config;
    this.attackDuration = config.duration;
    this.player = player;
    this.orbitRadius = config.range * 0.6;
    this.halfArc = Phaser.Math.DegToRad(45);

    this.setDepth(101);
    this.setOrigin(0.5, 0.5);
    this.setSize(config.range * 0.8, config.range * 0.8);

    this.setActive(false);
    this.setVisible(false);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.updatePosition();
  }

  hasHitEnemy(enemy: Enemy): boolean {
    return this.hitEnemiesInCurrentAttack.has(enemy);
  }

  markEnemyAsHit(enemy: Enemy): void {
    this.hitEnemiesInCurrentAttack.add(enemy);
  }

  private clearHitEnemies(): void {
    this.hitEnemiesInCurrentAttack.clear();
  }

  private updatePosition(): void {
    if (!this.player.active) return;

    const actual = this.baseAngle + this.currentAngle;
    const x = this.player.x + Math.cos(actual) * this.orbitRadius;
    const y = this.player.y + Math.sin(actual) * this.orbitRadius;
    this.setPosition(x, y);
    this.setRotation(this.currentAngle + Math.PI/2);
  }

  setAutoMode(enabled: boolean): void {
    this.isAutoMode = enabled;
    this.tweenSweep?.stop();

    if (enabled) {
      this.currentAngle = -this.halfArc;
    } else {
      this.endAttack();
    }
  }

  attack(origin: Phaser.Math.Vector2, angle: number): void {
    if (this.isAttacking) return;
    this.isAttacking = true;
    this.clearHitEnemies();
    this.baseAngle = angle;
    this.currentAngle = -this.halfArc;

    this.setActive(true);
    this.setVisible(true);
    this.updatePosition();

    this.tweenSweep?.stop();
    this.tweenSweep = this.scene.tweens.add({
      targets: this,
      currentAngle: { from: -this.halfArc, to: this.halfArc },
      ease: 'Sine.InOut',
      duration: this.attackDuration,
      yoyo: false,
      repeat: 0,
      onUpdate: () => this.updatePosition(),
      onComplete: () => this.endAttack()
    });
  }

  public endAttack(): void {
    this.tweenSweep?.stop();
    this.setScale(1, 1);
    this.isAttacking = false;
    this.setActive(false);
    this.setVisible(false);
    this.clearHitEnemies();
  }

  override destroy(): void {
    this.tweenSweep?.stop();
    super.destroy();
  }
}
