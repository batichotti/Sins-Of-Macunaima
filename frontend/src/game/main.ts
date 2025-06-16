import { Boot } from './core/Boot';
import { Game } from 'phaser';
import { Loader } from './core/Loader';
import { Mapa } from '@/game/scenes/World/Mapa';
import GameOver from './core/GameOver';
import GameWin from './core/GameWin';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.75,
    height: window.innerHeight * 0.75,
    parent: 'game-container',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    pixelArt: true,
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [
      Boot,
      Loader,
      Mapa,
      GameOver,
      GameWin
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
