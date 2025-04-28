import { EventBus } from '@/game/scenes/Services/EventBus';
import { Scene } from 'phaser';
import { Text, WindowResolution } from '@/components/configs/Properties';
import { Player, PlayerConfig } from '@/game/entities/player';

export type SceneData = {
    targetScene: string;
    previousScene: string;
}

export abstract class BaseScene extends Scene {
    protected camera!: Phaser.Cameras.Scene2D.Camera;
    protected background!: Phaser.GameObjects.Image;
    protected gameText!: Phaser.GameObjects.Text;
    protected tilesets!: Phaser.Tilemaps.Tileset[];
    protected layers!: Phaser.Tilemaps.TilemapLayer[]
    protected map!: Phaser.Tilemaps.Tilemap;
    protected player!: Player;
    protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    protected prevSceneData!: SceneData;
    protected transitionPoints: Phaser.Types.Tilemaps.TiledObject[] | undefined;

    // Zoom da câmera principal
    protected readonly cameraZoom = 2;
    // Configurações do Jogador
    protected playerConfig: PlayerConfig = {
        Position: { x: 0, y: 0 },
        Speed: 200,
        Scale: 1.5,
        key: 'player'
    };

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    protected init(data: SceneData): void {
        this.tilesets = [];
        this.layers = [];
        this.prevSceneData = data;
    }

    protected create(): void {
        this.setupLayers();
        this.setupPlayer();
        this.setupTransitionPoints();
        this.setupTexts();
        this.setupCollisions();
        this.setupCameras();
        this.setupInput();
    

        EventBus.emit('current-scene-ready', this);
    }

    public update(): void {
        this.handleInput();
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
            obj => obj.name === `spawn${this.prevSceneData.previousScene}`  // name dado ao objeto
        ) as Phaser.Types.Tilemaps.TiledObject;

        this.playerConfig.Position.x = (spawnPoint?.x ?? WindowResolution.width / 2) + (spawnPoint?.width ?? 0) * 0.5;
        this.playerConfig.Position.y = (spawnPoint?.y ?? WindowResolution.height / 2) + (spawnPoint?.height ?? 0) * 0.5;
        this.player = new Player(this, this.playerConfig);
        if (!this.player) {
            throw new Error("Failed to load player sprite.");
        }
        this.cameras.main.startFollow(this.player.sprite);
    }

    private setupTransitionPoints() {
        this.transitionPoints = this.map.getObjectLayer('transitionPoints')?.objects;
    }

    private setupTexts(): void {
        this.gameText = this.add.text(WindowResolution.width * 0.01, WindowResolution.height * 0.01, 'Teste TileD',
            Text.Title1
        ).setDepth(100);
    }

    private setupInput(): void {
        const cursors = this.input?.keyboard?.createCursorKeys();
        if (!cursors) {
            console.warn('Keyboard input is not available.');
            return;
        }
        this.cursors = cursors;
    }

    private setupCollisions(): void {
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.layers.forEach((layer) => {
            const collides = layer.layer.properties?.find((prop: any) => prop.name === 'collides') ?? false;
            if (collides) {
                layer.setCollisionByExclusion([-1]);
                this.physics.add.collider(this.player.sprite, layer);
            }
        });
    }

    private setupCameras(): void {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor('#FFFFFF');
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.camera.ignore(this.gameText);
        this.camera.setScroll(0, 0);
        this.camera.setZoom(this.cameraZoom);
        this.camera.roundPixels = false;

        this.cameras.add(0, 0, WindowResolution.width * 0.5, WindowResolution.height * 0.1, false, 'cameraTexto');
        this.cameras.getCamera('cameraTexto')?.ignore([...this.layers, this.player.sprite]);
        this.cameras.getCamera('cameraTexto')?.setScroll(0, 0);
    }

    // Usados em update()
    private handleInput() {
        if (this.cursors.left.isDown) {
            this.player.sprite.setVelocityX(-this.playerConfig.Speed); // Move para a esquerda
        } else if (this.cursors.right.isDown) {
            this.player.sprite.setVelocityX(this.playerConfig.Speed); // Move para a direita
        } else {
            this.player.sprite.setVelocityX(0); // Para o movimento horizontal
        }

        if (this.cursors.up.isDown) {
            this.player.sprite.setVelocityY(-this.playerConfig.Speed); // Move para cima
        } else if (this.cursors.down.isDown) {
            this.player.sprite.setVelocityY(this.playerConfig.Speed); // Move para baixo
        } else {
            this.player.sprite.setVelocityY(0); // Para o movimento vertical
        }
    }

    private changeScenario() {
        if(this.transitionPoints) {
            const playerBounds = this.player.sprite.getBounds();
            this.transitionPoints.forEach((point) => {
                const transitionRect = new Phaser.Geom.Rectangle(
                    point.x, 
                    point.y, 
                    point.width ?? 0, 
                    point.height ?? 0
                );
                
                if (Phaser.Geom.Rectangle.Overlaps(playerBounds, transitionRect)) {
                    this.shutdown();
                    this.scene.stop(this.constructor.name);
                    const cameraTexto = this.cameras?.getCamera('cameraTexto');
                    if(cameraTexto) {
                        this.cameras.remove(cameraTexto);
                    }
                    console.log(`Carregando tilemap: ${this.constructor.name}`);
                    this.scene.start('Loader', { 
                        targetScene: point.properties?.find((prop: Phaser.Types.Tilemaps.TiledObject) => prop.name === 'destination')?.value ?? 'MainMenu',
                        previousScene: this.constructor.name
                    });
                }
            });
        }
    }
    private shutdown() {
        this.player.sprite?.destroy();
        this.layers?.forEach(layer => layer.destroy());
        EventBus.off('current-scene-ready'); // Remove todos os listeners relacionados
    }
}