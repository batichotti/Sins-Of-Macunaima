import { BaseProjectileStats } from "../types";
import { Weapon } from "./Weapon";
import { BaseScene } from "../core/BaseScene";

export default class BulletManager {
    bullets: Phaser.Physics.Arcade.Group;
    private scene: BaseScene;
    private canShoot = true; // Cooldown de balas
    private weapon!:Weapon;

    constructor(scene: BaseScene, weapon: Weapon) {
        this.scene = scene;
        this.weapon = weapon;
        this.bullets = scene.physics.add.group({
            classType: Bullet,
            maxSize: BaseProjectileStats.groupSize,
            setXY: {
                x: 0,
                y: 0
            },
        });
    }

    fire(x: number, y: number, angle: number): void {
        if(this.canShoot) {
            const bullet = this.bullets.get(x, y, this.weapon.spriteKey ?? 'bullet', BaseProjectileStats.speed) as Bullet;
            if (bullet) {
                bullet.fire(x, y, angle);
                this.scene.gameCameras.ui.ignore(bullet);
            }
            // Carrega cooldown
            this.canShoot = false;
            this.scene.time.delayedCall(this.weapon.baseCoolDown, () => { this.canShoot = true });
        }
    }
}

class Bullet extends Phaser.Physics.Arcade.Sprite {
    key!:string;
    speed!: number;
    constructor(scene: Phaser.Scene, x: number, y: number, key: string, speed: number) {
        super(scene, x, y, key);
        this.key = key;
        this.speed = speed;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        //this.setScale(2);
        this.setDepth(1000);
        if(key === 'bullet') {
            this.setDisplaySize(8, 4);
            this.setTint(0x000000);
        }

    }

	fire(x: number, y: number, angle: number): void {
        if(this.body) {
            this.body.reset(x, y);
            this.setActive(true);
            this.setVisible(true);
     
            const velocity = this.scene.physics.velocityFromRotation(angle, this.speed);
            this.setRotation(angle);
            this.setVelocity(velocity.x, velocity.y);

            this.scene.time.delayedCall(1000, () => {
                this.setActive(false);
                this.setVisible(false);
            });
        }

	}
}