import { EventManager, GameEvents } from "../core/EventBus";
import { Directions, ICharacter, IPlayer, WeaponSet } from "../types";
import { Level } from "./Level";
import TweenManager from "./TweenManager";

export class Player implements IPlayer {
    name!: string;
    character!: Character;
    playableCharacters: ICharacter[] = [];
    private currentCharacterIndex = 0;
    level!: Level;
    weaponSet!: WeaponSet;
    private eventManager: EventManager;

    constructor(data: IPlayer, mainCharacter: Character) {
        this.name = data.name;
        this.character = mainCharacter;
        this.playableCharacters = data.playableCharacters;
        this.level = new Level(data.level.level);
        this.weaponSet = data.weaponSet;
        this.eventManager = EventManager.getInstance();

        // Aplica modificadores de nível no personagem inicial
        this.applyLevelModifiers();

        // Registra o listener de eventos
        this.eventManager.on(GameEvents.TOGGLE_CHARACTER, this.changeCharacter);
    }

    private applyLevelModifiers(): void {
        this.character.maximumHealth *= this.level.healthIncrease;
        this.character.health = this.character.maximumHealth;
        this.weaponSet.melee.baseDamage *= this.level.damageIncrease;
        this.weaponSet.projectile.baseDamage *= this.level.damageIncrease;
    }

    private changeCharacter = () => {
        this.currentCharacterIndex = (this.currentCharacterIndex + 1) % this.playableCharacters.length;

        const newCharacterConfig = this.playableCharacters[this.currentCharacterIndex];

        // Aplica os modificadores de nível ao novo personagem
        const modifiedConfig: ICharacter = {
            ...newCharacterConfig,
            health: newCharacterConfig.health * this.level.healthIncrease,
            maximumHealth: newCharacterConfig.health * this.level.healthIncrease
        };

        this.character.changeCharacter(modifiedConfig);
    };

    levelUp(): void {
        const previousHealth = this.level.healthIncrease;
        const previousDamage = this.level.damageIncrease;

        this.level.levelUp();

        // Calcula os novos modificadores
        const healthMultiplier = this.level.healthIncrease / previousHealth;
        const damageMultiplier = this.level.damageIncrease / previousDamage;

        // Aplica os novos modificadores
        this.character.maximumHealth = Math.floor(this.character.maximumHealth * healthMultiplier);
        this.character.health = this.character.maximumHealth;
        this.weaponSet.melee.baseDamage *= damageMultiplier;
        this.weaponSet.projectile.baseDamage *= damageMultiplier;

        TweenManager.Instance.healTween(this.character);
        this.eventManager.emit(GameEvents.HEALTH_CHANGE, { health: this.character.health });
    }

    // Método para limpeza de recursos
    destroy(): void {
        this.eventManager.off(GameEvents.TOGGLE_CHARACTER, this.changeCharacter);
    }
}

export class Character extends Phaser.Physics.Arcade.Sprite implements ICharacter {
    name!: string;
    health!: number;
    maximumHealth!: number;
    baseSpeed!: number;
    spriteKey!: string;
    private eventManager: EventManager;

    constructor(scene: Phaser.Scene, position: Phaser.Math.Vector2, config: ICharacter) {
        super(scene, position.x, position.y, config.spriteKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.eventManager = EventManager.getInstance();
        this.initializeCharacter(config);
        this.setScale(1.5).setCollideWorldBounds(true).setDepth(100);
    }

    private initializeCharacter(config: ICharacter): void {
        this.name = config.name;
        this.spriteKey = config.spriteKey;
        this.baseSpeed = config.baseSpeed;
        this.health = config.health;
        this.maximumHealth = config.maximumHealth || config.health;
    }

    changeCharacter(config: ICharacter): void {
        this.initializeCharacter(config);
        this.setTexture(config.spriteKey);
        this.eventManager.emit(GameEvents.TOGGLE_CHARACTER_SUCCEDED, this.name);
    }

    resetToSpawnPoint(position: Phaser.Math.Vector2 | { x: number, y: number }): void {
        this.setPosition(position.x, position.y);
    }

    takeDamage(damage: number): void {
        if (this.health <= 0) return; // Já está morto

        this.health = Math.max(0, this.health - damage); // Garante que não fique negativo
        TweenManager.Instance.damageTween(this);

        if (this.health === 0) {
            this.eventManager.emit(GameEvents.PLAYER_DIED);
        } else {
            this.eventManager.emit(GameEvents.HEALTH_CHANGE, { health: this.health });
        }
    }

    heal(amount?: number): void {
        if (this.health >= this.maximumHealth) return; // Já está com vida cheia

        const healAmount = amount || Math.ceil(this.maximumHealth * 0.1);
        this.health = Math.min(this.maximumHealth, this.health + healAmount); // Clamp ao máximo

        TweenManager.Instance.healTween(this);
        this.eventManager.emit(GameEvents.HEALTH_CHANGE, { health: this.health });
    }

    playerMove(direction: Phaser.Math.Vector2, attackCoords: Phaser.Math.Vector2 | null): void {
        this.setVelocity(direction.x * this.baseSpeed, direction.y * this.baseSpeed);
        this.walkAnimation(attackCoords ?? direction);
    }

    private walkAnimation(direction: Phaser.Math.Vector2): void {
        // Para quando não há movimento
        if (direction.x === 0 && direction.y === 0) {
            this.setFrame(0);
            return;
        }

        const isMovingVertically = Math.abs(direction.y) > Math.abs(direction.x);

        if (isMovingVertically) {
            const animationKey = direction.y > 0 ? Directions.DOWN : Directions.UP;
            this.play(`${this.spriteKey}_${animationKey}`, true);
        } else {
            const animationKey = direction.x > 0 ? Directions.RIGHT : Directions.LEFT;
            this.play(`${this.spriteKey}_${animationKey}`, true);
        }
    }

    // Método para limpeza de recursos
    destroy(): void {
        super.destroy();
    }
}
