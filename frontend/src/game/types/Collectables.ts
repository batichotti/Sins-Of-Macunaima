import { BaseScene } from "../core/BaseScene";

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
  * Os coletáveis.
  *
  * Usar `Phaser.GameObjects.Group` para otimização.
  */
  children: Phaser.GameObjects.Group;

  /**
  * O número máximo de coletáveis que podem estar vivos ao mesmo tempo.
  */
  maxAliveCollectables: number;

  /**
  * Cena pai.
  */
  scene: BaseScene;
}

/**
 * Coletáveis regulares possíveis.
 */
export enum RegularCollectableEnum {
}

/**
 * Coletáveis especiais.
 */
export enum EspecialCollectableEnum {
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
   * Tipo de coletável.
   */
  typee: RegularCollectableEnum | EspecialCollectableEnum;
}

/**
 * Array com os coletáveis. Necessário para o 'CollectableManager' gerar um aleatoriamente.
 */
export const CollectableTypes: Record<RegularCollectableEnum | EspecialCollectableEnum, ICollectable> = {
  [EspecialCollectableEnum.MUIRAQUITA]: {
    name: 'Muiraquitã',
    spriteKey: 'Muiraquita',
    typee: EspecialCollectableEnum.MUIRAQUITA,
  }
};
