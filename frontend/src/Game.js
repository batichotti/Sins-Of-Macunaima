// src/Game.js
import { useEffect } from 'react';
import Phaser from 'phaser';

function Game() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
        },
      },
      scene: {
        preload,
        create,
        update,
      },
      parent: 'phaser-game',
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
    }

    function create() {
      this.add.image(400, 300, 'logo');
    }

    function update() {}

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-game" />;
}

export default Game;
