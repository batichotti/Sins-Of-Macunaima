'use client';
import styles from '@/styles/MainMenu.module.css';
import { useRouter } from 'next/navigation';

export default function MainMenu() {
    const router = useRouter();

    return (
        <div className={styles.MainMenuContainer}>
            <div className={styles.Buttons}>
                <button onClick={() => router.push('/game')}>Jogar</button>
                <br />
                <button onClick={() => router.push('/profile')}>Perfil</button>
                <br />
                <button onClick={() => router.push('/topScorers')}>Top Scorers</button>
            </div>
        </div>
    );
}