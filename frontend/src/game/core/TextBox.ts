import { Scene } from 'phaser';
import { Text } from '@/game/components/configs/Properties';

export default class TextBox extends Phaser.GameObjects.Container {
  size!: { width: number, height: number };
  background!: Phaser.GameObjects.Rectangle;
  text!: Phaser.GameObjects.Text;
  isActive = false;

  constructor(scene: Scene, size: { width: number, height: number }, position: Phaser.Math.Vector2) {
    super(scene, position.x, position.y);
    this.scene = scene;
    this.size = size;
    this.background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.size.width, this.size.height, 0x000000).setOrigin(0).setDepth(10);
    this.text = new Phaser.GameObjects.Text(this.scene, this.size.width / 2, this.size.height / 2, '', { ...Text.Dialog1, wordWrap: { width: this.size.width } }).setOrigin(0.5).setDepth(100);
    this.setDepth(1010);
    this.setScrollFactor(0); 
    this.add([ this.background, this.text ]);
    this.setPosition(position.x, position.y);
    this.scene.add.existing(this);
  }

  setText(newText: string) {
    this.text.text = newText;
  }

  show() {
    this.setVisible(true);
    this.isActive = true;
  }
  hide() {
    this.setVisible(false);
    this.isActive = false;
  }
}