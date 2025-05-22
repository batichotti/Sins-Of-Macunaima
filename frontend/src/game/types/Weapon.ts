/**
 * Define se a arma é de curto ou longo alcance.
 */
export enum WeaponType {
    /**
     * É um projétil.
     */
    PROJECTILE,

    /**
     * É uma arma de combate corpo-a-corpo.
     */
    MELEE
}

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
    baseCooldown: number;

    /**
     * O tipo da arma.
     */
    weaponType: WeaponType
}

/**
 * Set de armas. Uma de curta distância e outra e um projétil.
 */
export interface WeaponSet {
    projectile: IProjectile;
    melee: IMelee;
}

/**
 * Arma do tipo projétil.
 */
export interface IProjectile extends IWeapon {
    /**
     * Tipo de arma.
     */
    weaponType: WeaponType.PROJECTILE;

    /**
     * Velocidade de disparo base do projétil.
     */
    baseSpeed: number;
}

export interface IMelee extends IWeapon {
    /**
     * Tipo de arma.
     */
    weaponType: WeaponType.MELEE;
}

/**
 * Stats base para os projéteis.
 */
export const BaseProjectileStats = {
    /**
     * Quantas projéteis o pool pai deve fazer.
     */
    groupSize: 50,

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