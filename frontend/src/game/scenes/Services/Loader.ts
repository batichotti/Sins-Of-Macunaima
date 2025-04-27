import { Scene } from 'phaser';
import { WindowResolution } from '@/components/configs/Properties';
import { PathScenarios } from '@/components/configs/SceneManager';

interface SceneTransferData {
    targetScene: string;
    previousScene: string;
}


export class Loader extends Scene {
    targetScene!: string;
    previousScene!: string;
    constructor() {
        super('Loader');
    }

    init(data: SceneTransferData) {
        this.targetScene = data?.targetScene;
        this.previousScene = data?.previousScene;
        this.loadingBar();

    }

    preload() {
        this.loadScenario();
    }

    create() {
        this.scene.start(this.targetScene, {targetScene: this.targetScene, previousScene: this.previousScene});
    }

    private loadingBar(): void {
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

    private loadScenario(): void {
        if(this.targetScene) {
            this.load.setPath('assets');
            this.load.tilemapTiledJSON(this.targetScene, `${PathScenarios}${this.targetScene}.json`);
        } 
        // Caso seja null
        else {

        }
    }
}