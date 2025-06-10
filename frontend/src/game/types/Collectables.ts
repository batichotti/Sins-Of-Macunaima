/**
* Vetor de pares { 'string' | 'Phaser.Math.Vector2' }
*/
export interface CollectablePoints {
  name: string;
  position: Phaser.Math.Vector2;
}

/**
* Coletáveis que podem ser dropados
*/
export enum Collectables {
  MUIRAQUITA = 'muiraquita'
}
