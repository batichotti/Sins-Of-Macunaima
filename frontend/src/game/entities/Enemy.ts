import { IMelee, IEnemy } from "../types";

export default class Enemy extends Phaser.Physics.Arcade.Sprite implements IEnemy {
    name: string;
    spriteKey: string;
    weapon: IMelee;
    baseHealth: number;
    baseSpeed: number;

    constructor(scene: Phaser.Scene, position: Phaser.Math.Vector2, spriteKey: string) {
        super(scene, position.x, position.y, spriteKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.spriteKey = spriteKey;
        this.setScale(1.5).setCollideWorldBounds(true).setDepth(100);
    }

    configureEnemy(config: IEnemy) {
        this.name = config.name;
        this.spriteKey = config.spriteKey;
        this.weapon = config.weapon;
        this.baseHealth = config.baseHealth;
        this.baseSpeed = config.baseSpeed;
    }

    private destroyEnemy(): void {
        this.setActive(false).setVisible(false);
    }
}