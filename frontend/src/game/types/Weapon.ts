/**
 * Define o modo de ataque do jogador.
 */
export enum AttackMode {
    /**
     * Ataque automático: o jogo mira automaticamente.
     */
    AUTO,

    /**
     * Ataque manual: o jogador precisa mirar.
     */
    MANUAL
}


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

    /**
     * Duração do ataque.
     */
    duration: number;

    /**
     * Alcance do ataque.
     */
    range: number;

    /**
    * Velocidade de rotação da arma.
    */
    rotationSpeed?: number;

    /**
    * Raio de órbita.
    */
    orbitRadius?: number;
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
    damage: 5
}

/**
 * Usado para escolher os projéteis.
 */
export enum ProjectileEnum {
    FLECHA,
    BOLA
}

/**
 * Contém os projéteis disponíveis.
 */
export const ProjectileTypes: Record<ProjectileEnum, IProjectile> = {
    [ProjectileEnum.FLECHA]: {
        name: 'Flecha',
        weaponType: WeaponType.PROJECTILE,
        spriteKey: 'arrow_sprite',
        baseDamage: 2,
        baseCooldown: 300,
        baseSpeed: 500
    },
    [ProjectileEnum.BOLA]: {
        name: 'Bola',
        weaponType: WeaponType.PROJECTILE,
        spriteKey: 'bola',
        baseDamage: 4,
        baseCooldown: 250,
        baseSpeed: 500
    }
};

/**
 * Usado para escolher as armas corpo-a-corpo.
 */
export enum MeleeEnum {
    BANANEIRA,
    BENGALA,
    ESPADA,
    PAULADA,
    PICADA,
    PALMEIRA
}

export const MeleeTypes: Record<MeleeEnum, IMelee> = {
    [MeleeEnum.PALMEIRA]: {
        name: 'Palmeira',
        spriteKey: 'Palmeira',
        weaponType: WeaponType.MELEE,
        baseDamage: 4,
        baseCooldown: 350,
        range: 32,
        duration: 500,
        rotationSpeed: 5,
        orbitRadius: 100
    },
    [MeleeEnum.BANANEIRA]: {
        name: 'Bananeira',
        spriteKey: 'Palmeira',
        weaponType: WeaponType.MELEE,
        baseDamage: 4,
        baseCooldown: 350,
        range: 32,
        duration: 500,
        rotationSpeed: 5,
        orbitRadius: 100
    },
    [MeleeEnum.BENGALA]: {
        name: 'Bengala',
        spriteKey: 'Palmeira',
        weaponType: WeaponType.MELEE,
        baseDamage: 3,
        baseCooldown: 500,
        range: 32,
        duration: 750,
        rotationSpeed: 5,
        orbitRadius: 100
    },
    [MeleeEnum.ESPADA]: {
        name: 'Espada',
        spriteKey: 'Palmeira',
        weaponType: WeaponType.MELEE,
        baseDamage: 3,
        baseCooldown: 350,
        range: 32,
        duration: 750,
        rotationSpeed: 5,
        orbitRadius: 100
    },
    [MeleeEnum.PAULADA]: {
        name: 'Paulada',
        spriteKey: 'Palmeira',
        weaponType: WeaponType.MELEE,
        baseDamage: 4,
        baseCooldown: 1250,
        range: 64,
        duration: 1000,
        rotationSpeed: 5,
        orbitRadius: 100
    },
    [MeleeEnum.PICADA]: {
        name: 'Picada',
        spriteKey: 'Palmeira',
        weaponType: WeaponType.MELEE,
        baseDamage: 3,
        baseCooldown: 350,
        range: 32,
        duration: 750,
        rotationSpeed: 5,
        orbitRadius: 100
    }
};
