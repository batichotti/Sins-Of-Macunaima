import { IMelee, MeleeEnum, MeleeTypes, WeaponType } from "./Weapon";

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

export enum EnemyEnum {
    CHUPACU,
    COLONIZADOR
}

/**
 * Array com os inimigos. Necessário para o 'EnemyManager' gerar um aleatoriamente.
 */
export const EnemyTypes: Record<EnemyEnum, IEnemy> = {
    [EnemyEnum.CHUPACU]: { 
        name: 'Chupa-cú', 
        spriteKey: 'Macunaima', 
        spawnRegion: 'Floresta',
        weapon: MeleeTypes[MeleeEnum.BENGALA],
        baseHealth: 200,
        baseSpeed: 200,
        damageMultiplier: 1.2,
        pointGain: 20
    },
    [EnemyEnum.COLONIZADOR]: { 
        name: 'Colonizador', 
        spriteKey: 'Colonizador', 
        spawnRegion: 'Praia',
        weapon: MeleeTypes[MeleeEnum.ESPADA],
        baseHealth: 200, 
        baseSpeed: 200,
        damageMultiplier: 1.2,
        pointGain: 20
    }
};

export enum BossEnum {
    CURURE
}

export const BossTypes: Record<BossEnum, IEnemy> = {
    [BossEnum.CURURE]: { 
        name: 'Curu-Ré', 
        spriteKey: 'TODO', 
        spawnRegion: 'PlanicieClaraSuperior',
        weapon: MeleeTypes[MeleeEnum.PAULADA],
        baseHealth: 1500,
        baseSpeed: 150,
        damageMultiplier: 1.2,
        pointGain: 500
    }
};