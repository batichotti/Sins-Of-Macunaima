import { BaseScene } from '@/game/core/BaseScene';
import { SceneData } from '@/game/components/Types';
import TextBox from '@/game/core/TextBox';

export class Mapa extends BaseScene {
    textBox!:TextBox;
    constructor() {
        super({ key: 'Mapa' });
    }

    init(data: SceneData): void {
        super.init(data);
    }

    create(): void {
        super.create();
        this.textBox = new TextBox(this, { width: 200, height: 50 }, { x: 10, y: 10 } as Phaser.Math.Vector2);
        this.textBox.setText(`${this.player.playerData.name}: ${this.player.playerData.characterKey}`);
        this.textBox.show();
        this.gameCameras.main.ignore(this.textBox);
    }
    update(time: number, delta: number): void {
        super.update(time, delta);
    }
}