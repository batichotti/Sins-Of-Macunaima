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
        baseSpeed: 175,
        pointGain: 20
    }
];

/**
 * Enum usado para escolher inimigos.
 */
export enum enemyEnum {
    CHUPACU
};