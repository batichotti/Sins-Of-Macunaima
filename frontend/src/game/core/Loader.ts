import { Scene } from 'phaser';
import { PathScenarios } from '@/game/components/PathAssets';
import { ICharacter, ILevel, IPlayerExport, SceneData, WeaponSet } from '../types';

/**
 * Cena genérica cuja função é carregar assets específicos da cena de destino.
 * 
 * Muitas vezes, apenas se carrega o tilemap.
 */
export class Loader extends Scene {
    /**
     * Cena de destino.
     */
    private targetScene!: string;

    /**
     * Cena de origem.
     */
    private previousScene!: string;

    /**
     * Dados do jogador. Que serão obtidos do boot.
     */
    private player!: IPlayerExport;

    /**
     * Dados do personagem. Que serão obtidos do boot.
     */
    private character!: ICharacter;

    /**
     * Dados do jogador. Que serão obtidos do boot.
     */
    private level!: ILevel;

    /**
     * Dados do personagem. Que serão obtidos do boot.
     */
    private weaponSet!: WeaponSet;


    constructor() {
        super('Loader');
    }

    preload() {
        this.loadScenario();
    }

    init(data: SceneData) {
        this.targetScene = data.targetScene;
        this.previousScene = data.previousScene;
        this.player = data.player;
        this.character = data.character;
        this.level = data.level;
        this.weaponSet = data.weaponSet;
    }

    create() {
        this.scene.stop(this.constructor.name);
        this.scene.start(this.targetScene, { targetScene: this.targetScene, previousScene: this.previousScene, player: this.player, character: this.character, level: this.level, weaponSet: this.weaponSet } as SceneData );
    }

    private loadScenario(): void {
        if(this.targetScene) {
            this.load.setPath('assets');
            this.load.tilemapTiledJSON(this.targetScene, `${PathScenarios}${this.targetScene}.json`);
        }
    }
}