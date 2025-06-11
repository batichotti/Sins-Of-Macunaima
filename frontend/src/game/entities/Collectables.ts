import { BaseScene } from "../core/BaseScene";
import { EventManager } from "../core/EventBus";
import { ICollectableManager, CollectablePoints, GameEvents, ICollectable } from "../types";

export default class CollectableManager implements ICollectableManager {
  points: CollectablePoints[] = [];
  children: Phaser.GameObjects.Group;
  maxAliveCollectables: number = 20;
  minDistance: number = 20;
  maxDistance: number = 500;
  scene: BaseScene;
  lastPlayerPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  constructor(scene: BaseScene) {
    this.scene = scene;
    this.maxAliveCollectables = 10;
    this.children = scene.add.group();
    this.setupCollectablePoints();
    EventManager.Instance.on(GameEvents.BOSS_DEFEATED, this.spawnCollectable, this);
  }

  private chooseSpawn(): CollectablePoints | null {
      if (this.points.length === 0) return null;

      const playerPos = this.scene.player.character.body?.position;

      if (playerPos) {
          this.lastPlayerPos.copy(playerPos);
      }

      let nearest = Number.MAX_VALUE;
      let nearestPos: CollectablePoints | null = null;

      for (const spawnPoint of this.points) {
          const distance = Phaser.Math.Distance.Between(
              this.lastPlayerPos.x,
              this.lastPlayerPos.y,
              spawnPoint.position.x,
              spawnPoint.position.y
          );

          if (distance > this.minDistance && distance < nearest) {
              nearest = distance;
              nearestPos = spawnPoint;
          }
      }

      return nearestPos && nearest < this.maxDistance ? nearestPos : null;
  }

  private spawnCollectable = () => {

  }

  private setupCollectablePoints() {
    const layer = this.scene.map.getObjectLayer('point');
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
    EventManager.Instance.off(GameEvents.BOSS_DEFEATED, this.spawnCollectable, this);
    this.children.destroy();
  }
}

export class Collectable extends Phaser.GameObjects.Sprite implements ICollectable {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
      super(scene, x, y, texture, frame);
      scene.add.existing(this);
  }
}
