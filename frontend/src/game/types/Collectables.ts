import { BaseScene } from "../core/BaseScene";
import { MeleeEnum, MeleeTypes, ProjectileEnum } from "./Weapon";

/**
* Vetor de pares { 'string' | 'Phaser.Math.Vector2' }
*/
export interface CollectablePoints {
  name: string;
  position: Phaser.Math.Vector2;
}

/**
 * Classe que manuseia coletáveis no jogo.
 */
export interface ICollectableManager {
  /**
  * Pontos onde um coletável aparece.
  */
  points: CollectablePoints[];

  /**
  * O número máximo de coletáveis que podem estar vivos ao mesmo tempo.
  */
  maxAliveCollectables: number;

  /**
   * Os coletáveis especiais já dropados.
   */
  specialCollectables: Map<SpecialCollectableEnum, number>;

  /**
   * Os coletáveis regulares já dropados.
   */
  regularCollectables: Map<RegularCollectableEnum, number>;

  /**
   * Os projétis já dropados.
   */
  projectileCollectables: Map<ProjectileEnum, number>;

  /**
   * As armas corpo-a-corpo já dropadas.
   */
  meleeCollectables: Map<MeleeEnum, number>;

  /**
  * Cena pai.
  */
  scene: BaseScene;
}

/**
 * Coletáveis regulares possíveis.
 */
export enum RegularCollectableEnum {
  GRAVETO
}

/**
 * Coletáveis especiais.
 */
export enum SpecialCollectableEnum {
  MUIRAQUITA
}

/**
 * Contém informações base dos coletáveis.
 */
 export interface ICollectable {
  /**
  * Nome do coletável.
  */
  name: string;

  /**
  * Sprite do coletável.
  */
  spriteKey: string;

  /**
   * É dropável?
   */
  dropable?: boolean;

  /**
   * Tipo de coletável.
   */
  typee: RegularCollectableEnum | SpecialCollectableEnum | ProjectileEnum | MeleeEnum;
}

/**
 * Array com os coletáveis. Necessário para o 'CollectableManager' gerar um aleatoriamente.
 */
export const RegularCollectableTypes: Record<RegularCollectableEnum, ICollectable> = {
  [RegularCollectableEnum.GRAVETO]: {
    name: 'Graveto',
    spriteKey: 'Graveto',
    typee: RegularCollectableEnum.GRAVETO,
    dropable: true
  }
};

export const EspecialCollectableTypes: Record<SpecialCollectableEnum, ICollectable> = {
  [SpecialCollectableEnum.MUIRAQUITA]: {
    name: 'Muiraquitã',
    spriteKey: 'Muiraquita',
    typee: SpecialCollectableEnum.MUIRAQUITA,
    dropable: true
  }
};

export const ProjectileCollectableTypes: Record<ProjectileEnum, ICollectable> = {
  [ProjectileEnum.FLECHA]: {
    name: 'Flecha',
    spriteKey: 'Flecha',
    typee: ProjectileEnum.FLECHA,
    dropable: true
  }
};

export const MeleeCollectableTypes: Record<MeleeEnum, ICollectable> = {
  [MeleeEnum.BANANEIRA]: {
    name: 'Bananeira',
    spriteKey: MeleeTypes[MeleeEnum.BANANEIRA].spriteKey,
    typee: MeleeEnum.BANANEIRA,
    dropable: true
  },
  [MeleeEnum.BENGALA]: {
    name: 'Bengala',
    spriteKey: MeleeTypes[MeleeEnum.BENGALA].spriteKey,
    typee: MeleeEnum.BENGALA,
    dropable: false
  },
  [MeleeEnum.ESPADA]: {
    name: 'Espada',
    spriteKey: MeleeTypes[MeleeEnum.ESPADA].spriteKey,
    typee: MeleeEnum.ESPADA,
    dropable: false
  },
  [MeleeEnum.PALMEIRA]: {
    name: 'Palmeira',
    spriteKey: MeleeTypes[MeleeEnum.PALMEIRA].spriteKey,
    typee: MeleeEnum.PALMEIRA,
    dropable: true
  },
  [MeleeEnum.PAULADA]: {
    name: 'Paulada',
    spriteKey: MeleeTypes[MeleeEnum.PAULADA].spriteKey,
    typee: MeleeEnum.PAULADA,
    dropable: false
  },
  [MeleeEnum.PICADA]: {
    name: 'Picada',
    spriteKey: 'Picada',
    typee: MeleeEnum.PICADA,
    dropable: false
  }
};
