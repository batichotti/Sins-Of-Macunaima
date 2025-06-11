import { BaseScene } from "../core/BaseScene";
import { EventManager } from "../core/EventBus";
import { ICollectableManager, CollectablePoints, GameEvents, ICollectable, RegularCollectableEnum, EspecialCollectableEnum, CollectableTypes } from "../types";
import { Player } from "./Player";

export default class CollectableManager implements ICollectableManager {
  points: CollectablePoints[] = [];
  player: Player;
  children: Phaser.GameObjects.Group;
  maxAliveCollectables: number = 10;
  canSpawn: boolean = true;
  minDistance: number = 20;
  maxDistance: number = 500;
  scene: BaseScene;
  lastPlayerPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  constructor(scene: BaseScene) {
    this.scene = scene;
    this.player = scene.player;
    this.lastPlayerPos = scene.player.character.body?.position ?? new Phaser.Math.Vector2();
    this.children = scene.add.group({
      classType: Collectable,
      maxSize: this.maxAliveCollectables,
      runChildUpdate: true,
      createCallback: (child: Phaser.GameObjects.GameObject) => {
        const collectable = child as Collectable;
        collectable.setActive(false).setVisible(false).setSize(8, 8).setOffset(0);
      }
    });
    this.setupCollectablePoints();

    EventManager.Instance.on(GameEvents.BOSS_DEFEATED, this.spawnEspecialCollectable, this);
  }

  private chooseSpawn(): CollectablePoints | null {
      if (this.points.length === 0) return null;

      const playerPos = this.player.character.body?.position;
      if (playerPos) {
        this.lastPlayerPos.copy(playerPos);
      }

      const validPoints = this.points.filter(spawnPoint => {
          const distance = Phaser.Math.Distance.Between(
              this.lastPlayerPos.x,
              this.lastPlayerPos.y,
              spawnPoint.position.x,
              spawnPoint.position.y
          );
          return distance > this.minDistance && distance < this.maxDistance;
      });

      if (validPoints.length === 0) return null;

      return validPoints.reduce((nearest, current) => {
          const nearestDist = Phaser.Math.Distance.Between(
              this.lastPlayerPos.x, this.lastPlayerPos.y,
              nearest.position.x, nearest.position.y
          );
          const currentDist = Phaser.Math.Distance.Between(
              this.lastPlayerPos.x, this.lastPlayerPos.y,
              current.position.x, current.position.y
          );
          return currentDist < nearestDist ? current : nearest;
      });
  }

  private spawnEspecialCollectable() {
    if (!this.canSpawn) return;

    const spawnPoint = this.chooseSpawn();
    if (!spawnPoint) return;

    const validTypes = Object.values(CollectableTypes).filter(type =>
      Object.values(EspecialCollectableEnum).includes(type.typee as EspecialCollectableEnum)
    );

    if (validTypes.length === 0) return;

    const collectableType = Phaser.Utils.Array.GetRandom(validTypes);
    this.spawnCollectable(spawnPoint, collectableType);
  }

  private spawnCollectable(spawnPoint: CollectablePoints, config: ICollectable) {
    const existingCollectable = this.children.getChildren().find(child => {
      const collectable = child as Collectable;
      return collectable.active &&
             Math.abs(collectable.x - spawnPoint.position.x) < 5 &&
             Math.abs(collectable.y - spawnPoint.position.y) < 5;
    });

    if (existingCollectable) return;

    const collectable = this.children.get(spawnPoint.position.x, spawnPoint.position.y, config.spriteKey) as Collectable;
    if (collectable) {
      collectable.changeConfig(config);
      collectable.setActive(true).setVisible(true);
      this.scene.gameCameras.ui.ignore(collectable);
      EventManager.Instance.emit(GameEvents.COLLECTABLE_SPAWNED, collectable);
    }
  }

  private setupCollectablePoints() {
    const layer = this.scene.map.getObjectLayer('collectablePoints');
    if (layer) {
        layer.objects.forEach((obj) => {
            if (obj.x !== undefined && obj.y !== undefined && obj.width !== undefined && obj.height !== undefined) {
                this.points.push({
                    name: obj.name || 'unnamed',
                    position: new Phaser.Math.Vector2(
                        obj.x + obj.width / 2,
                        obj.y - obj.height / 2
                    )
                });
            }
        });
    }
  }

  destroy() {
    EventManager.Instance.off(GameEvents.BOSS_DEFEATED, this.spawnEspecialCollectable, this);
    this.children.destroy();
  }
}

export class Collectable extends Phaser.Physics.Arcade.Sprite implements ICollectable {
  override scene: BaseScene;
  name: string;
  spriteKey: string;
  typee: RegularCollectableEnum | EspecialCollectableEnum;

  constructor(scene: BaseScene, x: number, y: number, config: ICollectable) {
    super(scene, x, y, config.spriteKey);
    this.name = config.name;
    this.spriteKey = config.spriteKey;
    this.typee = config.typee;
    this.setScale(2);
    this.setDepth(100);
    scene.gameCameras.ui.ignore(this);
    scene.physics.add.existing(this);
    scene.physics.add.overlap(this, scene.player.character, this.collect);
  }

  private collect = () => {
    if (!this.active) return;

    const collectableData: ICollectable = {
      name: this.name,
      spriteKey: this.spriteKey,
      typee: this.typee
    };

    EventManager.Instance.emit(GameEvents.COLLECTABLE_COLLECTED, collectableData);
    this.playCollectEffect();
  }

  private playCollectEffect() {
    this.setActive(false).setVisible(false);

    const effect = this.scene.add.circle(this.x, this.y, 10, 0xFFFF00, 0.8);
    this.scene.gameCameras.ui.ignore(effect);
    this.scene.tweens.add({
      targets: effect,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.scene.collectableManager.children.killAndHide(this);
        effect.destroy();
      }
    });
  }

  changeConfig(config: ICollectable) {
    this.spriteKey = config.spriteKey;
    this.name = config.name;
    this.typee = config.typee;
    this.setTexture(config.spriteKey);
  }
}
