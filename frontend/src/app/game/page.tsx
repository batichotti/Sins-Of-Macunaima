'use client';
import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame } from '../../game/PhaserGame';
import dynamic from 'next/dynamic';
import { CharacterEnum, CharacterTypes, ILevel, IMatchStats, MeleeEnum, MeleeTypes, ProjectileEnum, ProjectileTypes } from '../../game/types';
import styles from '@/styles/Game.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_context/_authContext';
import GameKeybinds from '../_lib/_gameKeybinds';

const PhaserGame = dynamic(() => import('../../game/PhaserGame').then(mod => mod.PhaserGame), { ssr: false });

export default function Game() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [matchDTO, setmatchDTO] = useState<IMatchStats | null>(null);
    const [gameLoaded, setGameLoaded] = useState(false);
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    async function fetchMatchStats() {
        const data: IMatchStats = {
            player: {
                name: user?.name || 'Jogador Desconhecido',
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

      try {
        if (!user?.id) {
          throw new Error('ID do usuário não encontrado');
        }

        if (!data.pointsGained && data.pointsGained !== 0) {
          throw new Error('Pontuação não encontrada nos dados');
        }

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token JWT não encontrado');
        }

        const response = await fetch(
          `http://localhost:3001/user/${user.id}/best-run`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              best_run: data.pointsGained,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Pontuação enviada com sucesso:', result);

        return result;
      } catch (error) {
        console.error('Erro ao enviar pontuação para o backend:', error);
        throw error;
      }
    }


    async function handleMainMenu() {
        router.push('/mainMenu')
    }

    useEffect(() => { fetchMatchStats()}, []);

  return (
    <div className={styles.GameContainer}>
        {
            !isAuthenticated ? (
                <div className={styles.Buttons}>
                    <h2>Parece que você não está logado</h2>
                    <h2>Inicie sessão ou cadastre-se</h2>
                    <button onClick={ () => router.push('/mainMenu') }>Voltar ao menu principal</button>
                </div>
            ) : (
                <div>
                    {!gameLoaded && (<div className={styles.GamePlaceholder} />)}
                    {matchDTO && (
                        <div className={styles.Game}>
                            <PhaserGame ref={phaserRef} backendTransfer={(data: Partial<IMatchStats>) => handleBackendTransfer(data)} mainMenu={() => handleMainMenu()} matchDTO={matchDTO} onLoad={() => setGameLoaded(true)} />
                            <GameKeybinds />
                        </div>
                    )}
                </div>
            )
        }
    </div>
  );
}
