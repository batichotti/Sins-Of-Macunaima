import { Text } from "../components/Properties";
import { MatchData, SceneData } from "../types";

export default class GameOver extends Phaser.Scene {
  private prevSceneData: MatchData | null = null;
  private container: Phaser.GameObjects.Container;

  constructor() {
    super('GameOver');
  }

  init(data?: MatchData) {
    if(data) this.prevSceneData = data;
  }

  create() {
    const { width, height } = this.scale;
    this.container = this.add.container(width * 0.5, height * 0.35);

    const gameOverTitle = `Você morreu.`;
    const background = this.add.graphics().fillStyle(0x000000, 0.8).fillRoundedRect(-width * 0.35, -height * 0.16, width * 0.7, height * 0.7);
    const gameOverText = this.add.text(0, 0, gameOverTitle, Text.Title2).setOrigin(0.5);
    const scoreText = this.add.text(0, 75, `Pontuação: ${this?.prevSceneData?.data?.pointsGained ?? 0}`, Text.Content).setOrigin(0.5);
    const timeElapsed = this.add.text(0, 125, `Tempo: ${this.formatTime(this?.prevSceneData?.data?.timeElapsed ?? 0)}`, Text.Content).setOrigin(0.5);

    const restartButton = this.add.text(0, 200, 'Tentar de novo', Text.Content).setOrigin(0.5).setInteractive();
    const mainMenuButton = this.add.text(0, 250, 'Voltar ao menu principal', Text.Content).setOrigin(0.5).setInteractive();

    this.container.add([background, gameOverText, scoreText, timeElapsed, restartButton, mainMenuButton]);

    restartButton.on('pointerdown', () => {
      if(this.prevSceneData?.data && this.prevSceneData?.scene) {
        const resetData: SceneData = {
          targetScene: this.prevSceneData.scene,
          previousScene: 'GameOver',
          weaponSet: this.prevSceneData.data.player.weaponSet,
          player: this.prevSceneData.data.player,
          level: this.prevSceneData.data.player.level,
          character: this.prevSceneData.data.player.playableCharacters?.[0]
        };

        this.scene.start(this.prevSceneData.scene, resetData);
      } else {
        console.warn('GameOver: Dados não encontrados, redirecionando para Boot');
        this.scene.start('Boot');
      }
    });

    restartButton.on('pointerover', () => {
      const tween = this.tweens.add({
        targets: restartButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150,
        ease: 'Power2',
        onComplete: () => { tween.destroy() }
      });
    });

    restartButton.on('pointerout', () => {
      const tween = this.tweens.add({
        targets: restartButton,
        scaleX: 1.,
        scaleY: 1.,
        duration: 150,
        ease: 'Power2',
        onComplete: () => { tween.destroy() }
      });
    });

    // Handler para voltar ao menu principal
    mainMenuButton.on('pointerdown', () => {
      // Lógica para voltar ao menu principal.
    });

    mainMenuButton.on('pointerover', () => {
      const tween = this.tweens.add({
        targets: mainMenuButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150,
        ease: 'Power2',
        onComplete: () => { tween.destroy() }
      });
    });

    mainMenuButton.on('pointerout', () => {
      const tween = this.tweens.add({
        targets: mainMenuButton,
        scaleX: 1.,
        scaleY: 1.,
        duration: 150,
        ease: 'Power2',
        onComplete: () => { tween.destroy() }
      });
    });

  }

  private formatTime(time: number): string {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    if (minutes === 0) return `${seconds}s`;
    else return `${minutes}m: ${seconds < 10 ? '0' : ''}${seconds}s`;
  }
}
