
/**
 * Indica a direção do corpo.
 */
export enum Directions {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}

/**
 * Usar para definir frames de cada direção.
 */
 export type AnimationTemplate = {
   framerate: number;
   repeat: number;
   up: { start: number; end: number };
   down: { start: number; end: number };
   left: { start: number; end: number };
   right: { start: number; end: number };
 };

 export const DefaultAnimationTemplate: AnimationTemplate = {
   framerate: 4,
   repeat: -1,
   up: { start: 10, end: 11 },
   down: { start: 1, end: 2 },
   left: { start: 7, end: 8 },
   right: { start: 4, end: 5 },
};

export const AnimConfigs: Record<string, AnimationTemplate> = {
  'Snake': {
    framerate: 4,
    repeat: -1,
    up: { start: 0, end: 2 },
    down: { start: 3, end: 5 },
    left: { start: 0, end: 2 },
    right: { start: 3, end: 5 },
  }
};
