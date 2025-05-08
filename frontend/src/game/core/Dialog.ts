import { Scene } from 'phaser';
import { Text } from '@/game/components/configs/Properties';

export default class Dialog {
  private scene!: Scene;
  private resolution!: { width: number, height: number };
  private position!: { x: number, y: number };
  private text!: Phaser.GameObjects.Text;
  private box!: Phaser.GameObjects.Container;
  private isActive = false;

  constructor(scene: Scene, resolution: { width: number, height: number }, position: { x: number, y: number }) {
    this.scene = scene;
    this.resolution = resolution;
    this.position = position;
    this.text = this.scene.add.text(
      this.position.x,
      this.position.y,
      '',
      Text.Dialog1
    );

    this.box = this.scene.add.container(
      this.position.x,
      this.position.y,
      this.text
    ).setSize(this.resolution.width, this.resolution.height).setActive(false);
  }
}