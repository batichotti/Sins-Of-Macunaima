export default class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
      console.log("Game Over")
        const { width, height } = this.scale;
        const gameOverText = this.add.text(width / 2, height / 2, 'Game Over', {
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        const restartButton = this.add.text(width / 2, height / 2 + 50, 'Restart', {
            fontSize: '24px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
