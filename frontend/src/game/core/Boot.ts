import { Scene } from 'phaser';
import { TilePaths, TileSets } from '@/game/components/configs/PathTiles';
import { WindowResolution } from '@/game/components/configs/Properties';
import { ICharacter, ILevel, IPlayer, IWeapon, SceneData } from '../types';

/**
 * Cena genérica cuja função é carregar assets globais.
 * Além de requisitar dados do jogador para as cenas.
 */
export class Boot extends Scene {
    /**
     * Para qual cena o jogo  deve ir após carregamento dos assets.
     */
    private targetScene = 'Mapa';

    /**
     * Dados do jogador. Que serão obtidos do backend.
     */
    private player: IPlayer;

    /**
     * Dados do personagem. Que serão obtidos do backend.
     */
    private character: ICharacter;

    /**
     * Dados do jogador. Que serão obtidos do backend.
     */
    private level: ILevel;

    /**
     * Dados do personagem. Que serão obtidos do backend.
     */
    private weapon: IWeapon;

    constructor () {
        super('Boot');
    }

    preload () {
        // Especifica caminho dos assets
        this.load.setPath('assets');

        //  Jogador
        this.load.spritesheet('Macunaima', 'Characters/Macunaima/Sprite/Macunaima Idle Front Alt.png', { frameWidth: 17, frameHeight: 30 });

        // Tiles
        TileSets.forEach((tile) => {
            this.load.image(`${tile}`, `tiles/${TilePaths.extruded}/${tile}.png`);
        });

        // Sprites de armas
        this.load.image('arrow_sprite', 'Attacks/Projectiles/Arrows/arrow_sprite.png');


        // Aqui seria o lugar ideal para pegar tudo do backend. Mas enquanto isso contruímos o personagem do zero.
        this.level = { level: 1 } as ILevel;
        this.character = { spriteKey: 'Macunaima', baseLife: 200, baseSpeed: 200 } as ICharacter;
        this.weapon = { name: 'Flecha', spriteKey: 'arrow_sprite', baseDamage: 150, baseCoolDown: 150 } as IWeapon;
        this.player = { name: 'Irineu' } as IPlayer;
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


    create () {
        this.scene.start('Loader', { targetScene: this.targetScene, previousScene: this.constructor.name, player: this.player, character: this.character, level: this.level, weapon: this.weapon } as SceneData);
    }
}