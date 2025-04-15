import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Text, WindowResolution } from '../../components/configs/Properties'

export class Game extends Scene
{
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.Image;
    gameText!: Phaser.GameObjects.Text;
    tileset!: Phaser.Tilemaps.Tileset;
    map!: Phaser.Tilemaps.Tilemap;
    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;

        const cameraTexto = this.cameras.add(0, 0, WindowResolution.width, WindowResolution.height, false);
        this.gameText = this.add.text(WindowResolution.width * 0.06, WindowResolution.height * 0.03, 'Teste TileD',
            Text.Properties_1
        ).setOrigin(0.5).setDepth(100);
        
        this.map = this.make.tilemap({ key: 'mapa' });
        const tileset = this.map.addTilesetImage('TileSet', 'tiles');
        if (!tileset) {
            throw new Error("Failed to load tileset 'TileSet'.");
        }
        this.tileset = tileset;
    
        const player = this.physics.add.sprite(100, 100, 'galinha', 0);
        player.setScale(0.01, 0.01);
        if (!player) {
            throw new Error("Failed to load player sprite.");
        }
        player.setCollideWorldBounds(true);
        this.player = player;
        this.camera.startFollow(player);
        
        
        const grama = this.map.createLayer('Grama', this.tileset, 0, 0);
        const arvores = this.map.createLayer('Árvores', this.tileset, 0, 0);
        const floes = this.map.createLayer('Floes', this.tileset, 0, 0);

        if(!grama) {
            throw new Error("Failed to load layer 'Grama'.");
        }

        if(!arvores) {
            throw new Error("Failed to load layer 'arvores'.");
        }

        if(!floes) {
            throw new Error("Failed to load layer 'floes'.");
        }

        cameraTexto.ignore([grama, arvores, floes, this.player]);

        arvores?.setCollisionByProperty({collider : true});
        this.physics.add.collider(this.player, arvores)
        
        const mapWidth = this.map.widthInPixels;
        const mapHeight = this.map.heightInPixels;
        this.camera.ignore(this.gameText);
        cameraTexto.ignore(grama);
        cameraTexto.ignore(arvores);
        cameraTexto.ignore(floes);
        this.camera.setBounds(0, 0, mapWidth, mapHeight);
        this.camera.setZoom(12);

        let cursors = this.input?.keyboard?.createCursorKeys();
        if (!cursors) {
            console.warn('Keyboard input is not available.');
            return;
        }
        this.cursors = cursors;
        player.setDepth(100);
        this.physics.add.collider(this.player, arvores);
        EventBus.emit('current-scene-ready', this);
    }

    update(): void {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-100); // Move para a esquerda
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(100); // Move para a direita
        } else {
            this.player.setVelocityX(0); // Para o movimento horizontal
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-100); // Move para cima
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(100); // Move para baixo
        } else {
            this.player.setVelocityY(0); // Para o movimento vertical
        }
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
