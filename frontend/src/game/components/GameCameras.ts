import { IGameCameras } from "../types";

export default class GameCameras implements IGameCameras {
    main!: Phaser.Cameras.Scene2D.Camera;
    ui!: Phaser.Cameras.Scene2D.Camera;
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    initCameras(width: number, height: number): void {
        this.main = this.scene.cameras.main;
        this.main.setBounds(0, 0, width, height);
        this.main.setScroll(0);
        this.main.setZoom(1);
        this.main.roundPixels = false;

        this.ui = this.scene.cameras.add(0, 0, width, height);
        this.ui.setScroll(0);
    }
}