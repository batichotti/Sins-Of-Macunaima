import { EventBus } from '@/game/core/EventBus';
import { Scene } from 'phaser';
import { Text, WindowResolution } from '@/game/components/configs/Properties';
import { Player, Character } from '@/game/entities/Player';
import BulletManager from '@/game/entities/BulletManager';
import { AnimatedTileData } from '../types/Tiles';
import { SceneData } from '../types';
import GameCameras from '../entities/GameCameras';
import { Level } from '../entities/Level';
import { Weapon } from '../entities/Weapon';

export abstract class BaseScene extends Scene {
    public gameCameras: GameCameras;
    protected background!: Phaser.GameObjects.Image;
    protected gameText!: Phaser.GameObjects.Text;
    protected player!: Player;
    protected tilesets!: Phaser.Tilemaps.Tileset[];
    protected layers!: Phaser.Tilemaps.TilemapLayer[];
    protected animatedTiles!: AnimatedTileData[];
    protected map!: Phaser.Tilemaps.Tilemap;
    protected bulletManager: BulletManager;
    protected arrows!: Phaser.Types.Input.Keyboard.CursorKeys;
    protected awsd!: Phaser.Types.Input.Keyboard.CursorKeys;
    protected sceneData!: SceneData;
    protected transitionPoints: Phaser.Types.Tilemaps.TiledObject[];
    protected transitionRects: Phaser.Geom.Rectangle[];

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
    }

    protected create(): void {
        this.setupLayers();
        this.setupAnimatedTiles();
        this.setupPlayer();
        this.setupTransitionPoints();
        this.setupCollisions();
        this.setupCameras();
        this.setupInput();
        this.setupBulletManager();
    

        EventBus.emit('current-scene-ready', this);
    }

    public update(time: number, delta: number): void {
        this.handleInput();
        this.handleAnimatedTiles(delta);
        this.changeScenario();
    }

    // Usados em create()
    private setupLayers(): void {
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

    private setupPlayer(): void {
        const spawnPoint = this.map.findObject(
            'spawnPoints', // nome da Object Layer
            obj => obj.name === `spawn${this.sceneData.targetScene}`  // name dado ao objeto
        ) as Phaser.Types.Tilemaps.TiledObject;
        const startingPosition = new Phaser.Math.Vector2(
            (spawnPoint?.x ?? WindowResolution.width / 2) + (spawnPoint?.width ?? 0) * 0.5,
            (spawnPoint?.y ?? WindowResolution.height / 2) + (spawnPoint?.height ?? 0) * 0.5
        );

        const character = new Character(this, { x: startingPosition.x, y: startingPosition.y } as Phaser.Math.Vector2, this.sceneData.character.spriteKey, this.sceneData.character.baseSpeed, this.sceneData.character.baseLife);
        const level = new Level(this.sceneData.level.level);
        const weapon = new Weapon(this.sceneData.weapon.name, this.sceneData.weapon.spriteKey, this.sceneData.weapon.baseDamage, this.sceneData.weapon.baseDamage)
        this.player = new Player(this.sceneData.player.name, character, level, weapon);

        if (!this.player) {
            throw new Error("Failed to load player.");
        }
        this.cameras.main.startFollow(this.player.character);
    }

    private setupTransitionPoints() {
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

    private setupInput(): void {
        const keyboard = this.input.keyboard;
        if(keyboard) {
            this.arrows = keyboard.addKeys(
                {
                    'up': Phaser.Input.Keyboard.KeyCodes.UP,
                    'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
                    'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
                    'right': Phaser.Input.Keyboard.KeyCodes.RIGHT
                }
            ) as Phaser.Types.Input.Keyboard.CursorKeys;
        }
        const awsd = this.input?.keyboard?.addKeys(
            {
                'up': Phaser.Input.Keyboard.KeyCodes.W,
                'down': Phaser.Input.Keyboard.KeyCodes.S,
                'left': Phaser.Input.Keyboard.KeyCodes.A,
                'right': Phaser.Input.Keyboard.KeyCodes.D,

            }
        ) as Phaser.Types.Input.Keyboard.CursorKeys;
        if (!awsd) {
            console.warn('Keyboard input is not available.');
            return;
        }
        this.awsd = awsd;
    }

    private setupCollisions(): void {
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

    private setupCameras(): void {
        this.gameCameras.initCameras(this.map.widthInPixels, this.map.heightInPixels);
        this.gameCameras.ui.ignore(this.layers);
        this.gameCameras.ui.ignore(this.player.character!);
    }

    protected setupBulletManager(): void {
        this.bulletManager = new BulletManager(this, this.player.weapon);
    }

    private setupAnimatedTiles(): void {
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

    private handleInput(): void {
        // Movimento
        let movement = new Phaser.Math.Vector2(0, 0);

        if (this.awsd.left.isDown) movement.x = -1;
        if (this.awsd.right.isDown) movement.x = 1;
        if (this.awsd.up.isDown) movement.y = -1;
        if (this.awsd.down.isDown) movement.y = 1;

        movement.x *= this.player.character!.baseSpeed;
        movement.y *= this.player.character!.baseSpeed;

        this.player.character.playerMove(movement);

        // Atirar com o teclado
        let coords = new Phaser.Math.Vector2(0, 0);

        if (this.arrows.left.isDown) coords.x = -1;
        if (this.arrows.right.isDown) coords.x = 1;
        if (this.arrows.up.isDown) coords.y = -1;
        if (this.arrows.down.isDown) coords.y = 1;
        if(coords.x || coords.y) {
            const angle = Phaser.Math.Angle.Between(0, 0, coords.x, coords.y);
            this.bulletManager.fire(this.player.character!.x, this.player.character!.y, angle);
        }

        // Atirar com o mouse
        let pointer = this.input.activePointer;
        if(pointer.isDown) {
            const angle = Phaser.Math.Angle.Between(
              this.player.character!.x, this.player.character!.y,
              pointer.worldX, pointer.worldY
            );
            this.bulletManager.fire(this.player.character!.x, this.player.character!.y, angle);
        }
    }

    private handleAnimatedTiles(delta: number): void {
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
      

    private changeScenario(): void {
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
    
    private shutdown(): void {
        this.player.character?.destroy();
        this.layers?.forEach(layer => layer.destroy());
        const cameraTexto = this.cameras?.getCamera('cameraTexto');
        if(cameraTexto) { this.cameras.remove(cameraTexto); }
        EventBus.off('current-scene-ready');
    }
}