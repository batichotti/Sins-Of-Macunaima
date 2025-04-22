import { EventBus } from '@/game/EventBus';
import { Scene } from 'phaser';
import DialogSystem from '@/components/DialogSystem';

export class GameOver extends Scene {
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.Image;
    gameOverText!: Phaser.GameObjects.Text;
    dialogSystem!: DialogSystem;

    constructor() {
        super('GameOver');
    }

    create() {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xFFFFFF);
        this.dialogSystem = new DialogSystem(this);
        const falas = [
            "No meio das densas florestas, um ser intrépido aparece.",
            "Você sente uma ardência.",
            "Aconteceu...",
            "O seu rabo foi arrombado...",
            "Pelo chupa-cú."
        ];
        this.dialogSystem.startDialog(falas);
        //falas.forEach((fala) => {
        //    this.dialogSystem.startDialog(fala);
        //});

        //this.gameOverText = this.add.text(Text.Resolution.width, Text.Resolution.height, 'O chupa-cú chegou', 
        //    Text.Title2
        //).setOrigin(0.5).setDepth(100);
        
        EventBus.emit('current-scene-ready', this);
    }

    update(): void {
        this.dialogSystem.update();
    }

    changeScene() {
        this.scene.start('MainMenu');
    }
}
