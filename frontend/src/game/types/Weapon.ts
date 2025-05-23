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
     * Chave do sprite usado.
     * 
     * Deve corresponder exatamente ao nome do asset.
     */
    spriteKey: string;


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

    /**
     * Duração do ataque.
     */
    duration: number;

    /**
     * Alcance do ataque.
     */
    range: number;
}

/**
 * Stats base para os projéteis.
 */
export const BaseProjectileStats = {
    /**
     * Quantos projéteis o pool pai deve fazer.
     */
    groupSize: 50,

    /**
     * CoolDown base.
     */
    cooldown: 300,

    /**
     * Velocidade base.
     */
    speed: 300,

    /**
     * Dano base.
     */
    damage: 50
}

/**
 * Contém os projéteis disponíveis.
 */
export const ProjectileTypes: IProjectile[] = [
    { name: 'Flecha', weaponType: WeaponType.PROJECTILE, spriteKey: 'arrow_sprite', baseDamage: 40, baseCooldown: 150, baseSpeed: 500 }
];

/**
 * Usado para escolher os projéteis.
 */
export enum ProjectileEnum {
    FLECHA
}

/**
 * Contém os projéteis disponíveis.
 */
export const MeleeTypes: IMelee[] = [
    { name: 'Bananeira', weaponType: WeaponType.MELEE, baseDamage: 75, baseCooldown: 350, range: 32, duration: 50 }
];

/**
 * Usado para escolher os projéteis.
 */
export enum MeleeEnum {
    BANANEIRA
}