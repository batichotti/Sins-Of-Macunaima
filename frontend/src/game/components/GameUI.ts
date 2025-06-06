import { Scene } from 'phaser';
import { Text } from '@/game/components/Properties';
import { AttackMode, ITextBox } from '../types';
import { IGameUI, GameUIPlaceholders }from '../types/GameUI';
import { BaseScene } from '../core/BaseScene';
import { EventManager, GameEvents } from '../core/EventBus';

export default class GameUI implements IGameUI {
  scene: BaseScene;
  playerLabel: TextBox;
  characterLabel: TextBox;
  levelLabel: TextBox;
  healthLabel: TextBox;
  weaponSetLabel: TextBox;
  weaponCooldownBar: CooldownBar;
  pointsLabel: TextBox;
  killsLabel: TextBox;
  attackModeLabel: TextBox;
  bossInfoLabel: TextBox;


  constructor(scene: BaseScene) {
    this.scene = scene;

    this.characterLabel = new TextBox(scene, { x: 220, y : 50 } as Phaser.Math.Vector2, { x: 10, y: 10 } as Phaser.Math.Vector2, GameUIPlaceholders.CHARACTER);
    this.levelLabel = new TextBox(scene, { x: 80, y: 50 } as Phaser.Math.Vector2, { x: 240, y: 10 } as Phaser.Math.Vector2, GameUIPlaceholders.LEVEL);
    this.healthLabel = new TextBox(scene, { x: 100, y: 50 } as Phaser.Math.Vector2, { x: 330, y: 10 } as Phaser.Math.Vector2, GameUIPlaceholders.HEALTH);
    this.weaponSetLabel = new TextBox(scene, { x: 180, y: 50 } as Phaser.Math.Vector2, { x: 440, y: 10 } as Phaser.Math.Vector2, GameUIPlaceholders.WEAPONSET);
    this.pointsLabel = new TextBox(scene, { x: 160, y: 50 } as Phaser.Math.Vector2, { x: 630, y: 10 } as Phaser.Math.Vector2, GameUIPlaceholders.POINTS);

    this.playerLabel = new TextBox(scene, { x: 160, y: 50 } as Phaser.Math.Vector2, { x: 10, y: 70 } as Phaser.Math.Vector2, GameUIPlaceholders.PLAYER);
    this.attackModeLabel = new TextBox(scene, { x: 200, y: 50 } as Phaser.Math.Vector2, { x: 180, y: 70 } as Phaser.Math.Vector2, GameUIPlaceholders.ATTACK_MODE);
    this.killsLabel = new TextBox(scene, { x: 200, y: 50 } as Phaser.Math.Vector2, { x: 390, y: 70 } as Phaser.Math.Vector2, GameUIPlaceholders.KILLS);

    this.weaponCooldownBar = new CooldownBar(this.scene, 460, 45, 140, 5);
    this.scene.gameCameras.main.ignore([ this.killsLabel, this.attackModeLabel, this.weaponCooldownBar, this.weaponSetLabel, this.healthLabel, this.levelLabel, this.playerLabel, this.characterLabel ]);


    this.playerLabel.setText(this.scene.player.name);
    this.characterLabel.setText(this.scene.player.character.name);
    this.levelLabel.setText(this.scene.player.level.level.toString());
    this.healthLabel.setText(this.scene.player.character.health.toString());
    this.weaponSetLabel.setText(this.scene.attackManager.weapon.name);
    this.pointsLabel.setText("0");
    this.attackModeLabel.setText("");
    this.killsLabel.setText("0");
    this.attackModeLabel.setText("Auto");

    const eventManager = EventManager.getInstance();
    eventManager.on(GameEvents.HEALTH_CHANGE, (health: { health: number }) => { this.healthLabel.setText(health.health.toString()) });
    eventManager.on(GameEvents.TOGGLE_WEAPON, () => { this.weaponSetLabel.setText( this.scene.attackManager.weapon.name ) });
    eventManager.on(GameEvents.ENEMY_DIED, (info: { points: number, kills: number }) => { this.pointsLabel.setText(info.points.toString()); this.killsLabel.setText(info.kills.toString()) });
    eventManager.on(GameEvents.LEVEL_UP, (level: { level: number }) => { this.levelLabel.setText(level.level.toString()) });
    eventManager.on(GameEvents.WEAPON_COOLDOWN, (cooldown: number) => { this.weaponCooldownBar.startCooldown(cooldown) });
    eventManager.on(GameEvents.TOGGLE_ATTACK_MODE_SUCCEDED, (obj: AttackMode) => { this.attackModeLabel.setText(obj === AttackMode.AUTO ? "Auto" : "Manual") });
  }
}

export class TextBox extends Phaser.GameObjects.Container implements ITextBox {
  size: Phaser.Math.Vector2;
  background: Phaser.GameObjects.Graphics;
  text: Phaser.GameObjects.Text;
  placeholder: string;

  constructor(scene: Scene, size: Phaser.Math.Vector2, position: Phaser.Math.Vector2, placeholder: string) {
    super(scene, position.x, position.y);
    this.scene = scene;
    this.size = size;
    this.placeholder = placeholder;
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
    this.text.text = this.placeholder + newText;
  }

  show(): void {
    this.setVisible(true);
  }
  hide(): void {
    this.setVisible(false);
  }
}

export class BossInformation extends Phaser.GameObjects.Container {
  fill: Phaser.GameObjects.Graphics;
  width: number;
  height: number;
  private currentTween: Phaser.Tweens.Tween;
}

export class CooldownBar extends Phaser.GameObjects.Container {
  fill: Phaser.GameObjects.Graphics;
  width: number;
  height: number;
  private currentTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y);
    this.width = width;
    this.height = height;
    this.fill = scene.add.graphics();
    this.fill.fillStyle(0xffffff, 1);
    this.fill.fillRoundedRect(0, 0, 0, height, 4);

    this.add([ this.fill ]);
    scene.add.existing(this);
  }

  startCooldown(duration: number) {
    if (this.currentTween) {
      this.currentTween.destroy();
    }

    const animationObject = { progress: 1 };

    this.updateFillBar(1);

    this.currentTween = this.scene.tweens.add({
      targets: animationObject,
      progress: 0,
      ease: 'Linear',
      duration: duration,
      onUpdate: () => {
        this.updateFillBar(animationObject.progress);
      },
      onComplete: () => {
        this.updateFillBar(0);
        this.currentTween = undefined;
      }
    });
  }

  private updateFillBar(progress: number) {
    this.fill.clear();
    if (progress > 0) {
      this.fill.fillStyle(0xffffff, 1);
      this.fill.fillRoundedRect(0, 0, this.width * progress, this.height, 4);
    }
  }

  destroy() {
    if (this.currentTween) {
      this.currentTween.destroy();
      this.currentTween = undefined;
    }
    super.destroy();
  }
}
