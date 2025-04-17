import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Text, WindowResolution } from '../../components/configs/Properties'
export class Game extends Scene {
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.Image;
    gameText!: Phaser.GameObjects.Text;
    tileset!: Phaser.Tilemaps.Tileset;
    map!: Phaser.Tilemaps.Tilemap;
    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

     // Nomes das camadas
    private readonly layerNames = ['Grama', 'Arvores', 'Baus', 'Agua', 'Arbustos'];
     // Camadas com colisão
    private readonly collisionLayers = ['Baus', 'Arvores', 'Agua'];
     // Posição inicial do jogador
    private playerStartPosition = { x: 0, y: 0 };
     // Zoom da câmera principal
    private readonly cameraZoom = 4;
     // Velocidade do jogador
    private readonly playerSpeed = 100;


    constructor () {
        super('Game');
        
    }

    create () {
        const layers = this.setupLayers();
        this.setupPlayer();
        this.setupTexts();
        this.setupCollisions(layers);
        this.setupCameras(layers);
        this.setupInput();
    

        EventBus.emit('current-scene-ready', this);
    }

    update(): void {
        this.handleInput();
    }

    changeScene(): void {
        this.scene.start('GameOver');
    }

    // Usados em create()
    setupLayers(): Phaser.Tilemaps.TilemapLayer[] {
        this.map = this.make.tilemap({ key: 'mapa' });
        const tileset = this.map.addTilesetImage('tileset_16x16', 'tiles');
        if (!tileset) {
            throw new Error("Failed to load tileset 'TileSet'.");
        }
        const layers: Phaser.Tilemaps.TilemapLayer[] = [];
        this.layerNames.forEach((layerName) => {
            const layer = this.map.createLayer(layerName, tileset, 0, 0);
            layer!.name = layerName;
            if (!layer) {
                throw new Error(`Failed to load layer '${layerName}'.`);
            }
            layers.push(layer);
        });
        return layers;
    }

    setupPlayer(): void {
        this.playerStartPosition = {x: this.map.widthInPixels * 0.99, y: this.map.heightInPixels * 0.965};
        const player = this.physics.add.sprite(this.playerStartPosition.x, this.playerStartPosition.y, 'player', 0);
        player.setScale(0.03, 0.03);
        if (!player) {
            throw new Error("Failed to load player sprite.");
        }
        player.setCollideWorldBounds(true);
        this.player = player;
        this.player.setDepth(100);
        this.cameras.main.startFollow(player);
    }

    setupTexts(): void {
        this.gameText = this.add.text(WindowResolution.width * 0.01, WindowResolution.height * 0.01, 'Teste TileD',
            Text.Properties_1
        ).setDepth(100);
    }

    setupInput(): void {
        const cursors = this.input?.keyboard?.createCursorKeys();
        if (!cursors) {
            console.warn('Keyboard input is not available.');
            return;
        }
        this.cursors = cursors;
    }

    setupCollisions(layers: Phaser.Tilemaps.TilemapLayer[]): void {
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        layers.forEach((layer) => {
            if (this.collisionLayers.includes(layer.name)) {
                console.log(`Colisão com a camada: ${layer.name}`);
                layer.setCollisionByExclusion([-1]);
                this.physics.add.collider(this.player, layer);
            }
        });
    }

    setupCameras(layers: Phaser.Tilemaps.TilemapLayer[]): void {
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.camera.ignore([this.gameText]);
        this.camera.setScroll(0, 0);
        this.camera.setZoom(this.cameraZoom);

        this.cameras.add(0, 0, WindowResolution.width * 0.5, WindowResolution.height * 0.1, false, 'cameraTexto');
        this.cameras.getCamera('cameraTexto')?.ignore([...layers, this.player]);
        this.cameras.getCamera('cameraTexto')?.setScroll(0, 0);
    }

    // Usados em update()
    handleInput() {
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