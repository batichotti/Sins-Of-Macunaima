import { WeaponType, IWeapon, BaseProjectileStats, WeaponSet } from "../types";
import { BaseScene } from "../core/BaseScene";
import Enemy from "./Enemy";

export default class AttackManager {
    private projectiles: Phaser.Physics.Arcade.Group;
    private meleeHitboxes: Phaser.Physics.Arcade.Group;
    private scene: BaseScene;
    private canAttack = true;
    private weaponSet: WeaponSet;
    private currentWeapon: IWeapon;

    constructor(scene: BaseScene, weaponSet: WeaponSet) {
        this.scene = scene;
        this.weaponSet = weaponSet;
        this.currentWeapon = weaponSet.projectile;

        this.projectiles = scene.physics.add.group({
            classType: Projectile,
            maxSize: BaseProjectileStats.groupSize,
            runChildUpdate: true
        });

        this.meleeHitboxes = scene.physics.add.group({
            classType: MeleeHitbox,
            maxSize: 5,
            runChildUpdate: true
        });

        this.scene.physics.add.overlap(this.projectiles, this.scene.enemyManager.enemyPool, this.handleHit);
    }


    private handleHit = (obj1: object, obj2: object) => {
        const projectile = obj1 as Projectile;
        const enemy = obj2 as Enemy;
        const damage = this.currentWeapon.baseDamage * this.scene.player.level.damageIncrease;

        projectile.disableBody(true, true);
        enemy.takeDamage(damage);
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
        const hitbox = this.meleeHitboxes.get(x, y, this.currentWeapon.spriteKey) as MeleeHitbox;

        if (hitbox) {
            const distanceFromPlayer = 30;
            const offsetX = Math.cos(angle) * distanceFromPlayer;
            const offsetY = Math.sin(angle) * distanceFromPlayer;

            hitbox.activate(x + offsetX, y + offsetY);

            this.scene.time.delayedCall(100, () => { hitbox.deactivate(); });
        }
    }

    private startCooldown(): void {
        this.canAttack = false;
        this.scene.time.delayedCall(this.currentWeapon.baseCooldown, () => {
            this.canAttack = true;
        });
    }
}

class Projectile extends Phaser.Physics.Arcade.Sprite {
    spriteKey: string;
    baseSpeed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, spritekey: string, baseSpeed: number) {
        super(scene, x, y, spritekey);
        this.spriteKey = spritekey;
        this.baseSpeed = baseSpeed;
        this.setDepth(1000);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    fire(x: number, y: number, angle: number): void {
        this.enableBody(true, x, y, true, true);

        const velocity = this.scene.physics.velocityFromRotation(angle, this.baseSpeed);
        this.setRotation(angle);
        this.setVelocity(velocity.x, velocity.y);

        this.scene.time.delayedCall(2000, () => { if(this.active) this.disableBody(true, true); });
    }
}

// TODO: Fazer MeleeHitbox extender Phaser.Zone
class MeleeHitbox extends Phaser.Physics.Arcade.Sprite {
    spriteKey: string;
    baseCooldown: number;

    constructor(scene: BaseScene, x: number, y: number, name: string, spriteKey: string, baseDamage: number, baseCooldown: number) {
        super(scene, x, y, spriteKey);
        this.spriteKey = spriteKey;
        this.baseCooldown = baseCooldown;

        scene.physics.add.existing(this);
        this.setVisible(false);
        this.setActive(false);
        // Arrumar dps
        this.body!.setSize(40, 40);
    }

    activate(x: number, y: number): void {
        this.enableBody(true, x, y, true, true);
        this.setVisible(true);
        this.setActive(true);
    }

    deactivate(): void {
        this.disableBody(true, true);
        this.setVisible(false);
        this.setActive(false);
    }
}