import { Scene } from 'phaser';
import { PathScenarios } from '@/game/components/configs/SceneManager';
import { SceneData, PlayerData } from '@/game/components/Types';

export class Loader extends Scene {
    targetScene!: string;
    previousScene!: string;
    playerData!: PlayerData;
    constructor() {
        super('Loader');
    }

    preload() {
        this.loadScenario();
    }

    init(data: SceneData) {
        this.targetScene = data?.targetScene;
        this.previousScene = data?.previousScene;
        this.playerData = data?.playerData;
    }

    create() {
        this.scene.stop(this.constructor.name);
        this.scene.start(this.targetScene, { targetScene: this.targetScene, previousScene: this.previousScene, playerData: this.playerData } as SceneData );
    }

    private loadScenario(): void {
        if(this.targetScene) {
            this.load.setPath('assets');
            this.load.tilemapTiledJSON(this.targetScene, `${PathScenarios}${this.targetScene}.json`);
        }
    }
}