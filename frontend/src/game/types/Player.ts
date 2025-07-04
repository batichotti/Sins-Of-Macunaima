import { ICollectable } from "./Collectables";
import { WeaponSet } from "./Weapon";

/**
 * Jogador que joga o jogo.
 */
export interface IPlayer {
    /**
     * Nome de usuário do jogador.
     */
    name: string;

    /**
     * Os personagens que o jogador pode usar.
     *
     * O primeiro personagem é o que o jogo usará no início da partida.
     */
    playableCharacters: ICharacter[];

    /**
     * O nível do jogador. Define modificadores de dano, vida, etc.
     */
    level: ILevel;

    /**
     * Set de armas que o jogador usará na partida.
     */
    weaponSet: WeaponSet;

    /**
     * Inventário do jogador.
     *
     * Não visível durante o jogo. Para mandar o que o jogador conseguiu para o backend.
     */
    inventory: Map<ICollectable, number>;

    levelUp(): void;

    /**
     * Atualiza o inventário.
     * @param payload O item coletado.
     */
    collectableHandler(payload: ICollectable): void;

    export(): IPlayerExport;

    destroy(): void;
}

export interface IPlayerExport {
    /**
     * Nome de usuário do jogador.
     */
    name: string;

    /**
     * Os personagens que o jogador pode usar.
     *
     * O primeiro personagem é o que o jogo usará no início da partida.
     */
    playableCharacters: ICharacter[];

    /**
     * O nível do jogador. Define modificadores de dano, vida, etc.
     */
    level: ILevel;

    /**
     * Set de armas que o jogador usará na partida.
     */
    weaponSet: WeaponSet;

    /**
     * Inventário do jogador.
     *
     * Não visível durante o jogo. Para mandar o que o jogador conseguiu para o backend.
     */
    inventory: Map<ICollectable, number>;
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
export const bossThreshold = 15;

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
    MACUNAIMA,
    PERI
}

/**
 * Os personagens existentes no jogo.
 */
export const CharacterTypes: Record<CharacterEnum, ICharacter> = {
    [CharacterEnum.MACUNAIMA]: {
        name: 'Macunaíma',
        spriteKey: 'Macunaima',
        maximumHealth: 20,
        health: 20,
        baseSpeed: 200
    },
    [CharacterEnum.PERI]: {
        name: 'Peri',
        spriteKey: 'Peri',
        maximumHealth: 25,
        health: 25,
        baseSpeed: 150
    }
};
