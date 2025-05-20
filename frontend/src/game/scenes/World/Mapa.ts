import { BaseScene } from '@/game/core/BaseScene';
import { SceneData } from '@/game/types';
import TextBox from '@/game/components/TextBox';
import EnemyManager from '@/game/entities/EnemyManager';

export class Mapa extends BaseScene {
    textBoxes:TextBox[] = [];
    enemyManager: EnemyManager;
    constructor() {
        super({ key: 'Mapa' });
    }

    init(data: SceneData): void {
        super.init(data);
    }

    create(): void {
        super.create();
        this.enemyManager = new EnemyManager(this);
        this.textBoxes[0] = new TextBox(this, { x: 200, y: 50 } as Phaser.Math.Vector2, { x: 10, y: 10 } as Phaser.Math.Vector2);
        this.textBoxes[0].setText(`Jogador: ${this.player.name}`);
        this.textBoxes[0].show();

        this.textBoxes[1] = new TextBox(this, { x: 300, y: 50 } as Phaser.Math.Vector2, { x: 220, y: 10 } as Phaser.Math.Vector2);
        this.textBoxes[1].setText(`Personagem: ${this.player.character.name}`);
        this.textBoxes[1].show();

        this.textBoxes[2] = new TextBox(this, { x: 100, y: 50 } as Phaser.Math.Vector2, { x: 530, y: 10 } as Phaser.Math.Vector2);
        this.textBoxes[2].setText(`Nível: ${this.player.level.level}`);
        this.textBoxes[2].show();

        this.textBoxes.map(t => this.gameCameras.main.ignore(t));
    }
    update(time: number, delta: number): void {
        super.update(time, delta);
    }
}