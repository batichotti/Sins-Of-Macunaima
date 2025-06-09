import { MatchData, SceneData } from "../types";

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
      const gameOverText = this.add.text(width / 2, height / 2, 'Você morreu', {
          fontSize: '32px',
          color: '#ffffff',
          align: 'center'
      }).setOrigin(0.5);
      const restartButton = this.add.text(width / 2, height / 2 + 50, 'Tentar de novo', {
          fontSize: '24px',
          color: '#ffffff',
          align: 'center'
      }).setOrigin(0.5).setInteractive();

      restartButton.on('pointerdown', () => {
        const data: SceneData = {
          targetScene: this.prevSceneData.scene,
          previousScene: this.constructor.name,
          weaponSet: this.prevSceneData.data.player.weaponSet,
          player: this.prevSceneData.data.player,
          level: this.prevSceneData.data.player.level,
          character: this.prevSceneData.data.player.playableCharacters[0]
        };
        this.scene.start(this.prevSceneData.scene, data);
      });
  }
}
