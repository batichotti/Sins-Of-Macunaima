import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from '@/game/main';
import { EventBus } from './core/EventBus';
import { IMatchStats, MatchData } from './types';

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
    matchDTO?: IMatchStats | null;
    backendTransfer?: (data: Partial<IMatchStats>) => void;
    mainMenu?: () => void;
}

/**
* Div do jogo.
*/
export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene, matchDTO, backendTransfer, mainMenu }, ref) {
    const game = useRef<Phaser.Game | null>(null!);

    useLayoutEffect(() => {
        if (game.current === null && matchDTO) {

            game.current = StartGame("game-container", matchDTO);
            if (typeof ref === 'function') {
                ref({ game: game.current, scene: null });
            } 
            else if (ref) {
                ref.current = { game: game.current, scene: null };
            }

        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                if (game.current !== null) {
                    game.current = null;
                }
            }
        }
    }, [ref, matchDTO]);

    useEffect(
        () =>{
            EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) => {
                if (currentActiveScene && typeof currentActiveScene === 'function') {
                    currentActiveScene(scene_instance);
                }
                if (typeof ref === 'function') {
                    ref({ game: game.current, scene: scene_instance });
                }
                else if (ref) {
                    ref.current = { game: game.current, scene: scene_instance };
                }
            }
            );
            return () => {
                EventBus.removeListener('current-scene-ready');
            }
        }, 
        [currentActiveScene, matchDTO, ref]
    );

    useEffect(() => {
        /**
         * Faz alguma maracutaia para que os dados sejam transferidos para o backend.
         * 
         * @param data Dados do backend transferidos para o jogo.
         */
        function handleMatchData(data: Partial<IMatchStats> | undefined) {
            if(data && typeof backendTransfer === 'function') backendTransfer(data);
        }

        /**
         * Volta ao menu principal.
         */
        function handleMainMenu() {
            if(mainMenu && typeof mainMenu === 'function') mainMenu();
        }


        EventBus.on('backendTransfer', (data: Partial<MatchData>) => handleMatchData(data.data));
        EventBus.on('mainMenu', () => handleMainMenu());

        return () => {
            EventBus.removeListener('backendTransfer');
            EventBus.removeListener('mainMenu');
        }
    }, [backendTransfer, mainMenu]);

    return (<div id="game-container"></div>);

});
