'use client';
import { forwardRef, useEffect, useRef } from 'react';
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
    onLoad?: () => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene, matchDTO, backendTransfer, mainMenu, onLoad }, ref) {
    const game = useRef<Phaser.Game | null>(null);
    const isClient = useRef(true);

    useEffect(() => {
        isClient.current = typeof window !== 'undefined';
        
        if (isClient.current && game.current === null && matchDTO) {
            const container = document.getElementById("game-container");
            if (!container) {
                console.warn("Game container não encontrado");
                return;
            }

            try {
                game.current = StartGame("game-container", matchDTO);
                
                if (typeof ref === 'function') {
                    ref({ game: game.current, scene: null });
                } 
                else if (ref) {
                    ref.current = { game: game.current, scene: null };
                }

                if(onLoad) onLoad();

            } catch (error) {
                console.error("Erro ao inicializar Phaser:", error);
            }
        }

        return () => {
            if (game.current) {
                try {
                    game.current.destroy(true);
                    game.current = null;
                } catch (error) {
                    console.error("Erro ao destruir Phaser:", error);
                }
            }
        }
    }, [ref, matchDTO, onLoad]);

    useEffect(() => {
        if (!isClient.current) return;

        const handleSceneReady = (scene_instance: Phaser.Scene) => {
            if (currentActiveScene && typeof currentActiveScene === 'function') {
                currentActiveScene(scene_instance);
            }
            if (typeof ref === 'function') {
                ref({ game: game.current, scene: scene_instance });
            }
            else if (ref) {
                ref.current = { game: game.current, scene: scene_instance };
            }
        };

        EventBus.on('current-scene-ready', handleSceneReady);
        
        return () => {
            EventBus.removeListener('current-scene-ready');
        }
    }, [currentActiveScene, matchDTO, ref]);

    useEffect(() => {
        if (!isClient.current) return;

        function handleMatchData(data: Partial<IMatchStats> | undefined) {
            if(data && typeof backendTransfer === 'function') {
                backendTransfer(data);
            }
        }

        function handleMainMenu() {
            if(mainMenu && typeof mainMenu === 'function') {
                mainMenu();
            }
        }

        EventBus.on('backendTransfer', (data: Partial<MatchData>) => handleMatchData(data.data));
        EventBus.on('mainMenu', () => handleMainMenu());

        return () => {
            EventBus.removeListener('backendTransfer');
            EventBus.removeListener('mainMenu');
        }
    }, [backendTransfer, mainMenu]);

    if (!isClient.current && typeof window === 'undefined') {
        return <div>Carregando...</div>;
    }

    return (<div id="game-container"></div>);
});