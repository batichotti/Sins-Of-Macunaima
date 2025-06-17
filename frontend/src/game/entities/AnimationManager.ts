import { BaseScene } from "../core/BaseScene";
import { CharacterAnimationTemplate, Directions, WeaponAnimationTemplate, IAnimationManager } from "../types";

export default class AnimationManager implements IAnimationManager {
    scene: BaseScene
    animations = new Map<string, Phaser.Animations.Animation>();

    constructor(scene: BaseScene) {
        this.scene = scene;
    }

    createStandardWalkAnimation(
        key: string,
        config: CharacterAnimationTemplate = {
            framerate: 4,
            repeat: -1,
            up: { start: 10, end: 11 },
            down: { start: 1, end: 2 },
            left: { start: 7, end: 8 },
            right: { start: 4, end: 5 }
        }
    ): void {
        const directions = [
            { dir: Directions.UP, frames: config.up },
            { dir: Directions.DOWN, frames: config.down },
            { dir: Directions.LEFT, frames: config.left },
            { dir: Directions.RIGHT, frames: config.right }
        ];

        directions.forEach(({ dir, frames }) => {
          const animKey = `${key}_${dir}`;
          if(!this.checkIfExists(animKey)) this.createAnimation(animKey, key, frames, config.framerate, config.repeat);
        });
    }

    createStandardAttackAnimation(
        key: string,
        config: WeaponAnimationTemplate = {
          framerate: 4,
          repeat: 0,
          sequence: { start: 0, end: 2 },
        }
    ) {
      const animKey = `${key}_attack`;
      if(!this.checkIfExists(animKey)) this.createAnimation(animKey, key, config.sequence, config.framerate, config.repeat);
    }

    private checkIfExists(animKey: string): boolean {
        return this.animations.has(animKey);
    }

    private createAnimation(
        animKey: string,
        spriteKey: string,
        frames: { start: number; end: number },
        framerate: number,
        repeat: number
    ) {
        const animation = this.scene.anims.create({
            key: animKey,
            frames: this.scene.anims.generateFrameNumbers(spriteKey, {
                frames: [frames.start, frames.end]
            }),
            frameRate: framerate,
            repeat: repeat
        });

        if (animation) this.animations.set(animKey, animation);
    }

    public destroy(): void {
        this.animations.forEach(anim => {
            this.scene.anims.remove(anim.key);
        });
        this.animations.clear();
    }
}
