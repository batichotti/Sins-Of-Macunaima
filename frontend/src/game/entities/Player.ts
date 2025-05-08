import { PlayerStats } from "../components/Constants";

export default class Player {
    scene!: Phaser.Scene;
    sprite!:Phaser.Physics.Arcade.Sprite;
    position: Phaser.Math.Vector2;
    life = PlayerStats.life;
    speed = PlayerStats.speed;
    scale = PlayerStats.scale;
    key = PlayerStats.key;

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
        this.sprite.setVelocity(velocity.x, velocity.y);
    }
}