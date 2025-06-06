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
     * A quantidade de vida que o personagem tem começa.
     */
    health: number;

    /**
     * A quantidade de vida máxima que o jogador pode ter.
     */
    maximumHealth: number;

    /**
     * A velocidade base que o personagem tem
     */
    baseSpeed: number;
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
     * O quanto a vida base aumenta.
     */
    healthIncrease: number;
    /**
     * O quanto o dano causado aumenta.
     */
    damageIncrease: number;
}

/**
 * Define de quantos em quantos abates um Chefão aparece.
 */
export const bossThreshold = 50;

/**
 * Modificadores de níveis. Multiplique com o nível atual e a vida base do personagem para ter a vida total.
 */
export const levelModifiers = {
    health: 0.05,
    damage: 0.05
};

/**
 * Usado para localizar o personagem em 'characterTypes'.
 */
export enum CharacterEnum {
    MACUNAIMA
}

/**
 * Os personagens existentes no jogo.
 */
export const CharacterTypes: Record<CharacterEnum, ICharacter> = {
    [CharacterEnum.MACUNAIMA]: {
        name: 'Macunaíma',
        spriteKey: 'Macunaima',
        maximumHealth: 200,
        health: 200,
        baseSpeed: 200
    }
};
