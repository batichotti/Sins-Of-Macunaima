import { Scene } from 'phaser';
import { WindowResolution } from '@/components/configs/Properties';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init() {
        // Valores base
        const outlineWidth = WindowResolution.width * 0.65;
        const outlineHeight = WindowResolution.height * 0.04;
        const maxBarWidth = outlineWidth - 2;
    
        // Moldura centralizada
        this.add.rectangle(
            WindowResolution.width / 2,
            WindowResolution.height / 2,
            outlineWidth,
            outlineHeight
        ).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(
            (WindowResolution.width / 2) - (outlineWidth / 2) + 1,
            WindowResolution.height / 2,
            0,
            outlineHeight - 2,
            0xffffff
        ).setOrigin(0, 0.5);
    
        // Atualização de progresso
        this.load.on('progress', (progress: number) => {
            bar.width = maxBarWidth * progress;
        });
    }

    preload ()
    {
        //  Especifica caminho base dos assets.
        this.load.setPath('assets');

        // Galinha / Jogador
        this.load.spritesheet('galinha', 'gpt-macunaima.png', { frameWidth: 600, frameHeight: 600 });

        // Mapa de tiles
        this.load.image('tiles', 'TileSet.png');

        // Um dos cenários
        this.load.tilemapTiledJSON('mapa', 'SoMTeste.json');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');

        // Plano de fundo (do menu principal)
        this.load.image('background', 'bg.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
