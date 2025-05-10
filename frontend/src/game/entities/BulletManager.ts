import { BaseBulletStats } from "../components/Constants";
import { Weapon } from "../components/Types";

export default class BulletManager {
    private bullets: Phaser.Physics.Arcade.Group;
    private scene: Phaser.Scene;
    private canShoot = true; // Cooldown de balas
    private weapon!:Weapon;

    constructor(scene: Phaser.Scene, weapon: Weapon) {
        this.scene = scene;
        this.weapon = weapon;
        this.bullets = scene.physics.add.group({
            classType: Bullet,
            maxSize: BaseBulletStats.groupSize,
            setXY: {
                x: 0,
                y: 0
            },
        });
    }

    fire(x: number, y: number, angle: number): void {
        if(this.canShoot) {
            const bullet = this.bullets.get(x, y, this.weapon.key ?? 'bullet', this.weapon.baseSpeed) as Bullet;
            if (bullet) {
                bullet.fire(x, y, angle);
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