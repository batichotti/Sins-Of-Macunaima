import { EventBus } from '@/game/scenes/Services/EventBus';
import { Scene } from 'phaser';
import { Text, WindowResolution } from '@/components/configs/Properties';
import SceneData from '@/core/SceneData';

export abstract class BaseScene extends Scene {
    protected camera!: Phaser.Cameras.Scene2D.Camera;
    protected background!: Phaser.GameObjects.Image;
    protected gameText!: Phaser.GameObjects.Text;
    protected tilesets!: Phaser.Tilemaps.Tileset[];
    protected layers!: Phaser.Tilemaps.TilemapLayer[]
    protected map!: Phaser.Tilemaps.Tilemap;
    protected player!: Phaser.Physics.Arcade.Sprite;
    protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    protected prevSceneData = {} as SceneData;

    protected playerStartPosition = { x: 0, y: 0 };

    // Zoom da câmera principal
    protected readonly cameraZoom = 2;
    // Velocidade do jogador
    protected readonly playerSpeed = 200;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    protected init(data: SceneData) {
        this.tilesets = [];
        this.layers = [];
        this.prevSceneData = data;
    }

    protected create() {
        this.setupLayers();
        this.setupPlayer();
        this.setupTexts();
        this.setupCollisions();
        this.setupCameras();
        this.setupInput();
    

        EventBus.emit('current-scene-ready', this);
    }

    public update(): void {
        this.handleInput();
    }

    // Usados em create()
    protected setupLayers(): void {
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

    protected setupPlayer(): void {
        const spawnPoint = this.map.findObject(
            'spawnPoints', // nome da Object Layer
            obj => obj.name === `spawn${this.prevSceneData.previousScene}`  // name dado ao objeto
        ) as Phaser.Types.Tilemaps.TiledObject;
        this.playerStartPosition.x = spawnPoint?.x ?? WindowResolution.width / 2 + (spawnPoint?.width ?? 0) * 0.5;
        this.playerStartPosition.y = spawnPoint?.y ?? WindowResolution.height / 2 + (spawnPoint?.height ?? 0) * 0.5;

        const player = this.physics.add.sprite(this.playerStartPosition.x, this.playerStartPosition.y, 'player', 0);
        player.setScale(1.5, 1.5);
        if (!player) {
            throw new Error("Failed to load player sprite.");
        }
        player.setCollideWorldBounds(true);
        this.player = player;
        this.player.setDepth(100);
        this.cameras.main.startFollow(player);
    }

    protected setupTexts(): void {
        this.gameText = this.add.text(WindowResolution.width * 0.01, WindowResolution.height * 0.01, 'Teste TileD',
            Text.Title1
        ).setDepth(100);
    }

    protected setupInput(): void {
        const cursors = this.input?.keyboard?.createCursorKeys();
        if (!cursors) {
            console.warn('Keyboard input is not available.');
            return;
        }
        this.cursors = cursors;
    }

    protected setupCollisions(): void {
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.layers.forEach((layer) => {
            const collides = layer.layer.properties?.find((prop: any) => prop.name === 'collides') ?? false;
            if (collides) {
                layer.setCollisionByExclusion([-1]);
                this.physics.add.collider(this.player, layer);
            }
        });
    }

    protected setupCameras(): void {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor('#FFFFFF');
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.camera.ignore(this.gameText);
        this.camera.setScroll(0, 0);
        this.camera.setZoom(this.cameraZoom);
        this.camera.roundPixels = false;

        this.cameras.add(0, 0, WindowResolution.width * 0.5, WindowResolution.height * 0.1, false, 'cameraTexto');
        this.cameras.getCamera('cameraTexto')?.ignore([...this.layers, this.player]);
        this.cameras.getCamera('cameraTexto')?.setScroll(0, 0);
    }

    // Usados em update()
    protected handleInput() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed); // Move para a esquerda
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed); // Move para a direita
        } else {
            this.player.setVelocityX(0); // Para o movimento horizontal
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-this.playerSpeed); // Move para cima
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(this.playerSpeed); // Move para baixo
        } else {
            this.player.setVelocityY(0); // Para o movimento vertical
        }
    }
}