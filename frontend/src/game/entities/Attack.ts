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
    private playerProgressionSystem !: PlayerProgressionSystem;

    constructor(scene: BaseScene, playerProgessionSytem: PlayerProgressionSystem, weaponSet: WeaponSet) {
        this.scene = scene;
        this.playerProgressionSystem = playerProgessionSytem;
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
        const attacker = obj1 instanceof Melee ? this.melee : obj1 as Projectile;
        const enemy = obj2 as Enemy;
        const damage = this.currentWeapon.baseDamage * this.scene.player.level.damageIncrease;

        if (enemy.takeDamage(damage)) {
            EventManager.getInstance().emit(GameEvents.ENEMY_DIED, { points: enemy.pointGain, xp: enemy.pointGain * 0.25 });
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

        this.startCooldown();
    }

    private fireProjectile(x: number, y: number, angle: number): void {
        const projectile = this.projectiles.get(x, y, this.currentWeapon.spriteKey, this.weaponSet.projectile.baseSpeed) as Projectile;

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
    private cooldown: number;
    private attackDuration: number;
    private config: IMelee;
    private isReady: boolean = true;

    constructor(scene: BaseScene, config: IMelee) {
        super(scene, 0, 0, config.range, config.range);
        scene.add.existing(this);
        
        scene.physics.add.existing(this, true);
        this.setSize(config.range, config.range);
        this.setActive(false);

        this.config = config;
        this.cooldown = config.baseCooldown;
        this.attackDuration = config.duration;
    }

    attack(origin: Phaser.Math.Vector2, angle: number): void {
        if (!this.isReady) return;

        this.isReady = false;
        
        // Posicionamento da hitbox
        const offset = new Phaser.Math.Vector2(
            Math.cos(angle) * this.config.range,
            Math.sin(angle) * this.config.range
        );
        
        this.setPosition(origin.x + offset.x, origin.y + offset.y);
        this.setActive(true);
        console.log("ataqueee")
        this.scene.time.delayedCall(this.attackDuration, () => { this.setActive(false); this.isReady = true; });
    }
}