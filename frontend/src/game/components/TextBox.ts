import { Scene } from 'phaser';
import { Text } from '@/game/components/Properties';
import { ITextBox } from '../types';
import IGameUI from '../types/GameUI';
import { BaseScene } from '../core/BaseScene';

export default class GameUI implements IGameUI {
  scene: BaseScene;
  playerLabel: TextBox;
  characterLabel: TextBox;
  levelLabel: TextBox;
  healthLabel: TextBox;
  weaponSetLabel: TextBox;
  constructor(scene: BaseScene) {
    this.scene = scene;
    this.playerLabel = new TextBox(scene, { x: 200, y: 50 } as Phaser.Math.Vector2, { x: 10, y: 10 } as Phaser.Math.Vector2);
    this.characterLabel = new TextBox(scene, { x: 300, y : 50 } as Phaser.Math.Vector2, { x: 220, y: 10 } as Phaser.Math.Vector2);
    this.levelLabel = new TextBox(scene, { x: 100, y: 50 } as Phaser.Math.Vector2, { x: 530, y: 10 } as Phaser.Math.Vector2);
    this.healthLabel = new TextBox(scene, { x: 100, y: 50 } as Phaser.Math.Vector2, { x: 530, y: 10 } as Phaser.Math.Vector2);
    this.weaponSetLabel = new TextBox(scene, { x: 100, y: 50 } as Phaser.Math.Vector2, { x: 530, y: 10 } as Phaser.Math.Vector2);

    this.scene.gameCameras.main.ignore(this.playerLabel);
    this.scene.gameCameras.main.ignore(this.characterLabel);
    this.scene.gameCameras.main.ignore(this.levelLabel);
    this.scene.gameCameras.main.ignore(this.healthLabel);
    this.scene.gameCameras.main.ignore(this.weaponSetLabel);
  }
}

export class TextBox extends Phaser.GameObjects.Container implements ITextBox {
  size: Phaser.Math.Vector2;
  background: Phaser.GameObjects.Graphics;
  text: Phaser.GameObjects.Text;

  constructor(scene: Scene, size: Phaser.Math.Vector2, position: Phaser.Math.Vector2) {
    super(scene, position.x, position.y);
    this.scene = scene;
    this.size = size;
    this.background = new Phaser.GameObjects.Graphics(this.scene);
    this.background.fillStyle(0x000000, 0.8);
    this.background.lineStyle(2, 0xffff00, 1);
    this.background.fillRoundedRect(0, 0, this.size.x, this.size.y);

    this.text = new Phaser.GameObjects.Text(this.scene, this.size.x * 0.5, this.size.y * 0.5, '', { ...Text.Dialog1 }).setOrigin(0.5).setDepth(100);
    this.setDepth(1010);
    this.setScrollFactor(0); 
    this.add([ this.background, this.text ]);
    this.setPosition(position.x, position.y);
    this.scene.add.existing(this);
  }

  setText(newText: string): void {
    this.text.text = newText;
  }

  show(): void {
    this.setVisible(true);
  }
  hide(): void {
    this.setVisible(false);
  }
}