import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { WindowResolution, Text } from '../../components/configs/Properties'

export class MainMenu extends Scene
{
    background!: GameObjects.Image;
    logo!: GameObjects.Image;
    title!: GameObjects.Text;
    logoTween!: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {

        const textoTitulo = this.add.text(
            WindowResolution.width / 2, WindowResolution.height * 0.40, 
            'Sins of Macunaíma',
            Text.Properties_2
        ).setOrigin(0.5).setDepth(100);

        this.title = this.add.text(WindowResolution.width / 2, WindowResolution.height * 0.48, 'Menu Principal', 
            Text.Properties_1
        ).setOrigin(0.5).setDepth(100);

        const btnJogar = this.add.text(
            WindowResolution.width / 2, WindowResolution.height * 0.55, 'Jogar',
            Text.Properties_1
        ).setOrigin(0.5).setDepth(100).setInteractive();

        btnJogar.on('pointerover', () => {
            btnJogar.setStyle({ fill: '#788000' });
        });

        btnJogar.on('pointerout', () => {
            btnJogar.setStyle({ fill: '#FFFFFF' });
        });

        btnJogar.on('pointerdown', () => {
            this.scene.start('GameOver');
        });

        EventBus.emit('current-scene-ready', this);
    }
}
