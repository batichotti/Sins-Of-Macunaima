import { Boot } from './core/Boot';
import { Game } from 'phaser';
import { Loader } from './core/Loader';
import { Mapa } from '@/game/scenes/World/Mapa';
import GameOver from './core/GameOver';
import GameWin from './core/GameWin';
import { IMatchStats } from './types';

const StartGame = (parent: string, matchDTO: IMatchStats) => {
    try {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            scale: {
                width: 1024,
                height: 576,
                autoCenter: Phaser.Scale.NONE,
                mode: Phaser.Scale.NONE,
            },
            parent: 'game-container',
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
        const game = new Game({ ...config, parent });
        game.scene.start('Boot', matchDTO);

        return game;
    } catch(error) {
        alert('Erro ao criar jogo Phaser:' + error);
        return null;
    }


}

export default StartGame;
