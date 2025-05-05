export default class BulletManager {
    private bullets: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene) {
        this.bullets = scene.physics.add.group({
            classType: Bullet,
            maxSize: 10,
            setXY: {
                x: 0,
                y: 0
            }
        });
    }

    fire(x: number, y: number, angle: number): void {
        const bullet = this.bullets.get(x, y);
        if (bullet) {
            bullet.fire(x, y, angle);
        }
    }
}

class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(1000);
        this.setDisplaySize(4, 4);
        this.setTint(0x000000);
    }

	fire(x: number, y: number, angle: number): void {
        if(this.body) {
            this.body.reset(x, y);
            this.setActive(true);
            this.setVisible(true);
     
            const velocity = this.scene.physics.velocityFromRotation(angle, 300);
            this.setVelocity(velocity.x, velocity.y);

            this.scene.time.delayedCall(1000, () => {
                this.setActive(false);
                this.setVisible(false);
            });
        }

	}
}