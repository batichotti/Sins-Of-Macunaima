import { Scene } from 'phaser';
import { WindowResolution } from '@/components/configs/Properties';

export class Preloader extends Scene {
    constructor() {
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

    preload() {
        //  Especifica caminho base dos assets.
        this.load.setPath('assets');

        //  Jogador
        this.load.spritesheet('player', 'gpt-macunaima.png', { frameWidth: 600, frameHeight: 600 });

        // Mapa de tiles
        this.load.image('tiles', 'tileset_16x16-extruded.png');

        // Um dos cenários
        this.load.tilemapTiledJSON('mapa', 'mapa.json');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');

        // Plano de fundo (do menu principal)
        this.load.image('background', 'bg.png');
    }

    create() {
        this.scene.start('MainMenu');
    }
}
