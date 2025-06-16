import { IMelee, MeleeEnum, MeleeTypes } from "./Weapon";

export interface WaypointNode {
    point: Phaser.Math.Vector2;
    g: number;
    h: number;
    f: number;
    parent: WaypointNode | null;
}

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
    COLONIZADOR,
    COBRA_CORAL
}

/**
 * Array com os inimigos. Necessário para o 'EnemyManager' gerar um aleatoriamente.
 */
export const EnemyTypes: Record<EnemyEnum, IEnemy> = {
    [EnemyEnum.COLONIZADOR]: {
        name: 'Colonizador',
        spriteKey: 'Colonizador',
        spawnRegion: 'Praia',
        weapon: MeleeTypes[MeleeEnum.ESPADA],
        baseHealth: 20,
        baseSpeed: 200,
        damageMultiplier: 1.2,
        pointGain: 20
    },
    [EnemyEnum.COBRA_CORAL]: {
      name: 'Cobra Coral',
      spriteKey: 'Snake',
      spawnRegion: 'all',
      weapon: MeleeTypes[MeleeEnum.PICADA],
      baseHealth: 15,
      baseSpeed: 220,
      damageMultiplier: 1.05,
      pointGain: 20
    }
};

export enum BossEnum {
  CURURE
}

export const BossTypes: Record<BossEnum, IEnemy> = {
    [BossEnum.CURURE]: {
        name: 'Curu-Ré',
        spriteKey: 'Peri',
        spawnRegion: 'Floresta',
        weapon: MeleeTypes[MeleeEnum.PAULADA],
        baseHealth: 150,
        baseSpeed: 150,
        damageMultiplier: 1.5,
        pointGain: 500
    }
};
