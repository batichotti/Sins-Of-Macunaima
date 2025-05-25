import { WeaponType, IWeapon, BaseProjectileStats, WeaponSet, IMelee } from "../types";
import { BaseScene } from "../core/BaseScene";
import Enemy from "./Enemy";
import PlayerProgressionSystem from "./PlayerProgressionSystem";
import { EventManager, GameEvents } from "../core/EventBus";

export default class AttackManager {
    private projectiles: Phaser.Physics.Arcade.Group;
    private melee: Melee;
    private scene: BaseScene;
    private canAttack = true;
    private weaponSet: WeaponSet;
    private currentWeapon: IWeapon;
    private kills: number = 0;
    private playerProgressionSystem !: PlayerProgressionSystem;

    constructor(scene: BaseScene, playerProgessionSystem: PlayerProgressionSystem, weaponSet: WeaponSet) {
        this.scene = scene;
        this.playerProgressionSystem = playerProgessionSystem;
        this.weaponSet = weaponSet;
        this.currentWeapon = weaponSet.projectile;

        this.melee = new Melee(scene, weaponSet.melee);
        this.projectiles = scene.physics.add.group({ classType: Projectile, maxSize: BaseProjectileStats.groupSize, runChildUpdate: true });

        this.scene.physics.add.overlap(this.projectiles, this.scene.enemyManager.enemyPool, this.handleHit);
        this.scene.physics.add.overlap(this.melee, this.scene.enemyManager.enemyPool, this.handleHit);
        
        const blockers = this.scene.map.getLayer('colisao')?.tilemapLayer;
        if(blockers) this.scene.physics.add.collider(this.projectiles, blockers, this.eraseProjectile);

        EventManager.getInstance().on(GameEvents.TOGGLE_WEAPON, () => { this.toggleWeapon() });
    }


    private handleHit = (obj1: object, obj2: object) => {
        if (obj1 instanceof Melee && !(obj1 as Melee).active) return;

        const attacker = obj1 instanceof Melee ? this.melee : obj1 as Projectile;
        const enemy = obj2 as Enemy;

        const weaponDamage = attacker instanceof Melee ? this.weaponSet.melee.baseDamage : this.weaponSet.projectile.baseDamage;
        
        const damage = weaponDamage * this.scene.player.level.damageIncrease;

        if (enemy.takeDamage(damage)) {
            this.kills += 1;
            if(this.kills % 10 == 0) {
                this.scene.player.character.heal();
                EventManager.getInstance().emit(GameEvents.HEALTH_CHANGE, { health: this.scene.player.character.health });
            }

            this.playerProgressionSystem.increasePoints(enemy.pointGain);
            this.playerProgressionSystem.increaseXP(enemy.pointGain * 0.25);
            EventManager.getInstance().emit(GameEvents.ENEMY_DIED, { 
                points: this.playerProgressionSystem.pointsGained,
                xp: this.playerProgressionSystem.xpGained
            });
        }
        
        if (attacker instanceof Projectile) {
            attacker.disableBody(true, true);
        }
    };

    private eraseProjectile = (obj1: object) => {
        (obj1 as Projectile).disableBody(true, true);
    };

    toggleWeapon(): void {
        if(this.currentWeapon.weaponType === WeaponType.PROJECTILE) {
            this.currentWeapon = this.weaponSet.melee;
        } else {
            this.currentWeapon = this.weaponSet.projectile;
        }
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

        EventManager.getInstance().emit(GameEvents.WEAPON_COOLDOWN, this.currentWeapon.baseCooldown);

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
}

class Melee extends Phaser.GameObjects.Zone {
    private attackDuration: number;
    private config: IMelee;

    constructor(scene: BaseScene, config: IMelee) {
        super(scene, 0, 0, config.range, config.range);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setSize(config.range, config.range);
        this.setActive(false);
        this.body?.gameObject?.setActive(false);

        this.config = config;
        this.attackDuration = config.duration;
    }

    attack(origin: Phaser.Math.Vector2, angle: number): void {
        const offset = new Phaser.Math.Vector2(
            Math.cos(angle) * (this.config.range * 0.5),
            Math.sin(angle) * (this.config.range * 0.75)
        );
        
        this.setPosition(origin.x + offset.x, origin.y + offset.y);
        this.setActive(true);
        
        this.scene.time.delayedCall(this.attackDuration, () => { this.setActive(false) });
    }
}