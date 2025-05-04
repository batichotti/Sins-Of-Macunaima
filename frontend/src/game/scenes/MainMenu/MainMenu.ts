import { GameObjects, Scene } from 'phaser';
import { EventBus } from '@/game/scenes/Services/EventBus';
import { WindowResolution, Text } from '@/components/configs/Properties'

export class MainMenu extends Scene {
    background!: GameObjects.Image;
    logo!: GameObjects.Image;
    title!: GameObjects.Text;
    logoTween!: Phaser.Tweens.Tween | null;

    constructor () {
        super('MainMenu');
    }

    create () {
        const textoTitulo = this.add.text(
            WindowResolution.width / 2, WindowResolution.height * 0.40, 
            'Sins of Macunaíma',
            Text.Title2
        ).setOrigin(0.5).setDepth(100);

        this.title = this.add.text(WindowResolution.width / 2, WindowResolution.height * 0.48, 'Menu Principal', 
            Text.Title1
        ).setOrigin(0.5).setDepth(100);

        const btnJogar = this.add.text(
            WindowResolution.width / 2, WindowResolution.height * 0.55, 'Jogar',
            Text.Title1
        ).setOrigin(0.5).setDepth(100).setInteractive();

        btnJogar.on('pointerover', () => {
            btnJogar.setStyle({ fill: '#788000' });
        });

        btnJogar.on('pointerout', () => {
            btnJogar.setStyle({ fill: '#FFFFFF' });
        });

        btnJogar.on('pointerdown', () => {
            // TODO: Decidir a 'role' do jogador e o cenário inicial
            this.scene.start('Loader', {targetScene: 'Mapa', previousScene: 'MainMenu'});
        });

        EventBus.emit('current-scene-ready', this);
    }
}