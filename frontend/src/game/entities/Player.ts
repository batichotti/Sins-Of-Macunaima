import { ICharacter, IPlayer } from "../types";
import { Level } from "./Level";
import { Weapon } from "./Weapon";

export class Player implements IPlayer {
    name!: string;
    character!: Character;
    level!: Level;
    weapon!: Weapon;

    constructor(name: string, character: Character, level: Level, weapon: Weapon) {
        this.name = name;
        this.character = character;
        this.level = level;
        this.weapon = weapon;
    }
}

export class Character extends Phaser.Physics.Arcade.Sprite implements ICharacter {
    baseLife!: number;
    baseSpeed!: number;
    spriteKey!: string;

    constructor(scene: Phaser.Scene, position: Phaser.Math.Vector2, spriteKey: string, baseSpeed: number, baseLife: number) {
        super(scene, position.x, position.y, spriteKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.spriteKey = spriteKey;
        this.baseSpeed = baseSpeed;
        this.baseLife = baseLife;
        this.setScale(1.5).setCollideWorldBounds(true).setDepth(100);
    }

    public playerMove(direction: Phaser.Math.Vector2): void {
        const normalized = direction.normalize().scale(this.baseSpeed);
        this.setVelocity(normalized.x, normalized.y);
    }
}