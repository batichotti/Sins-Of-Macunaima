import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Text } from '../../components/configs/Properties'

export class GameOver extends Scene
{
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.Image;
    gameOverText!: Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        this.gameOverText = this.add.text(Text.Resolution.width, Text.Resolution.height, 'O chupa-cú chegou', 
            Text.Properties_2
        ).setOrigin(0.5).setDepth(100);
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
