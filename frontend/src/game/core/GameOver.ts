import { MatchData } from "../types";

export default class GameOver extends Phaser.Scene {
  private prevSceneData: MatchData;

  constructor() {
    super('GameOver');
    }

    init(data: MatchData) {
      this.prevSceneData = data;
    }

    create() {
        const { width, height } = this.scale;
        const gameOverText = this.add.text(width / 2, height / 2, 'Game Over', {
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        const restartButton = this.add.text(width / 2, height / 2 + 50, 'Restart', {
            fontSize: '24px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start(this.prevSceneData.scene);
        });
    }
}
