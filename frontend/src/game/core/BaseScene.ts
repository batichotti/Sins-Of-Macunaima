import { EventBus } from '@/game/core/EventBus';
import { Scene } from 'phaser';
import { WindowResolution } from '@/game/components/configs/Properties';
import { Player, Character } from '@/game/entities/Player';
import { AnimatedTileData } from '../types/Tiles';
import { SceneData } from '../types';
import GameCameras from '../entities/GameCameras';
import { Level } from '../entities/Level';
import IBaseScene from '../types/BaseScene';
import AttackManager from '../entities/Attack';
import InputManager from '../entities/Input';

export class BaseScene extends Scene implements IBaseScene {
    gameCameras: GameCameras;
    player: Player;
    tilesets: Phaser.Tilemaps.Tileset[];
    layers: Phaser.Tilemaps.TilemapLayer[];
    animatedTiles: AnimatedTileData[];
    inputManager: InputManager;
    map: Phaser.Tilemaps.Tilemap;
    sceneData: SceneData;
    transitionPoints: Phaser.Types.Tilemaps.TiledObject[];
    transitionRects: Phaser.Geom.Rectangle[];
    attackManager: AttackManager;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    protected preload(){
        this.textures.generate('bullet', {
            data: ['1'],
            pixelWidth: 1,
            pixelHeight: 1
        });
    }

    protected init(data: SceneData): void {
        this.tilesets = [];
        this.layers = [];
        this.animatedTiles = [];
        this.transitionRects = [];
        this.sceneData = data;
        this.gameCameras = new GameCameras(this);
        this.inputManager = new InputManager(this);
    }

    protected create(): void {
        this.setupLayers();
        this.setupAnimatedTiles();
        this.setupPlayer();
        this.setupTransitionPoints();
        this.setupCollisions();
        this.setupCameras();
        this.setupAttackManager();
    

        EventBus.emit('current-scene-ready', this);
    }

    update(time: number, delta: number): void {
        this.handleInput();
        this.handleAnimatedTiles(delta);
        this.changeScenario();
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
            (spawnPoint?.y ?? WindowResolution.height / 2) + (spawnPoint?.height ?? 0) * 0.5
        );

        const character = new Character(this, { x: startingPosition.x, y: startingPosition.y } as Phaser.Math.Vector2, this.sceneData.character.spriteKey, this.sceneData.character.baseSpeed, this.sceneData.character.baseLife);
        const level = new Level(1);
        this.player = new Player(this.sceneData.player.name, character, level, this.sceneData.weaponSet);

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
        this.layers.forEach((layer) => {
            const collides = layer.layer.properties?.find((prop: any) => prop.name === 'collides') ?? false;
            if (collides) {
                layer.setCollisionByExclusion([-1]);
                this.physics.add.collider(this.player.character!, layer);
            }
        });
    }

    setupCameras(): void {
        this.gameCameras.initCameras(this.map.widthInPixels, this.map.heightInPixels);
        this.gameCameras.ui.ignore(this.layers);
        this.gameCameras.ui.ignore(this.player.character!);
        this.gameCameras.main.startFollow(this.player.character);
    }

    setupAttackManager(): void {
        this.attackManager = new AttackManager(this, this.player.weaponSet);
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
      

    // Usados em update()

    handleInput(): void {
        // Movimento
        this.player.character.playerMove(this.inputManager.handleArrows());

        const angle = this.inputManager.handleAwsd();
        if(angle != null) this.attackManager.fire(this.player.character.x, this.player.character.y, angle);

        const anglePointer = this.inputManager.handlePointer(this.player.character.x, this.player.character.y);
        if(anglePointer != null) this.attackManager.fire(this.player.character.x, this.player.character.y, anglePointer);
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
                    this.scene.stop(this.constructor.name);
                    this.scene.start('Loader', {
                        targetScene: this.transitionPoints?.[0].properties?.find((prop: Phaser.Types.Tilemaps.TiledObject) => prop.name === 'destination')?.value ?? 'MainMenu',
                        previousScene: this.constructor.name,
                        player: this.player
                    });
                }
            });
        }
    }
    
    shutdown(): void {
        this.player.character?.destroy();
        this.layers?.forEach(layer => layer.destroy());
        EventBus.off('current-scene-ready');
    }
}