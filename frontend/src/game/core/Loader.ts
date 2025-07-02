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
        const basePath = process.env.NODE_ENV === 'development'
            ? '/assets/'
            : '/assets/';

        this.load.setBaseURL(basePath);

        this.load.on('filecomplete', (key: string, type: string) => {
            if (type === 'tilemapJSON') {
                console.log('Mapa carregado com sucesso:', key);
            }
        });

        this.loadScenario();
    }

    init(data: SceneData) {
        this.targetScene = data.targetScene;
        this.previousScene = data.previousScene;
        this.player = data.player;
        this.character = data.character;
        this.level = data.level;
        this.weaponSet = data.weaponSet;

        // Debug: verificar se os dados estão corretos
        console.log('Carregando cenário:', this.targetScene);
        console.log('Caminho completo:', `${PathScenarios}${this.targetScene}.json`);
    }

    create() {
        // Verificar se o tilemap foi carregado com sucesso
        if (this.cache.tilemap.exists(this.targetScene)) {
            console.log('Tilemap encontrado no cache:', this.targetScene);
        } else {
            console.error('Tilemap não foi carregado:', this.targetScene);
        }

        this.scene.stop(this.constructor.name);
        this.scene.start(this.targetScene, {
            targetScene: this.targetScene,
            previousScene: this.previousScene,
            player: this.player,
            character: this.character,
            level: this.level,
            weaponSet: this.weaponSet
        } as SceneData);
    }

    private loadScenario(): void {
        if (this.targetScene) {
            // Verificar se já foi carregado
            if (this.cache.tilemap.exists(this.targetScene)) {
                console.log('Cenário já carregado:', this.targetScene);
                return;
            }

            const mapPath = `${PathScenarios}${this.targetScene}.json`;
            console.log('Tentando carregar mapa:', mapPath);

            try {
                this.load.tilemapTiledJSON(this.targetScene, mapPath);
            } catch (error) {
                console.error('Erro ao configurar carregamento do mapa:', error);
            }
        } else {
            console.error('targetScene não definido');
        }
    }
}
