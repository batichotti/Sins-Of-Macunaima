import { IMelee } from "./Weapon";

/**
 * Contém informações base dos inimigos.
 */
export interface IEnemy {
    /**
    * Nome do inimigo. Para ser usado especialmente no Bestiário.
    */
    name: string;

    /**
     * Chave do sprite. Deve ser igual ao importado pelo Phaser.js.
     */
    spriteKey: string;

    /**
     * Região onde o inimigo aparece.
     */
    spawnRegion: string;

    /**
     * Arma do inimigo.
     */
    weapon: IMelee;

    /**
     * Quantidade de vida base do inimigo.
     */
    baseHealth: number;

    /**
     * Velocidade base do inimigo.
     */
    baseSpeed: number;

    /**
     * Multiplicador de dano do inimigo. Escala com o nível do jogador.
     */
    damageMultiplier: number; 

    /**
     * Pontuação ganha por matar o inimigo.
     */
    pointGain: number;
}

/**
 * Array com os inimigos. Necessário para o 'EnemyManager' gerar um aleatoriamente.
 */
export const EnemyTypes = [
    { 
        name: 'Chupa-cú', 
        spriteKey: 'Macunaima', 
        spawnRegion: 'Floresta',
        weapon: { 
            name: 'bengala', 
            baseDamage: 15, 
            baseCooldown: 500 
        } as IMelee, 
        baseHealth: 200,
        baseSpeed: 200,
        damageMultiplier: 1.2,
        pointGain: 20
    } as IEnemy,
        { 
        name: 'Colonizador', 
        spriteKey: 'Colonizador', 
        spawnRegion: 'Praia',
        weapon: { 
            name: 'Espada', 
            baseDamage: 20, 
            baseCooldown: 500 
        } as IMelee, 
        baseHealth: 200, 
        baseSpeed: 200,
        damageMultiplier: 1.2,
        pointGain: 20
    } as IEnemy
];

/**
 * Enum usado para escolher inimigos.
 */
export enum EnemyEnum {
    CHUPACU,
    COLONIZADOR
};

export const BossTypes = [
    { 
        name: 'Curu-Ré', 
        spriteKey: 'TODO', 
        spawnRegion: 'PlanicieClaraSuperior',
        weapon: { 
            name: 'Paulada', 
            baseDamage: 50, 
            baseCooldown: 1250 
        } as IMelee, 
        baseHealth: 1500,
        baseSpeed: 150,
        damageMultiplier: 1.2,
        pointGain: 500
    } as IEnemy,
];

export enum BossEnum {
    CURURE
}