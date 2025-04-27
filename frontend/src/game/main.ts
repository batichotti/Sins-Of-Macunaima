import { Boot } from '@/game/scenes/Boot/Boot';
import { GameOver } from '@/game/scenes/GameOver/GameOver';
import { MainMenu } from '@/game/scenes/MainMenu/MainMenu';
import { Game } from 'phaser';
import { Loader } from '@/game/scenes/Services/Loader';
import { Praia } from '@/game/scenes/World/Praia';
import { PlanicieSuperior } from '@/game/scenes/World/PlanicieSuperior';
import { PlanicieInferior } from '@/game/scenes/World/PlanicieInferior';

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
