import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Text, WindowResolution } from '../../components/configs/Properties'

export class PlanicieSuperior extends Scene {
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.Image;
    gameText!: Phaser.GameObjects.Text;
    tilesets!: Phaser.Tilemaps.Tileset[];
    layers!: Phaser.Tilemaps.TilemapLayer[]
    map!: Phaser.Tilemaps.Tilemap;
    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

     // Posição inicial do jogador
    private playerStartPosition = { x: 0, y: 0 };
     // Zoom da câmera principal
    private readonly cameraZoom = 2;
     // Velocidade do jogador
    private readonly playerSpeed = 200;


    constructor () {
        super('PlanicieSuperior');
        this.tilesets = [];
        this.layers = [];
    }

    create () {
        this.setupLayers();
        this.setupPlayer();
        this.setupTexts();
        this.setupCollisions();
        this.setupCameras();
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
    setupLayers(): void {
        this.map = this.make.tilemap({ key: 'PlanicieSuperior' });
    
        // Adiciona tilesets dinamicamente com base nos tilesets do mapa
        this.map.tilesets.forEach((tileset) => {
            const addedTileset = this.map.addTilesetImage(tileset.name, tileset.name, 16, 16, 1, 2);
            if (addedTileset) {
                this.tilesets.push(addedTileset);
            }
        });
    
        // Cria camadas dinamicamente com base nas camadas do mapa
        this.map.layers.forEach((layerData, index) => {
            const gameLayer = this.map.createLayer(layerData.name, this.tilesets);
            if (gameLayer) {
                gameLayer.setDepth(index); // Define a profundidade da camada
                this.layers.push(gameLayer); // Armazena a camada para uso posterior
            }
        });
    }

    setupPlayer(): void {
        this.playerStartPosition = {x: this.map.widthInPixels * 0.5, y: this.map.heightInPixels * 0.5};
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

    setupTexts(): void {
        this.gameText = this.add.text(WindowResolution.width * 0.01, WindowResolution.height * 0.01, 'Teste TileD',
            Text.Title1
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

    setupCollisions(): void {
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.layers.forEach((layer) => {
            // 'value' não existe bua bua bua
            const collides = layer.layer.properties?.find((prop: any) => prop.name === 'collides')?.value || false;
            if (collides) {
                layer.setCollisionByExclusion([-1]);
                this.physics.add.collider(this.player, layer);
            }
        });
    }

    setupCameras(): void {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor('#FFFFFF');
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.camera.ignore(this.gameText);
        this.camera.setScroll(0, 0);
        this.camera.setZoom(this.cameraZoom);
        this.camera.roundPixels = true;

        this.cameras.add(0, 0, WindowResolution.width * 0.5, WindowResolution.height * 0.1, false, 'cameraTexto');
        this.cameras.getCamera('cameraTexto')?.ignore([...this.layers, this.player]);
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