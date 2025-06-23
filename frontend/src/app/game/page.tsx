'use client';
import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame } from '../../game/PhaserGame';
import dynamic from 'next/dynamic';
import { CharacterEnum, CharacterTypes, ILevel, IMatchStats, MeleeEnum, MeleeTypes, ProjectileEnum, ProjectileTypes } from '../../game/types';
import styles from '@/styles/Game.module.css';

const PhaserGame = dynamic(() => import('../../game/PhaserGame').then(mod => mod.PhaserGame), { ssr: false });

export default function Game() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [matchDTO, setmatchDTO] = useState<IMatchStats | null>(null);

    /**
     * Pegar os dados do backend aqui.
     */
    async function fetchMatchStats() {
        // Pegar daqui os dados do backend.
        const data: IMatchStats = {
            player: {
                name: 'Irineu',
                level: { level: 1 } as ILevel,
                playableCharacters: [
                    CharacterTypes[CharacterEnum.MACUNAIMA],
                    CharacterTypes[CharacterEnum.PERI]
                ],
                weaponSet: {
                    projectile: ProjectileTypes[ProjectileEnum.FLECHA],
                    melee: MeleeTypes[MeleeEnum.PALMEIRA]
                },
                inventory: new Map
            },
            pointsGained: 0,
            xpGained: 0,
            timeElapsed: 0,
            kills: 0
        }

        setmatchDTO(data);
    }

    /**
     * Manda os dados para o backend.
     * 
     * @param data Dados do backend transferidos para o jogo.
     */
    async function handleBackendTransfer(data: Partial<IMatchStats>) {
        console.log('PhaserGame: Dados recebidos do phaser:', data);
    }


    /**
     * Volta para o menu principal.
     */
    async function handleMainMenu() {
        console.log('PhaserGame: Voltando ao menu principal...');
    }

    useEffect(() => { fetchMatchStats()}, []);

    return (
        <div className={styles.GameContainer}>
            <PhaserGame ref={phaserRef} matchDTO={matchDTO} backendTransfer={handleBackendTransfer} mainMenu={handleMainMenu}/>
        </div>
    );
}
