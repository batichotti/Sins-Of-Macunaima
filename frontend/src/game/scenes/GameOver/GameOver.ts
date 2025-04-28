import { EventBus } from '@/game/scenes/Services/EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene {
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.Image;
    gameOverText!: Phaser.GameObjects.Text;

    constructor() {
        super('GameOver');
    }

    create() {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xFFFFFF);
        const falas = [
            "No meio das densas florestas, um ser intrépido aparece.",
            "Você sente uma ardência.",
            "Aconteceu...",
            "O seu rabo foi arrombado...",
            "Pelo chupa-cú."
        ];
        EventBus.emit('current-scene-ready', this);
    }

    update(): void {
    }

    changeScene() {
        this.scene.start('MainMenu');
    }
}
