import { Directions } from "../types";

export default class AnimationManager {
    private scene: Phaser.Scene;
    private animKeys: Map<string, false | Phaser.Animations.Animation> = new Map();

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    createStandardWalkAnimation(key: string) {
        const config: Phaser.Types.Animations.Animation[] = [
            {
                key: `${key}_${Directions.UP}`,
                frames: this.scene.anims.generateFrameNumbers(key, { frames: [10, 11] }),
                frameRate: 4,
                repeat: -1
            },
            {
                key: `${key}_${Directions.DOWN}`,
                frames: this.scene.anims.generateFrameNumbers(key, { frames: [1, 2] }),
                frameRate: 4,
                repeat: -1
            },
            {
                key: `${key}_${Directions.LEFT}`,
                frames: this.scene.anims.generateFrameNumbers(key, { frames: [7, 8] }),
                frameRate: 4,
                repeat: -1
            },
            {
                key: `${key}_${Directions.RIGHT}`,
                frames: this.scene.anims.generateFrameNumbers(key, { frames: [4, 5] }),
                frameRate: 4,
                repeat: -1
            }
        ];
        config.forEach(
            (it) => {
                const anim = this.scene.anims.create(it);
                if(anim) this.animKeys.set(anim.key, anim);
            }
        );
    }
}