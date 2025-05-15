import { BaseCharacterStats } from "@/game/components/Constants";
import { PlayerData } from "@/game/components/Types"

// mover para outro canto

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

const frameConfig = {
    frameRate: 4,
    repeat: -1,
}

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
    direction: Direction;
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
        this.sprite.anims.create(
            {
                key: 'up',
                frames: this.sprite.anims.generateFrameNumbers(key, {  frames: [13, 14] }),
                ...frameConfig
            }
        );
        this.sprite.anims.create(
            {
                key: 'down',
                frames: this.sprite.anims.generateFrameNumbers(key, {  frames: [1, 2] }),
                ...frameConfig
            }
        );

        this.sprite.anims.create(
            {
                key: 'left',
                frames: this.sprite.anims.generateFrameNumbers(key, { frames: [9, 10] }),
                ...frameConfig
            }
        );

        this.sprite.anims.create(
            {
                key: 'right',
                frames: this.sprite.anims.generateFrameNumbers(key, { frames: [5, 6] }),
                ...frameConfig
            }
        );
    }

    public updateMovement(velocity: Phaser.Math.Vector2): void {
        const normalized = velocity.normalize().scale(this.speed);
        
        if(velocity.x > 0) {
            this.direction = Direction.RIGHT;
            this.sprite.play('right', true);
        }
        else if(velocity.x < 0) {
            this.direction = Direction.LEFT;
            this.sprite.play('left', true);
        }
        else if(velocity.y > 0) {
            this.direction = Direction.DOWN;
            this.sprite.play('down', true);
        }
        else if(velocity.y < 0) {
            this.direction = Direction.UP;
            this.sprite.play('up', true);
        }

        else if(velocity.x == 0 && velocity.y == 0) {
            switch(this.direction) {
                case Direction.UP:
                    this.sprite.setFrame(12);
                    break;
                case Direction.DOWN:
                    this.sprite.setFrame(0);
                    break;
                case Direction.LEFT:
                    this.sprite.setFrame(8);
                    break;
                case Direction.RIGHT:
                    this.sprite.setFrame(4);
                    break;
                default:
                    this.sprite.setFrame(0);
            }
        }


        this.sprite.setVelocity(normalized.x, normalized.y);
    }
}