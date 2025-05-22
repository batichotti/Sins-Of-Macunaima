import { Level } from "../entities/Level";
import { WeaponSet } from "./Weapon";
import { Character } from "../entities/Player";

/**
 * Jogador que joga o jogo.
 */
export interface IPlayer {
    /**
     * Nome de usuário do jogador.
     */
    name: string;

    /**
     * O personagem usado pelo jogador.
     */
    character: Character;

    /**
     * O nível do jogador. Define modificadores de dano, vida, etc.
     */
    level: Level;

    /**
     * Set de armas que o jogador usará na partida.
     */
    weaponSet: WeaponSet;
}

/**
 * Personagem que o jogador usa.
 */
export interface ICharacter {
    /**
     * Nome oficial do personagem.
     */
    name: string;
    /**
     * A chave do asset utilizado pelo personagem do jogador. 
     * 
     * Deve corresponder exatamente ao nome usado no arquivo de assets.
     */
    spriteKey: string;

    /**
     * A quantidade de vida base que o personagem tem.
     */
    baseHealth: number;

    /**
     * A velocidade base que o personagem tem
     */
    baseSpeed: number;

    /**
     * Atuzaliza a posição do personagem.
     * @param {Phaser.Math.Vector2} direction - Par de pontos x e y que indicam a direção que o personagem tomará.
     */
    playerMove(direction: Phaser.Math.Vector2): void;
}

/**
 * O nível que o jogador se encontra.
 */
export interface ILevel {
    /**
     * Quantificador de nível.
     */
    level: number;
    /**
     * O quanto o coolDown de balas diminui.
     */
    cooldownDecrease: number;
    /**
     * O quanto a velocidade de movimento aumenta.
     */
    speedIncrease: number;
    /**
     * O quanto a vida base aumenta.
     */
    healthIncrease: number;
    /**
     * O quanto o dano causado aumenta.
     */
    damageIncrease: number;
    /**
     * O quando a defesa aumenta.
     * 
     * Isto é, a tolerância ao dano recebido.
     */
    defenseIncrease: number;
}

export const levelModifers = {
    cooldown: 1.05,
    speed: 1.05,
    health: 1.05,
    damage: 1.05,
    defense: 1.05
};