'use client';
import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame } from '../../game/PhaserGame';
import dynamic from 'next/dynamic';
import { CharacterEnum, CharacterTypes, ILevel, IMatchStats, MeleeEnum, MeleeTypes, ProjectileEnum, ProjectileTypes } from '../../game/types';
import styles from '@/styles/Game.module.css';
import { useRouter } from 'next/navigation';

const PhaserGame = dynamic(() => import('../../game/PhaserGame').then(mod => mod.PhaserGame), { ssr: false });

export default function Game() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [matchDTO, setmatchDTO] = useState<IMatchStats | null>(null);
    const [gameLoaded, setGameLoaded] = useState(false);
    const router = useRouter();

    async function fetchMatchStats() {
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

    async function handleBackendTransfer(data: Partial<IMatchStats>) {
        console.log('PhaserGame: Dados recebidos do phaser:', data);
    }

    async function handleMainMenu() {
        router.push('/mainMenu')
    }

    useEffect(() => { fetchMatchStats()}, []);

  return (
    <div className={styles.GameContainer}>
        
        {!gameLoaded && (<div className={styles.GamePlaceholder} />)}

        {matchDTO && (<PhaserGame ref={phaserRef} backendTransfer={(data: Partial<IMatchStats>) => handleBackendTransfer(data)} mainMenu={() => handleMainMenu()} matchDTO={matchDTO} onLoad={() => setGameLoaded(true)} />)}
    </div>
  );
}