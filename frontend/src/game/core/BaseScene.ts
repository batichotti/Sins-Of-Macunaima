import { EventBus, EventManager } from '@/game/core/EventBus';
import { Scene } from 'phaser';
import { WindowResolution } from '@/game/components/Properties';
import { Player, Character } from '@/game/entities/Player';
import { AnimatedTileData } from '../types/Tiles';
import { AttackMode, CharacterTypes, EnemyTypes, MatchData, SceneData } from '../types';
import GameCameras from '../components/GameCameras';
import IBaseScene from '../types/BaseScene';
import AttackManager from '../entities/Attack';
import InputManager from '../components/Input';
import EnemyManager from '../entities/EnemyManager';
import GameUI from '../components/GameUI';
import PlayerProgressionSystem from '../entities/PlayerProgressionSystem';
import AnimationManager from '../entities/AnimationManager';
import { GameEvents } from '../types';
import CollectableManager from '../entities/Collectables';

/**
 * Cena básica de jogo.
 */
export class BaseScene extends Scene implements IBaseScene {
    gameCameras: GameCameras;
    collectableManager: CollectableManager;
    player: Player;
    tilesets: Phaser.Tilemaps.Tileset[];
    layers: Phaser.Tilemaps.TilemapLayer[];
    animatedTiles: AnimatedTileData[];
    inputManager: InputManager;
    enemyManager: EnemyManager;
    animationManager: AnimationManager;
    gameUI: GameUI;
    map: Phaser.Tilemaps.Tilemap;
    sceneData: SceneData;
    transitionPoints: Phaser.Types.Tilemaps.TiledObject[];
    transitionRects: Phaser.Geom.Rectangle[];
    attackManager: AttackManager;
    playerProgressionSystem: PlayerProgressionSystem;
    playerStartingPosition: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
      super(config);
    }

    protected preload(){
      if(!this.textures.exists('bullet')) {
        this.textures.generate('bullet', {
            data: ['1'],
            pixelWidth: 1,
            pixelHeight: 1
        });
      }
    }

    protected init(data: SceneData): void {
        this.tilesets = [];
        this.layers = [];
        this.animatedTiles = [];
        this.transitionRects = [];
        this.sceneData = data;
    }

    protected create(): void {
      EventManager.Instance.on(GameEvents.PLAYER_DIED, this.runGameOver, this);
      this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
      this.setupLayers();
      this.setupAnimatedTiles();
      this.setupPlayer();
      this.setupTransitionPoints();
      this.setupCollisions();
      this.setupCameras();
      this.inputManager = new InputManager(this);
      this.enemyManager = new EnemyManager(this);
      this.animationManager = new AnimationManager(this);
      this.setupAnimations();
      this.playerProgressionSystem = new PlayerProgressionSystem(this.player);
      this.collectableManager = new CollectableManager(this);
      this.attackManager = new AttackManager(this, this.playerProgressionSystem, this.player.weaponSet);
      this.gameUI = new GameUI(this);

      EventBus.emit('current-scene-ready', this);
    }

    update(time: number, delta: number): void {
        this.enemyManager.spawnEnemy();

        this.handleInput();
        this.handleAnimatedTiles(delta);
        this.changeScenario();
        this.enemyManager.updatePathing();
        this.enemyManager.updateMovement();
    }

    // Usados em create()
    setupLayers(): void {
        this.map = this.make.tilemap({ key: this.constructor.name });

        this.map.tilesets.forEach((tileset) => {
            const addedTileset = this.map.addTilesetImage(tileset.name, tileset.name, 16, 16, 1, 2);
            if (addedTileset) {
                this.tilesets.push(addedTileset);
            }
        });

        this.map.layers.forEach((layerData, index) => {
            const gameLayer = this.map.createLayer(layerData.name, this.tilesets);
            if (gameLayer) {
                gameLayer.setDepth(index);
                this.layers.push(gameLayer);
            }
        });
    }

    setupPlayer(): void {
        const spawnPoint = this.map.findObject(
            'spawnPoints', // nome da Object Layer
            obj => obj.name === `spawn${this.sceneData.targetScene}`  // name dado ao objeto
        ) as Phaser.Types.Tilemaps.TiledObject;
        const startingPosition = new Phaser.Math.Vector2(
            (spawnPoint?.x ?? WindowResolution.width / 2) + (spawnPoint?.width ?? 0) * 0.5,
            (spawnPoint?.y ?? WindowResolution.height / 2) - (spawnPoint?.height ?? 0) * 0.5
        );
        this.playerStartingPosition = startingPosition;
        const mainCharacter = new Character(this, { x: startingPosition.x, y: startingPosition.y } as Phaser.Math.Vector2, this.sceneData.character);
        this.player = new Player(this.sceneData.player, mainCharacter);

        if (!this.player) {
            throw new Error("Failed to load player.");
        }
    }

    setupTransitionPoints(): void {
        this.transitionPoints = this.map.getObjectLayer('transitionPoints')?.objects ?? [];
        if(this.transitionPoints) {
            this.transitionPoints.forEach((point) => {
                this.transitionRects?.push(new Phaser.Geom.Rectangle(
                    point.x,
                    point.y,
                    point.width ?? 0,
                    point.height ?? 0
                ));
            })
        }
    }

    setupCollisions(): void {
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        const collisionLayer = this.map.getLayer('colisao')?.tilemapLayer;
        if (collisionLayer) {
            collisionLayer.setCollisionByProperty({ collides: true });

            this.physics.add.collider(this.player.character, collisionLayer);
        } else {
            console.error("Camada 'colisao' não encontrada no mapa.");
        }
    }

    setupCameras(): void {
        this.gameCameras = new GameCameras(this);
        this.gameCameras.initCameras(this.map.widthInPixels, this.map.heightInPixels);
        this.gameCameras.ui.ignore(this.layers);
        this.gameCameras.ui.ignore(this.player.character!);
        this.gameCameras.main.startFollow(this.player.character);
    }

    setupAnimatedTiles(): void {
        this.animatedTiles = [];

        this.tilesets.forEach((tileset) => {
          const firstgid = tileset.firstgid;
          const tileData = tileset.tileData as Record<number, { animation?: { tileid: number; duration: number }[] }>;

          this.layers.forEach(layer => {
            layer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
              if (tile.index >= firstgid && tile.index < firstgid + tileset.total) {
                const localId = tile.index - firstgid;
                const data = tileData[localId];
                  if (data?.animation) {
                    this.animatedTiles.push({
                      tile,
                      animationFrames: data.animation,
                      firstgid,
                      elapsedTime: 0
                    });
                  }
              }
            });
        });
      });
    }

    setupAnimations(): void {
        Object.values(CharacterTypes).forEach((it) => this.animationManager.createStandardWalkAnimation(it.spriteKey));
        Object.values(EnemyTypes).forEach((it) => this.animationManager.createStandardWalkAnimation(it.spriteKey));
    }

    // Usados em update()

    handleInput(): void {
        this.inputManager.handleUtilKeys();

        const movementDirection = this.inputManager.getMovementInput();
        const keyboardAim = this.inputManager.getKeyboardAimInput();
        const mouseAim = this.inputManager.getMouseAimInput(this.player.character.x, this.player.character.y);

        let aimDirection;
        if(this.attackManager.attackMode === AttackMode.AUTO) {
            aimDirection = this.enemyManager.findNearestEnemy();
        } else aimDirection = mouseAim || keyboardAim;
        this.player.character.playerMove(movementDirection, aimDirection);

        if (aimDirection) {
            const angle = Phaser.Math.Angle.Between(0, 0, aimDirection.x, aimDirection.y);
            this.attackManager.fire(this.player.character.x, this.player.character.y, angle);
        }
    }

    handleAnimatedTiles(delta: number): void {
        this.animatedTiles.forEach(data => {
            const frames = data.animationFrames;
            const totalDuration = frames.reduce((sum, f) => sum + f.duration, 0);
            data.elapsedTime = (data.elapsedTime + delta) % totalDuration;

            let accumulated = 0;
            for (const frame of frames) {
                accumulated += frame.duration;
                if (data.elapsedTime < accumulated) {
                    data.tile.index = frame.tileid + data.firstgid;
                    break;
                }
            }
        });
    }

    changeScenario(): void {
        if(this.transitionRects) {
            const playerBounds = this.player.character!.getBounds();
            this.transitionRects.forEach((transitionRect) => {
                if (Phaser.Geom.Rectangle.Overlaps(playerBounds, transitionRect)) {
                    this.shutdown();
                    this.scene.start('Loader', {
                        targetScene: this.transitionPoints?.[0].properties?.find((prop: Phaser.Types.Tilemaps.TiledObject) => prop.name === 'destination')?.value ?? 'MainMenu',
                        previousScene: this.constructor.name,
                        player: this.player
                    });
                }
            });
        }
    }

    private shutdown = (): void => {
      this.children.removeAll(true);
      this.gameUI.destroy();
      this.player.destroy();
      this.animationManager.destroy();
      this.attackManager.destroy();
      this.enemyManager.destroy();
      this.collectableManager.destroy();
      EventBus.off('current-scene-ready');
      EventManager.Instance.off(GameEvents.PLAYER_DIED, this.runGameOver, this);
    }

    runGameOver = () => {
      this.time.delayedCall(500, () => {
        const matchData: MatchData = {
          scene: this.constructor.name,
          data: this.playerProgressionSystem.export()
        };
        this.scene.start('GameOver', matchData);
      });
    }
}
