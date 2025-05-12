import { BaseCharacterStats } from "@/game/components/Constants";
import { PlayerData } from "@/game/components/Types"

export default class Player {
    playerData!:PlayerData;
    character!:Character;

    constructor(playerData: PlayerData, scene: Phaser.Scene, position: Phaser.Math.Vector2) {
        this.character = new Character(scene, position, playerData.characterKey);
        this.playerData = playerData;
    }
}

class Character {
    scene!: Phaser.Scene;
    sprite!:Phaser.Physics.Arcade.Sprite;
    position: Phaser.Math.Vector2;
    life = BaseCharacterStats.life;
    speed = BaseCharacterStats.speed;
    scale = BaseCharacterStats.scale;

    constructor(scene: Phaser.Scene, position: Phaser.Math.Vector2, key: string) {
        this.scene = scene;
        this.position = position;
        this.sprite = this.scene.physics.add.sprite(
            this.position.x,
            this.position.y,
            key,
        ).setScale(
            this.scale
        ).setCollideWorldBounds(
            true
        ).setDepth(100);
        this.sprite.setFrame(0);
    }

    public updateMovement(velocity: Phaser.Math.Vector2): void {
        const normalized = velocity.normalize().scale(this.speed);
        if(velocity.x > 0) this.sprite.setFrame(1);
        else if(velocity.x < 0) this.sprite.setFrame(2);
        else this.sprite.setFrame(0);
        this.sprite.setVelocity(normalized.x, normalized.y);
    }
}