import { Boot } from './core/Boot';
import { Game } from 'phaser';
import { Loader } from './core/Loader';
import { Mapa } from '@/game/scenes/World/Mapa';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.75,
    height: window.innerHeight * 0.75,
    parent: 'game-container',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    pixelArt: true,
    backgroundColor: '#028af8',
    fps: {
        target: 60,
        forceSetTimeOut: true,
        smoothStep: true
    },
    physics: {
        default: 'matter',
        matter: { 
            gravity: { x: 0, y: 0 }, 
            enableSleeping: true
        }
    },
    scene: [
        Boot,
        Loader,
        Mapa
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
