import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Game } from 'phaser';
import { Loader } from './scenes/Loader';
import { Praia } from './scenes/Praia';
import { PlanicieSuperior } from './scenes/PlanicieSuperior';
import { PlanicieInferior } from './scenes/PlanicieInferior';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.75,
    height: window.innerHeight * 0.75,
    parent: 'game-container',
    pixelArt: true,
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: 0 },
            debug: false
        }
    },
    scene: [
        Boot,
        Loader,
        MainMenu,
        Praia,
        PlanicieSuperior,
        PlanicieInferior,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
