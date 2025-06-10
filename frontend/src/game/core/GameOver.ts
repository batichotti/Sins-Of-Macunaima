import { Text } from "../components/Properties";
import { MatchData, SceneData } from "../types";

export default class GameOver extends Phaser.Scene {
  private prevSceneData: MatchData;
  private container: Phaser.GameObjects.Container;
  constructor() {
    super('GameOver');
  }

  init(data: MatchData) {
    this.prevSceneData = data;
  }

  create() {
    const { width, height } = this.scale;

    this.container = this.add.container(width * 0.5, height * 0.35);


      const gameOverText = this.add.text(0, 0, 'Você morreu', Text.Title2).setOrigin(0.5);

      const scoreText = this.add.text(0, 75, `Pontuação: ${this.prevSceneData.data.pointsGained}`, Text.Content).setOrigin(0.5);

      const timeElapsed = this.add.text(0, 125, `Tempo: ${this.formatTime(this.prevSceneData.data.timeElapsed)}`, Text.Content).setOrigin(0.5);

     const restartButton = this.add.text(0, 175, 'Tentar de novo', Text.Content).setOrigin(0.5).setInteractive();

     this.container.add([gameOverText, scoreText, timeElapsed, restartButton]);

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

  private formatTime(time: number): string {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    if (minutes === 0) return `${seconds}s`;
    else return `${minutes}m:${seconds < 10 ? '0' : ''}${seconds}s`;
  }
}
