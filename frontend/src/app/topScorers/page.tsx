'use client';
import styles from '@/styles/TopScorers.module.css';

interface ScorerProps {
    playerName: string,
    playerScore: number
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

function Scorer(props: ScorerProps) {
    return (
        <div className={styles.Scorer}>
            <p className={styles.PlayerName}>{ellipseString(props.playerName)}</p>
            <p className={styles.PlayerScore}>{props.playerScore}</p>
        </div>
    );
}

function fetchTopScorers(): ScorerProps[] {
    return [
        { playerName: 'Seu Cachorro', playerScore: 10 },
        { playerName: 'Sua mãe', playerScore: 1000 },
        { playerName: 'Seu pai', playerScore: 2000 },
    ];
}

export default function topScorers() {
    return (
        <div className={styles.TopScorersContainer}>
            <div className={styles.Header}>
                <h1>Top Scorers</h1>
                <h2>As maiores pontuações dos jogadores.</h2>
            </div>
            <div className={styles.ScorersList}>
                <ScorersListHeader/>
                {
                    fetchTopScorers().map(
                        (it) => {
                            return <Scorer key={it.playerName} playerName={it.playerName} playerScore={it.playerScore}/>
                        }
                    )
                }
            </div>
            <button
                onClick={
                    async () => {
                        try {
                            const response = await fetch('http://localhost:3001/user/top');
                            const data = await response.text();
                            alert(data);
                        } catch (error) {
                            alert('Erro ao buscar top scorers! ' + error);
                        }
                    }
                }
            >Top Scorers</button>
        </div>
    );
}