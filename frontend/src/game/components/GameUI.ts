import { Text } from '@/game/components/Properties';
import { AttackMode, ICharacter, ICollectable, ITextBox, IWeapon } from '../types';
import { IGameUI, GameUIPlaceholders, IGameUIHandlers, ICooldownBar, ITimeCounter }from '../types/GameUI';
import { BaseScene } from '../core/BaseScene';
import { EventManager } from '../core/EventBus';
import { GameEvents } from '../types';

export class TextBox extends Phaser.GameObjects.Container implements ITextBox {
  override scene: BaseScene;
  size: Phaser.Math.Vector2;
  background: Phaser.GameObjects.Graphics;
  text: Phaser.GameObjects.Text;
  placeholder: string;

  constructor(scene: BaseScene, size: Phaser.Math.Vector2, position: Phaser.Math.Vector2, placeholder: string) {
    super(scene, position.x, position.y);
    this.size = size;
    this.placeholder = placeholder;

    this.background = scene.add.graphics();
    this.background.fillStyle(0x000000, 0.8);
    this.background.lineStyle(2, 0xffff00, 1);
    this.background.fillRoundedRect(0, 0, this.size.x, this.size.y);

    this.text = scene.add.text(0, 0, '', { ...Text.Dialog1, fixedWidth: this.size.x, align: 'center' });
    this.text.setDepth(100);

    this.text.setOrigin(0.5, 0.5);
    this.text.setPosition(this.size.x / 2, this.size.y / 2);

    this.add([ this.background, this.text ]);
    scene.add.existing(this);
    scene.gameCameras.main.ignore(this);
  }

  setText(newText: string): void {

    try {
      this.text.setText(this.placeholder + newText);
    } catch (error) {
      console.warn('Erro ao definir texto:', error);
    }
  }

  show(): void {
    if (this.scene && this.scene.sys.isActive()) {
      this.setVisible(true);
    }
  }

  hide(): void {
    if (this.scene && this.scene.sys.isActive()) {
      this.setVisible(false);
    }
  }

  override destroy(): void {
    this.text.destroy();
    if (this.background) {
      this.background.destroy();
    }
    super.destroy();
  }
}

export class CooldownBar extends Phaser.GameObjects.Container implements ICooldownBar {
  override scene: BaseScene
  fill: Phaser.GameObjects.Graphics;
  width: number;
  height: number;
  private currentTween?: Phaser.Tweens.Tween;

  constructor(scene: BaseScene, x: number, y: number, width: number, height: number) {
    super(scene, x, y);
    this.width = width;
    this.height = height;
    this.fill = scene.add.graphics();
    this.fill.fillStyle(0xffffff, 1);
    this.fill.fillRoundedRect(0, 0, 0, height, 4);

    this.add([ this.fill ]);
    scene.add.existing(this);
    scene.gameCameras.main.ignore(this);
  }

  public startCooldown(duration: number) {
    if (!this.scene || !this.scene.sys.isActive()) {
      return;
    }

    if (this.currentTween) {
      this.currentTween.destroy();
    }

    const animationObject = { progress: 1 };
    this.updateFillBar(1);

    if (this.scene.sys.isActive() && this.scene.sys.isVisible()) {
      this.createTween(animationObject, duration);
    } else {
      this.scene.sys.events.once('ready', () => {
        if (this.scene && this.scene.sys.isActive()) {
          this.createTween(animationObject, duration);
        }
      });
    }
  }

  private createTween(animationObject: { progress: number }, duration: number): void {
    if (!this.scene || !this.scene.tweens || !this.scene.sys.isActive()) {
      return;
    }

    this.currentTween = this.scene.tweens.add({
      targets: animationObject,
      progress: 0,
      ease: 'Linear',
      duration: duration,
      onUpdate: () => {
        if (this.scene && this.scene.sys.isActive()) {
          this.updateFillBar(animationObject.progress);
        }
      },
      onComplete: () => {
        if (this.scene && this.scene.sys.isActive()) {
          this.updateFillBar(0);
        }
        this.currentTween = undefined;
      }
    });
  }

  private updateFillBar(progress: number) {
    if (!this.fill || !this.scene || !this.scene.sys.isActive()) {
      return;
    }

    try {
      this.fill.clear();
      if (progress > 0) {
        this.fill.fillStyle(0xffffff, 1);
        this.fill.fillRoundedRect(0, 0, this.width * progress, this.height, 4);
      }
    } catch (error) {
      console.warn('Erro ao atualizar barra de cooldown:', error);
    }
  }

