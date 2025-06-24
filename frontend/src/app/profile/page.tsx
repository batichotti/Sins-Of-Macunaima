'use client';
import styles from '@/styles/Profile.module.css';

export default function Profile() {
    return (
        <div className={styles.ProfileContainer}>
            <div className={styles.PlayerInfo}>
                <h2>Estatísticas</h2>
                <p>Maior Pontuação: </p>
                <p>Partidas jogadas: </p>
                <p>Maior nível alcançado: </p>
                <p>Personagens desbloqueados: </p>
                <p>Personagem favorito: </p>
            </div>
            <div className={styles.AccountInfo}>
                <h2>Informações da conta</h2>
                <p>Jogador: </p>
                <p>Email: </p>
            </div>
        </div>
    );
}