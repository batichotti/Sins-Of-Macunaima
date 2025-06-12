import { BaseScene } from "../core/BaseScene";
import { EventManager } from "../core/EventBus";
import { ICollectableManager, CollectablePoints, GameEvents, ICollectable, RegularCollectableEnum, SpecialCollectableEnum, EspecialCollectableTypes, MeleeEnum, ProjectileEnum, IWeapon, MeleeTypes } from "../types";
import { Player } from "./Player";

export default class CollectableManager implements ICollectableManager {
  points: CollectablePoints[] = [];
  player: Player;
  children: Collectable[] = [];
  maxAliveCollectables: number = 10;
  canSpawn: boolean = true;
  minDistance: number = 20;
  maxDistance: number = 500;
  meleeCollectables: Map<MeleeEnum, number> = new Map();
  projectileCollectables: Map<ProjectileEnum, number> = new Map();
  specialCollectables: Map<SpecialCollectableEnum, number> = new Map();
  regularCollectables: Map<RegularCollectableEnum, number> = new Map();
  scene: BaseScene;
  lastPlayerPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  constructor(scene: BaseScene) {
    this.scene = scene;
    this.player = scene.player;
    this.lastPlayerPos = scene.player.character.body?.position ?? new Phaser.Math.Vector2();
    this.setupCollectablePoints();
    this.scene.time.addEvent({ delay: 2500, callback: this.cleanup, callbackScope: this, loop: true });

    EventManager.Instance.on(GameEvents.BOSS_DEFEATED, this.spawnEspecialCollectable, this);
    EventManager.Instance.on(GameEvents.WEAPON_DROPPED, (payload: { weapon: { asIWeapon: IWeapon, asICollectable: ICollectable }, position: Phaser.Math.Vector2 | { x: number, y: number } }) => this.spawnWeaponCollectable(payload), this);
  }

  private cleanup: () => void = () => {
    this.children.forEach(child => {
      if(!child.isAlive) child.destroy();
    });
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
    if (this.children.length >= this.maxAliveCollectables) return;

    const spawnPoint = this.chooseSpawn();
    if (!spawnPoint) return;

    const validTypes = Object.values(EspecialCollectableTypes);
    if (validTypes.length === 0) return;

    const collectableType = Phaser.Utils.Array.GetRandom(validTypes);
    this.spawnCollectable(spawnPoint, collectableType);
  }

  private spawnCollectable(spawnPoint: CollectablePoints, config: ICollectable) {
    const existingCollectable = this.children.find(collectable => {
      return collectable.active &&
        Math.abs(collectable.x - spawnPoint.position.x) < 5 &&
        Math.abs(collectable.y - spawnPoint.position.y) < 5;
    });

    if (existingCollectable) return;

    let collectable: Collectable;

    if (Object.values(RegularCollectableEnum).includes(config.typee as RegularCollectableEnum)) {
      collectable = new RegularCollectable(this.scene, spawnPoint.position.x, spawnPoint.position.y, config);
    } else if (Object.values(SpecialCollectableEnum).includes(config.typee as SpecialCollectableEnum)) {
      collectable = new SpecialCollectable(this.scene, spawnPoint.position.x, spawnPoint.position.y, config);
    } else if (Object.values(MeleeEnum).includes(config.typee as MeleeEnum)) {
      collectable = new MeleeCollectable(this.scene, spawnPoint.position.x, spawnPoint.position.y, config);
    } else if (Object.values(ProjectileEnum).includes(config.typee as ProjectileEnum)) {
      collectable = new ProjectileCollectable(this.scene, spawnPoint.position.x, spawnPoint.position.y, config);
    } else {
      collectable = new RegularCollectable(this.scene, spawnPoint.position.x, spawnPoint.position.y, config);
    }

    this.scene.add.existing(collectable);
    this.children.push(collectable);
    this.scene.gameCameras.ui.ignore(collectable);

    EventManager.Instance.emit(GameEvents.COLLECTABLE_SPAWNED, collectable);
  }