  public destroy(): void {
    if (this.currentTween) {
      this.currentTween.destroy();
      this.currentTween = undefined;
    }

    if (this.fill) {
      this.fill.clear();
      this.fill.destroy();
    }
    super.destroy();
  }
}

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
  notificationsLabel: NotificationPopUp;
  timeLabel: TimeCounter;
  handlers: IGameUIHandlers;
  private isDestroyed: boolean = false;

  constructor(scene: BaseScene) {
    this.scene = scene;

    this.characterLabel = new TextBox(scene, { x: 220, y : 50 } as Phaser.Math.Vector2, { x: 10, y: 10 } as Phaser.Math.Vector2, GameUIPlaceholders.CHARACTER);
    this.levelLabel = new TextBox(scene, { x: 80, y: 50 } as Phaser.Math.Vector2, { x: 240, y: 10 } as Phaser.Math.Vector2, GameUIPlaceholders.LEVEL);
    this.healthLabel = new TextBox(scene, { x: 100, y: 50 } as Phaser.Math.Vector2, { x: 330, y: 10 } as Phaser.Math.Vector2, GameUIPlaceholders.HEALTH);
    this.weaponSetLabel = new TextBox(scene, { x: 180, y: 50 } as Phaser.Math.Vector2, { x: 440, y: 10 } as Phaser.Math.Vector2, GameUIPlaceholders.WEAPONSET);
    this.pointsLabel = new TextBox(scene, { x: 170, y: 50 } as Phaser.Math.Vector2, { x: 630, y: 10 } as Phaser.Math.Vector2, GameUIPlaceholders.POINTS);

    this.playerLabel = new TextBox(scene, { x: 300, y: 50 } as Phaser.Math.Vector2, { x: 10, y: 140 } as Phaser.Math.Vector2, GameUIPlaceholders.PLAYER);
    this.attackModeLabel = new TextBox(scene, { x: 200, y: 50 } as Phaser.Math.Vector2, { x: 10, y: 70 } as Phaser.Math.Vector2, GameUIPlaceholders.ATTACK_MODE);
    this.killsLabel = new TextBox(scene, { x: 200, y: 50 } as Phaser.Math.Vector2, { x: 220, y: 70 } as Phaser.Math.Vector2, GameUIPlaceholders.KILLS);
    this.notificationsLabel = new NotificationPopUp(scene, { x: 200, y: 50 } as Phaser.Math.Vector2, { x: 640, y: 70 } as Phaser.Math.Vector2);

    this.weaponCooldownBar = new CooldownBar(this.scene, 460, 45, 140, 5);
    this.scene.gameCameras.main.ignore([ this.killsLabel, this.attackModeLabel, this.weaponCooldownBar, this.weaponSetLabel, this.healthLabel, this.levelLabel, this.playerLabel, this.characterLabel ]);

    this.timeLabel = new TimeCounter(scene, { x: 200, y: 50 } as Phaser.Math.Vector2, { x: 430, y: 70 } as Phaser.Math.Vector2);

    this.handlers = {
        onHealthChange: (health: number) => {
          if (!this.isDestroyed) this.healthLabel.setText(health.toString());
        },
        onWeaponChange: (weapon: IWeapon) => {
          if (!this.isDestroyed) this.weaponSetLabel.setText(weapon.name);
        },
        onEnemyDied: (info: { points: number, kills: number }) => {
          if (!this.isDestroyed) {
            this.pointsLabel.setText(info.points.toString());
            this.killsLabel.setText(info.kills.toString());
          }
        },
        onLevelUp: (level: number) => {
          if (!this.isDestroyed) this.levelLabel.setText(level.toString());
        },
        onAttackModeChange: (mode: AttackMode) => {
          if (!this.isDestroyed) this.attackModeLabel.setText(mode === AttackMode.AUTO ? "Auto" : "Manual");
        },
        onWeaponCooldown: (cooldown: number) => {
          if (!this.isDestroyed && this.weaponCooldownBar) this.weaponCooldownBar.startCooldown(cooldown);
        },
        onCharacterChange: (character: ICharacter) => {
          if (!this.isDestroyed) this.characterLabel.setText(character.name);
        }
    };

    const eventManager = EventManager.Instance;
    eventManager.on(GameEvents.HEALTH_CHANGE, this.handlers.onHealthChange, this);
    eventManager.on(GameEvents.TOGGLE_WEAPON_SUCCESS, this.handlers.onWeaponChange, this);
    eventManager.on(GameEvents.ENEMY_DIED, this.handlers.onEnemyDied, this);
    eventManager.on(GameEvents.LEVEL_UP, this.handlers.onLevelUp, this);
    eventManager.on(GameEvents.WEAPON_COOLDOWN, this.handlers.onWeaponCooldown, this);
    eventManager.on(GameEvents.TOGGLE_ATTACK_MODE_SUCCESS, this.handlers.onAttackModeChange, this);
    eventManager.on(GameEvents.TOGGLE_CHARACTER_SUCCESS, this.handlers.onCharacterChange, this);
  }

  populateInitialValues(): void {
      this.playerLabel.setText(this.scene.player.name);
      this.characterLabel.setText(this.scene.player.character.name);
      this.levelLabel.setText(this.scene.player.level.level.toString());
      this.healthLabel.setText(this.scene.player.character.health.toString());
      this.weaponSetLabel.setText(this.scene.attackManager.weapon.name);
      this.pointsLabel.setText("0");
      this.killsLabel.setText("0");
      this.attackModeLabel.setText("Auto");
      this.timeLabel.setText("0");
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    const eventManager = EventManager.Instance;
    eventManager.off(GameEvents.HEALTH_CHANGE, this.handlers.onHealthChange, this);
    eventManager.off(GameEvents.TOGGLE_WEAPON_SUCCESS, this.handlers.onWeaponChange, this);
    eventManager.off(GameEvents.ENEMY_DIED, this.handlers.onEnemyDied, this);
    eventManager.off(GameEvents.LEVEL_UP, this.handlers.onLevelUp, this);
    eventManager.off(GameEvents.WEAPON_COOLDOWN, this.handlers.onWeaponCooldown, this);
    eventManager.off(GameEvents.TOGGLE_ATTACK_MODE_SUCCESS, this.handlers.onAttackModeChange, this);
    eventManager.off(GameEvents.TOGGLE_CHARACTER_SUCCESS, this.handlers.onCharacterChange, this);

    [
      this.playerLabel,
      this.characterLabel,
      this.levelLabel,
      this.healthLabel,
      this.weaponSetLabel,
      this.weaponCooldownBar,
      this.pointsLabel,
      this.killsLabel,
      this.attackModeLabel,
      this.timeLabel,
      this.notificationsLabel
    ].forEach(component => {
      if (component && typeof component.destroy === 'function') {
        try {
          component.destroy();
        } catch (error) {
          console.warn('Erro ao destruir componente:', error);
        }
      }
    });
  }
}

