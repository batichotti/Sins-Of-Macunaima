import { Scene } from 'phaser';
import { TilePaths, TileSets } from '@/game/components/PathAssets';
import { WindowResolution } from '@/game/components/Properties';
import { CharacterEnum, CharacterTypes, EnemyTypes, ICharacter, IEnemy, ILevel, IPlayer, MeleeEnum, MeleeTypes, ProjectileEnum, ProjectileTypes, SceneData, WeaponSet, WeaponType } from '../types';

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
    private weaponSet: WeaponSet;

    constructor () {
        super('Boot');
    }

    preload () {
        // Especifica caminho dos assets
        this.load.setPath('assets');

        //  Jogador
        CharacterTypes.forEach(
            (it: ICharacter) => {
                this.load.spritesheet(it.spriteKey, `Characters/${it.spriteKey}/Sprite/${it.spriteKey}_Sprite_Sheet.png`, { frameWidth: 16, frameHeight: 32 });
            }
        );

        EnemyTypes.forEach(
            (it: IEnemy) => {
                this.load.spritesheet(it.spriteKey, `Characters/${it.spriteKey}/Sprite/${it.spriteKey}_Sprite_Sheet.png`, { frameWidth: 16, frameHeight: 32 });
            }
        );

        // Tiles
        TileSets.forEach((tile) => {
            this.load.image(`${tile}`, `tiles/${TilePaths.extruded}/${tile}.png`);
        });

        // Sprites de armas
        this.load.image('arrow_sprite', 'Attacks/Projectiles/Arrows/arrow_sprite.png');


        // Aqui seria o lugar ideal para pegar tudo do backend. Mas enquanto isso construímos o personagem do zero.
        this.level = { level: 1 } as ILevel;
        this.character = CharacterTypes[CharacterEnum.MACUNAIMA];
        this.weaponSet = {
            projectile: ProjectileTypes[ProjectileEnum.FLECHA],
            melee: MeleeTypes[MeleeEnum.BANANEIRA]
        }
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
        this.scene.start('Loader', { targetScene: this.targetScene, previousScene: this.constructor.name, player: this.player, character: this.character, level: this.level, weaponSet: this.weaponSet } as SceneData);
    }
}