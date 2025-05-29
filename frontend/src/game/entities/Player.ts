import { EventManager, GameEvents } from "../core/EventBus";
import { Directions, ICharacter, IPlayer, WeaponSet } from "../types";
import { Level } from "./Level";
import TweenManager from "./TweenManager";

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

        this.character.maximumHealth *= this.level.healthIncrease;
        this.character.health = this.character.maximumHealth;
        this.weaponSet.melee.baseDamage *= this.level.damageIncrease;
        this.weaponSet.projectile.baseDamage *= this.level.damageIncrease;
    }

    levelUp(): void {
        const previousHealth = this.level.healthIncrease;
        const previousDamage = this.level.damageIncrease;

        this.level.levelUp();

        this.character.maximumHealth = Math.floor(this.character.maximumHealth * (this.level.healthIncrease / previousHealth));
        this.character.health = this.character.maximumHealth;
        this.weaponSet.melee.baseDamage *= (this.level.damageIncrease / previousDamage);
        this.weaponSet.projectile.baseDamage *= (this.level.damageIncrease / previousDamage);
    
        TweenManager.Instance.healTween(this.character);

        EventManager.getInstance().emit(GameEvents.HEALTH_CHANGE, { health: this.character.health });
    }
}

export class Character extends Phaser.Physics.Arcade.Sprite implements ICharacter {
    name!: string;
    health!: number;
    maximumHealth!: number;
    baseSpeed!: number;
    spriteKey!: string;

    constructor(scene: Phaser.Scene, position: Phaser.Math.Vector2, config: ICharacter) {
        super(scene, position.x, position.y, config.spriteKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.name = config.name;
        this.spriteKey = config.spriteKey;
        this.baseSpeed = config.baseSpeed;
        this.health = config.health;
        this.maximumHealth = config.health;
        this.setScale(1.5).setCollideWorldBounds(true).setDepth(100);
    }

    takeDamage(damage: number) {
        if(this.health > 0) this.health -= damage;

        TweenManager.Instance.damageTween(this);

        if(this.health < 0) {
            this.health = 0;
            EventManager.getInstance().emit(GameEvents.PLAYER_DIED);
        } else {
            EventManager.getInstance().emit(GameEvents.HEALTH_CHANGE, { health: this.health })
        }
    }

    heal(): void {
        if(this.health < this.maximumHealth) this.health += Math.ceil(this.maximumHealth * 0.1);

        TweenManager.Instance.healTween(this);

        EventManager.getInstance().emit(GameEvents.HEALTH_CHANGE, { health: this.health })
    }

    playerMove(direction: Phaser.Math.Vector2): void {
        this.setVelocity(direction.x * this.baseSpeed, direction.y * this.baseSpeed);
        this.walkAnimation(direction);
    }

    private walkAnimation(direction: Phaser.Math.Vector2) {
        if(direction.x > 0) this.play(`${this.spriteKey}_${Directions.RIGHT}`, true);
        else if(direction.x < 0) this.play(`${this.spriteKey}_${Directions.LEFT}`, true);
        else if(direction.y > 0) this.play(`${this.spriteKey}_${Directions.DOWN}`, true);
        else if(direction.y < 0) this.play(`${this.spriteKey}_${Directions.UP}`, true);
        else this.setFrame(0);
    }
}