import { WeaponType, IWeapon, BaseProjectileStats, WeaponSet } from "../types";
import { BaseScene } from "../core/BaseScene";

export default class AttackManager {
    private projectiles: Set<Projectile> = new Set();
    private meleeHitboxes: Set<MeleeHitbox> = new Set();
    private scene: BaseScene;
    private canAttack = true;
    private weaponSet: WeaponSet;
    private currentWeapon: IWeapon;

    constructor(scene: BaseScene, weaponSet: WeaponSet) {
        this.scene = scene;
        this.weaponSet = weaponSet;
        this.currentWeapon = weaponSet.projectile;
    }

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
        if(this.projectiles.size <= BaseProjectileStats.groupSize) {
            const projectile = new Projectile(this.scene, x, y, this.weaponSet.projectile.spriteKey, this.weaponSet.projectile.baseSpeed);;

            if (projectile) {
                this.scene.gameCameras.ui.ignore(projectile);
                projectile.fire(x, y, angle);
            }
        }
    }

    private executeMeleeAttack(x: number, y: number, angle: number): void {
        const hitbox = new MeleeHitbox(this.scene, x, y, this.weaponSet.melee.name, this.weaponSet.melee.spriteKey, this.weaponSet.melee.baseDamage, this.weaponSet.melee.baseCooldown);

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

class Projectile extends Phaser.Physics.Matter.Sprite {
    spriteKey: string;
    baseSpeed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, spritekey: string, baseSpeed: number) {
        super(scene.matter.world, x, y, spritekey);
        this.spriteKey = spritekey;
        this.baseSpeed = baseSpeed;
        scene.add.existing(this);
        this.setDepth(1000);
        this.setActive(true);
        this.setIgnoreGravity(true);
        this.setFriction(0);
        this.setBounce(0);
        this.setSensor(true);
        //scene.matter.add.gameObject(this);
    }

    fire(x: number, y: number, angle: number): void {
        const velocityX = Math.cos(angle) * this.baseSpeed;
        const velocityY = Math.sin(angle) * this.baseSpeed;
        this.setRotation(angle);
        this.setVelocity(velocityX, velocityY);

        this.scene.time.delayedCall(2000, () => { this.destroy() });
    }
}

// TODO: Fazer MeleeHitbox extender Phaser.Zone
class MeleeHitbox extends Phaser.Physics.Matter.Sprite {
    spriteKey: string;
    baseCooldown: number;

    constructor(scene: BaseScene, x: number, y: number, name: string, spriteKey: string, baseDamage: number, baseCooldown: number) {
        super(scene.matter.world, x, y, spriteKey);
        this.spriteKey = spriteKey;
        this.baseCooldown = baseCooldown;

        scene.physics.add.existing(this);
        this.setVisible(false);
        this.setActive(false);
        // Arrumar dps
        this.setSize(40, 40);
    }

    activate(x: number, y: number): void {
        this.setVisible(true);
        this.setActive(true);
    }

    deactivate(): void {
        this.destroy();
    }
}