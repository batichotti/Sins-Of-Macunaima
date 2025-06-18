import { Scene } from 'phaser';
import { TilePaths, TileSets } from '@/game/components/PathAssets';
import { WindowResolution } from '@/game/components/Properties';
import { BossTypes, CharacterEnum, CharacterTypes, EnemyTypes, SpecialCollectableTypes, ICharacter, ICollectable, IEnemy, ILevel, IMelee, IPlayer, MeleeEnum, MeleeTypes, ProjectileEnum, ProjectileTypes, RegularCollectableTypes, SceneData, WeaponSet, IProjectile, IMatchStats } from '../types';

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
     * IMatchStats.
     */
    private match: IMatchStats;

    constructor () {
      super('Boot');
    }

    preload () {
        // Especifica caminho dos assets
        this.load.setPath('assets');

        //  Jogador
        Object.values(CharacterTypes).forEach(
          (it: ICharacter) => {
            if(!this.textures.exists(it.spriteKey)) {
              this.load.spritesheet(it.spriteKey, `Characters/${it.spriteKey}/Sprite/${it.spriteKey}_Sprite_Sheet.png`, { frameWidth: 16, frameHeight: 32 });
            }
          }
        );

        // Inimigos
        Object.values(EnemyTypes).forEach(
          (it: IEnemy) => {
            if(!this.textures.exists(it.spriteKey)) {
              this.load.spritesheet(it.spriteKey, `Characters/${it.spriteKey}/Sprite/${it.spriteKey}_Sprite_Sheet.png`, { frameWidth: 16, frameHeight: 32 });
            }
          }
        );

        // Bosses
        Object.values(BossTypes).forEach(
          (it: IEnemy) => {
            if(!this.textures.exists(it.spriteKey)) {
              this.load.spritesheet(it.spriteKey, `Characters/${it.spriteKey}/Sprite/${it.spriteKey}_Sprite_Sheet.png`, { frameWidth: 32, frameHeight: 64 });
            }
          }
        );

        // Corpo-a-Corpo
        Object.values(MeleeTypes).forEach(
          (it: IMelee) => {
            if(!this.textures.exists(it.spriteKey)) {
              this.load.spritesheet(it.spriteKey, `Attacks/Melees/${it.spriteKey}.png`, { frameWidth: 16, frameHeight: 16 });
            }
          }
        );

        // Projéteis
         Object.values(ProjectileTypes).forEach(
          (it: IProjectile) => {
            if(!this.textures.exists(it.spriteKey)) {
              this.load.spritesheet(it.spriteKey, `Attacks/Projectiles/${it.spriteKey}.png`, { frameWidth: 16, frameHeight: 16 });
            }
          }
        );       

        // Coletáveis
        Object.values(RegularCollectableTypes).forEach(
          (it: ICollectable) => {
            if(!this.textures.exists(it.spriteKey)) {
              this.load.spritesheet(it.spriteKey, `Itens/${it.spriteKey}.png`, { frameWidth: 8, frameHeight: 8 });
            }
          }
        );

        Object.values(SpecialCollectableTypes).forEach(
          (it: ICollectable) => {
            if(!this.textures.exists(it.spriteKey)) {
              this.load.spritesheet(it.spriteKey, `Itens/${it.spriteKey}.png`, { frameWidth: 8, frameHeight: 8 });
            }
          }
        );

        // Tiles
        TileSets.forEach((tile) => {
            this.load.image(`${tile}`, `tiles/${TilePaths.extruded}/${tile}.png`);
        });
    }


    init(data: IMatchStats) {
        this.match = data;
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
      this.scene.start('Loader', { targetScene: this.targetScene, previousScene: this.constructor.name, player: this.match.player, character: this.match.player.playableCharacters[0], level: this.match.player.level, weaponSet: this.match.player.weaponSet } as SceneData);
    }
}
