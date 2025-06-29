import { Text } from "../components/Properties";
import { MatchData } from "../types";
import { EventBus } from "./EventBus";

export default class GameWin extends Phaser.Scene {
  private prevSceneData: MatchData | null = null;
  private container: Phaser.GameObjects.Container;

  constructor() {
    super('GameWin');
  }

  init(data?: MatchData) {
    if(data) this.prevSceneData = data;
  }

  create() {
    const { width, height } = this.scale;
    this.container = this.add.container(width * 0.5, height * 0.35);

    const background = this.add.graphics().fillStyle(0x000000, 0.8).fillRoundedRect(-width * 0.35, -height * 0.16, width * 0.7, height * 0.7);
    const gameWinTitle = `Você derrotou o chefe\ne conseguiu o Item especial.`;
    const gameOverText = this.add.text(0, 0, gameWinTitle, Text.Title2).setOrigin(0.5);
    const scoreText = this.add.text(0, 125, `Pontuação: ${this?.prevSceneData?.data?.pointsGained ?? 0}`, Text.Content).setOrigin(0.5);
    const timeElapsed = this.add.text(0, 175, `Tempo: ${this.formatTime(this?.prevSceneData?.data?.timeElapsed ?? 0)}`, Text.Content).setOrigin(0.5);

    const continueButton = this.add.text(0, 225, 'Continuar jogando', Text.Content).setOrigin(0.5).setInteractive();
    const mainMenuButton = this.add.text(0, 275, 'Voltar ao menu principal', Text.Content).setOrigin(0.5).setInteractive();

    this.container.add([background, gameOverText, scoreText, timeElapsed, continueButton, mainMenuButton]);

    continueButton.on('pointerdown', () => {
      this.backedTransfer();

      if(this.prevSceneData?.scene) {
        this.scene.resume(this.prevSceneData.scene);
        this.scene.stop('GameWin');
      } else {
        console.warn('GameWin: Não foi possível retomar a cena, redirecionando para Boot');
        this.scene.start('Boot');
      }
    });

    continueButton.on('pointerover', () => {
      const tween = this.tweens.add({
        targets: continueButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150,
        ease: 'Power2',
        onComplete: () => { tween.destroy() }
      });
    });

    continueButton.on('pointerout', () => {
      const tween = this.tweens.add({
        targets: continueButton,
        scaleX: 1.,
        scaleY: 1.,
        duration: 150,
        ease: 'Power2',
        onComplete: () => { tween.destroy() }
      });
    });

    // Handler para voltar ao menu principal
    mainMenuButton.on('pointerdown', () => {
      this.backedTransfer();
      this.returnMainMenu();
      // Lógica para o menu principal.
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

    private backedTransfer() {
      if(this.prevSceneData) EventBus.emit('backendTransfer', this.prevSceneData);
    }
  
    private returnMainMenu() {
      EventBus.emit('mainMenu');
    }
}
