import { Scene } from 'phaser';
import { WindowResolution } from '@/components/configs/Properties';
import { TilePaths, TileSets } from '@/components/configs/PathTiles';

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
        this.load.spritesheet('player', 'Characters/Macunaima/Sprite/Macunaima_idle_front.png', { frameWidth: 32, frameHeight: 32 });

        // Tiles
        TileSets.forEach((tile) => {
            this.load.image(`${tile}`, `tiles/${TilePaths.extruded}/${tile}.png`);
        });


        // Um dos cenários
        this.load.tilemapTiledJSON('praia', 'tiles/TileD/cenariosJson/planicie.json');

    }

    create() {
        this.scene.start('MainMenu');
    }
}
