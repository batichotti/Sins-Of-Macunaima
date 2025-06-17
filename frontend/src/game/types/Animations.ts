
/**
 * Indica a direção do corpo.
 */
export enum Directions {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}

export interface IAnimationManager {
  scene: Phaser.Scene;
  animations: Map<string, Phaser.Animations.Animation>;
  createStandardWalkAnimation(key: string, config: CharacterAnimationTemplate): void;
  createStandardAttackAnimation(key: string, config: WeaponAnimationTemplate): void; 
}

/**
 * Usar para definir frames de cada direção.
 */
 export type CharacterAnimationTemplate = {
   framerate: number;
   repeat: number;
   up: { start: number; end: number };
   down: { start: number; end: number };
   left: { start: number; end: number };
   right: { start: number; end: number };
 };

 export const DefaultCharacterAnimationTemplate: CharacterAnimationTemplate = {
   framerate: 4,
   repeat: -1,
   up: { start: 10, end: 11 },
   down: { start: 1, end: 2 },
   left: { start: 7, end: 8 },
   right: { start: 4, end: 5 },
};

export const CharacterAnimConfigs: Record<string, CharacterAnimationTemplate> = {
  'Snake': {
    framerate: 4,
    repeat: -1,
    up: { start: 0, end: 2 },
    down: { start: 3, end: 5 },
    left: { start: 0, end: 2 },
    right: { start: 3, end: 5 },
  },
  'CR7': {
    framerate: 4,
    repeat: -1,
    up: { start: 1, end: 2 },
    down: { start: 1, end: 2 },
    left: { start: 2, end: 2 },
    right: { start: 1, end: 2 },
  }
};

/**
 * Para as armas.
 */
export type WeaponAnimationTemplate = {
  framerate: number;
  repeat: number;
  sequence: { start: number; end: number };
};

export const DefaultWeaponAnimationTemplate: WeaponAnimationTemplate = {
  framerate: 4,
  repeat: 0,
  sequence: { start: 0, end: 2 },
};

export const WeaponAnimConfigs: Record<string, WeaponAnimationTemplate> = {
};