  private spawnWeaponCollectable(payload: { weapon: { asIWeapon: IWeapon, asICollectable: ICollectable }, position: Phaser.Math.Vector2 | { x: number, y: number } }): void {
    const existingCollectable = this.children.find(collectable => {
      return collectable.active &&
             Math.abs(collectable.x - payload.position.x) < 5 &&
             Math.abs(collectable.y - payload.position.y) < 5;
    });

    if (existingCollectable) return;

    let collectable: Collectable | null = null;

    const t = payload.weapon.asICollectable.typee as MeleeEnum | ProjectileEnum;
    if (Object.values(MeleeEnum).includes(t as MeleeEnum)) {
      collectable = new MeleeCollectable(this.scene, payload.position.x, payload.position.y, payload.weapon.asICollectable);
    } else if (Object.values(ProjectileEnum).includes(t as ProjectileEnum)) {
      collectable = new ProjectileCollectable(this.scene, payload.position.x, payload.position.y, payload.weapon.asICollectable);
    }

    if(!collectable) return;

    this.scene.add.existing(collectable);
    this.children.push(collectable);
    this.scene.gameCameras.ui.ignore(collectable);

    EventManager.Instance.emit(GameEvents.WEAPON_DROPPED_SUCCESS, payload.weapon.asIWeapon);
  }



  public removeCollectable(collectable: Collectable) {
    const index = this.children.indexOf(collectable);
    if (index > -1) {
      this.children.splice(index, 1);
    }
    collectable.destroy();
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
    EventManager.Instance.off(GameEvents.WEAPON_DROPPED, this.spawnWeaponCollectable ,this);

    this.children.forEach(collectable => {
      collectable.destroy();
    });
    this.children = [];
  }
}

export abstract class Collectable extends Phaser.Physics.Arcade.Sprite implements ICollectable {
  override scene: BaseScene;
  name: string;
  spriteKey: string;
  isAlive: boolean = true;
  typee: RegularCollectableEnum | SpecialCollectableEnum | MeleeEnum | ProjectileEnum;

  constructor(scene: BaseScene, x: number, y: number, config: ICollectable) {
    super(scene, x, y, config.spriteKey);
    this.name = config.name;
    this.spriteKey = config.spriteKey;
    this.typee = config.typee;
    this.setDepth(98);
    scene.gameCameras.ui.ignore(this);
    scene.physics.add.existing(this);
    this.scene.physics.add.overlap(this, this.scene.player.character, () => { this.collect() });
    this.scene.time.delayedCall(5000, () => this.isAlive = false);
  }

  private collect(): void {
    if (!this.active) return;
    this.playCollectEffect();

    this.onCollect();
  }

  protected abstract onCollect(): void;

  protected export(): ICollectable {
    return {
      name: this.name,
      spriteKey: this.spriteKey,
      typee: this.typee,
    };
  }

  protected playCollectEffect() {
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
        this.scene.collectableManager.removeCollectable(this);
        effect.destroy();
      }
    });
  }
}

export class RegularCollectable extends Collectable {
  constructor(scene: BaseScene, x: number, y: number, config: ICollectable) {
    super(scene, x, y, config);
    this.setScale(2);
  }

  protected onCollect(): void {
    EventManager.Instance.emit(GameEvents.COLLECTABLE_COLLECTED, this.export());
  }
}

export class SpecialCollectable extends Collectable {
  constructor(scene: BaseScene, x: number, y: number, config: ICollectable) {
    super(scene, x, y, config);
    this.setScale(2);
  }

  protected onCollect(): void {
    EventManager.Instance.emit(GameEvents.COLLECTABLE_COLLECTED, this.export());
  }
}

export class MeleeCollectable extends Collectable {
  constructor(scene: BaseScene, x: number, y: number, config: ICollectable) {
    super(scene, x, y, config);
  }

  protected onCollect(): void {
    const weapon = Object.values(MeleeTypes).find(it => it.name === this.name);
    EventManager.Instance.emit(GameEvents.WEAPON_EQUIPPED, weapon!);
  }
}

export class ProjectileCollectable extends Collectable {
  constructor(scene: BaseScene, x: number, y: number, config: ICollectable) {
    super(scene, x, y, config);
  }

  protected onCollect(): void {
    EventManager.Instance.emit(GameEvents.COLLECTABLE_COLLECTED, this.export());
  }
}
