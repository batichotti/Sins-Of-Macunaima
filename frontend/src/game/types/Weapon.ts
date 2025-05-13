/**
 * Arma usada pelo jogador.
 */
export interface IWeapon {
    /**
     * Nome da arma (ava).
     */
    name: string;

    /**
     * Chave do sprite usado.
     * 
     * Deve corresponder exatamente ao nome do asset.
     */
    spriteKey: string;

    /**
     * Dano base causado.
     */
    baseDamage: number;

    /**
     * CoolDown base.
     */
    baseCoolDown: number;
}

/**
 * Arma do tipo projétil
 */
export interface IProjectile extends IWeapon {
    /**
     * Velocidade de disparo base da arma.
     */
    baseSpeed: number;
}

/**
 * Stats base para os projéteis.
 */
export const BaseProjectileStats = {
    /**
     * Quantas projéteis o pool pai deve fazer.
     */
    groupSize: 40,

    /**
     * CoolDown base.
     */
    cooldown: 150,

    /**
     * Velocidade base.
     */
    speed: 300,

    /**
     * Dano base.
     */
    damage: 200
}