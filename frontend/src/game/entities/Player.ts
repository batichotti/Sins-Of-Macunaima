export default class Player {
    scene!: Phaser.Scene;
    sprite!:Phaser.Physics.Arcade.Sprite;
    position: Phaser.Math.Vector2;
    life = 100;
    speed = 200;
    scale = 1.5;
    key = 'player';

    constructor(scene: Phaser.Scene, position: Phaser.Math.Vector2) {
        this.scene = scene;
        this.position = position;
        this.sprite = this.scene.physics.add.sprite(
            this.position.x,
            this.position.y,
            this.key
        ).setScale(
            this.scale
        ).setCollideWorldBounds(
            true
        ).setDepth(100);
    }

    public updateMovement(velocity: Phaser.Math.Vector2): void {
        const normalized = velocity.normalize().scale(this.speed);
        this.sprite.setVelocity(normalized.x, normalized.y);
    }
}