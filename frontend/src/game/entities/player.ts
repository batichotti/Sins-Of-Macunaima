export type Position = {
    x: number;
    y: number;
};

export type PlayerConfig = {
    Position: Position;
    Speed: number;
    Scale: number;
    key: string;
}

export class Player {
    scene!: Phaser.Scene;
    sprite!:Phaser.Physics.Arcade.Sprite;
    playerConfig!: PlayerConfig;

    constructor(scene: Phaser.Scene, config: PlayerConfig) {
        this.scene = scene;
        this.playerConfig = config;
        this.sprite = this.scene.physics.add.sprite(
            this.playerConfig.Position.x,
            this.playerConfig.Position.y,
            this.playerConfig.key
        ).setScale(
            this.playerConfig.Scale
        ).setCollideWorldBounds(
            true
        ).setDepth(
            100
        );
    }
}