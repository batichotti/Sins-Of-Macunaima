export default class TweenManager {
    private static instance: TweenManager;

    static get Instance() {
        if(!TweenManager.instance) {
            TweenManager.instance = new TweenManager();
        }
        return TweenManager.instance;
    }

    damageTween(sprite: Phaser.Physics.Arcade.Sprite) {
        sprite.setTint(0xff0000);
        const tween = sprite.scene.tweens.add(
            {
                targets: sprite,
                tint: 0xffffff,
                duration: 150,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    tween.destroy();
                }
            }
        );
    }

    healTween(sprite: Phaser.Physics.Arcade.Sprite) {
        sprite.setTint(0x1ced11);
        const tween = sprite.scene.tweens.add(
            {
                targets: sprite,
                tint: 0xffffff,
                duration: 150,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    tween.destroy();
                }
            }
        );
    }
}