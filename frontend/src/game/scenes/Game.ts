import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Text } from '../../components/configs/Properties'

export class Game extends Scene
{
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.Image;
    gameText!: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.gameText = this.add.text(Text.Resolution.width, Text.Resolution.height, 'Finja que há uma telinha emocionante aqui',
            Text.Properties_1
        ).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
