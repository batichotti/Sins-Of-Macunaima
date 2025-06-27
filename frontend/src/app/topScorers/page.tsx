'use client';
import styles from '@/styles/TopScorers.module.css';
import { useEffect, useState } from 'react';

interface playerDTO { 
    id_user: number; 
    name: string; 
    email: string; 
    best_run: number;
}

function ellipseString(str: string, maxChars: number = 30): string {
    return str.length <= maxChars ? str : str.slice(0, maxChars) + '...';
}

function ScorersListHeader() {
    return (
        <div className={styles.ScorersListHeader}>
            <p className={styles.PlayerName}>Jogador</p>
            <p className={styles.PlayerScore}>Pontuação</p>
        </div>
    );
}

function Scorer(props: playerDTO) {
    return props.id_user ? (
        <div className={styles.Scorer}>
            <p className={styles.PlayerName}>{ellipseString(props.name)}</p>
            <p className={styles.PlayerScore}>{props.best_run}</p>
        </div>
    ) : (
        <div />
    );
}

export default function TopScorers() {
    const [topScorersDTO, setTopScorersDTO] = useState<playerDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    async function fetchTopScorers() {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('http://localhost:3001/user/top', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data: playerDTO[] = await response.json();
                setTopScorersDTO(data);
            } else {
                setError(`Erro ao buscar os maiores pontuadores: ${response.statusText}`);
                console.error('Erro ao buscar os maiores pontuadores:', response.statusText);
            }
        } catch (error) {
            const errorMessage = 'Erro ao buscar os maiores pontuadores';
            setError(errorMessage);
            console.error(errorMessage, error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTopScorers();
    }, []);

    if (loading) {
        return (
            <div className={styles.TopScorersContainer}>
                <p>Carregando...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.TopScorersContainer}>
                <p>Erro: {error}</p>
                <button onClick={fetchTopScorers}>Tentar novamente</button>
            </div>
        );
    }

    return (
        <div className={styles.TopScorersContainer}>
            <div className={styles.Header}>
                <h1>Top Scorers</h1>
                <h2>As maiores pontuações dos jogadores.</h2>
            </div>
            <div className={styles.ScorersList}>
                <ScorersListHeader />
                {topScorersDTO.map((player) => (
                    <Scorer 
                        key={player.id_user} 
                        id_user={player.id_user}
                        name={player.name}
                        email={player.email}
                        best_run={player.best_run}
                    />
                ))}
            </div>
        </div>
    );
}