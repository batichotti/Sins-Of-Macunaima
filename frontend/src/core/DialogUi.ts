import { Scene } from 'phaser';
import { Text } from '@/components/configs/Properties';

export default class DialogUi {
  private scene: Scene;
  private width: number;
  private height: number;
  private container: Phaser.GameObjects.Container;
  private dialogBox: Phaser.GameObjects.Rectangle;
  private dialogText: Phaser.GameObjects.Text;
  private position: { x: number; y: number };
  private currentTextIndex = 0;
  private texts: string[] = [];

  constructor(scene: Scene, width: number, height: number, position: { x: number; y: number }) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.position = position;

    this.dialogBox = this.scene.add.rectangle(0, 0, width, height, 0x000000, 1).setOrigin(0, 0);

    this.dialogText = this.scene.add.text(
      width * 0.1,
      height * 0.1,
      '',
      { ...Text.Dialog1, wordWrap: { width: width * 0.8 } }
    );
    this.container = this.scene.add.container(
      this.position.x,
      this.position.y,
      [this.dialogBox, this.dialogText]
    ).setActive(false);
  }

  showDialog(texts: string[]): void {
    this.texts = texts;
    this.currentTextIndex = 0;
    this.updateText();
    this.container.setActive(true);
    this.scene.input.once('pointerdown', () => this.nextText());
  }

  private nextText(): void {
    this.currentTextIndex++;
    if (this.currentTextIndex < this.texts.length) {
      this.updateText();
      this.scene.input.once('pointerdown', () => this.nextText());
    } else {
      this.hideDialog();
    }
  }

  private updateText(): void {
    this.dialogText.setText(this.texts[this.currentTextIndex]);
  }

  hideDialog(): void {
    this.container.setActive(false);
    this.scene.input.off('pointerdown', () => this.nextText());
  }

  get isVisible(): boolean {
    return this.container.active;
  }
}