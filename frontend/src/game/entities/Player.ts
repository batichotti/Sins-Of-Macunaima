import { ICharacter, IPlayer, WeaponSet } from "../types";
import { Level } from "./Level";

export class Player implements IPlayer {
    name!: string;
    character!: Character;
    level!: Level;
    weaponSet!: WeaponSet;

    constructor(name: string, character: Character, level: Level, weaponSet: WeaponSet) {
        this.name = name;
        this.character = character;
        this.level = level;
        this.weaponSet = weaponSet;
    }
}

export class Character extends Phaser.Physics.Arcade.Sprite implements ICharacter {
    name!: string;
    baseHealth!: number;
    baseSpeed!: number;
    spriteKey!: string;

    constructor(scene: Phaser.Scene, position: Phaser.Math.Vector2, name: string, spriteKey: string, baseSpeed: number, baseHealth: number) {
        super(scene, position.x, position.y, spriteKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.name = name;
        this.spriteKey = spriteKey;
        this.baseSpeed = baseSpeed;
        this.baseHealth = baseHealth;
        this.setScale(1.5).setCollideWorldBounds(true).setDepth(100);
    }

    public playerMove(direction: Phaser.Math.Vector2): void {
        this.setVelocity(direction.x * this.baseSpeed, direction.y * this.baseSpeed);
    }
}