export class TimeCounter extends TextBox implements ITimeCounter {
  private internalCounter: Phaser.Time.TimerEvent;
  private timeElapsed: number = 0;

  constructor(scene: BaseScene, size: Phaser.Math.Vector2, position: Phaser.Math.Vector2) {
    super(scene, size, position, GameUIPlaceholders.TIME);
    this.setText(this.formatTime(0));
    this.internalCounter = scene.time.addEvent(
      {
        delay: 1000,
        callbackScope: this,
        callback: () => {
          this.timeElapsed += 1000;
          this.setText(this.formatTime(this.timeElapsed))
        },
        loop: true
      }
    );
  }

  get time(): number {
    return this.timeElapsed;
  }

  private formatTime(time: number): string {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    if (minutes === 0) return `${seconds}s`;
    else return `${minutes}m: ${seconds < 10 ? '0' : ''}${seconds}s`;
  }

  override destroy(): void {
    this.internalCounter.remove(false);
    super.destroy();
  }
}

export class NotificationPopUp extends TextBox {
  private onSpawnedHandler: (payload: ICollectable) => void;
  private onCollectedHandler: (payload: ICollectable) => void;
  private showTween?: Phaser.Tweens.Tween;
  private hideTween?: Phaser.Tweens.Tween;
  private padding = 10;

  constructor(scene: BaseScene, size: Phaser.Math.Vector2, position: Phaser.Math.Vector2) {
    super(scene, size, position, '');
    super.setAlpha(0);
    super.hide();

    const display = (msg: string) => {
      this.setText(msg);
      this.resizeBackground();
      this.showWithFade();
    };

    this.onSpawnedHandler = (payload) => {
      display(`Um(a) ${payload.name} foi dropado(a).`);
    };
    this.onCollectedHandler = (payload) => {
      display(`Um(a) ${payload.name} foi coletado(a).`);
    };

    EventManager.Instance.on(GameEvents.COLLECTABLE_SPAWNED, this.onSpawnedHandler, this);
    EventManager.Instance.on(GameEvents.COLLECTABLE_COLLECTED, this.onCollectedHandler, this);
  }

  private resizeBackground() {
    const maxWidth = 300;
    const textWidth = Math.min(this.text.width, maxWidth);
    const textHeight = this.text.height;

    this.text.setOrigin(0);
    this.background.clear();
    this.background.fillStyle(0x000000, 0.8);
    this.background.lineStyle(2, 0xffff00, 1);
    this.background.fillRoundedRect(0, 0, textWidth + this.padding * 2, textHeight + this.padding * 2);
    this.text.setPosition(this.padding, this.padding);
    this.text.setWordWrapWidth(textWidth);
  }

  private showWithFade() {
    this.hideTween?.stop();
    this.showTween?.stop();

    this.show();
    this.showTween = this.scene.tweens.add({
      targets: this,
      alpha: 1,
      ease: 'Linear',
      duration: 300,
      onComplete: () => {
        this.scene.time.delayedCall(1000, () => this.hideWithFade());
      }
    });
  }

  private hideWithFade() {
    this.showTween?.stop();
    this.hideTween?.stop();

    this.hideTween = this.scene.tweens.add({
      targets: this,
      alpha: 0,
      ease: 'Linear',
      duration: 300,
      onComplete: () => {
        super.hide();
      }
    });
  }

  override destroy(): void {
    this.showTween?.stop();
    this.hideTween?.stop();
    EventManager.Instance.off(GameEvents.COLLECTABLE_SPAWNED, this.onSpawnedHandler, this);
    EventManager.Instance.off(GameEvents.COLLECTABLE_COLLECTED, this.onCollectedHandler, this);
    super.destroy();
  }
}
