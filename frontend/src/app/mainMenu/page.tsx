'use client';
import styles from '@/styles/MainMenu.module.css';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const AuthModal = dynamic(() => import('../_components/_authModal'), { ssr: false });

export default function MainMenu() {
    const router = useRouter();

    return (
        <div className={styles.MainMenuContainer}>
            <div className={styles.Description}>
                <Image src='/favicon.png' width={100} height={120} alt='Logo do SoM'/>
                <p>
                    Bem-vindo ao Sins of Macunaíma: um roguelike puramente brasileiro.
                    <br />
                    Consiga a maior pontuação enfrentando os inimigos mais icônicos da literatura e folclore brasileiras.
                </p>
            </div>
            <div className={styles.OptionsContainer}>
                <div className={styles.AuthModal}>
                    <AuthModal />
                </div>
                <div className={styles.Buttons}>
                    <button onClick={() => router.push('/game')}>Jogar</button>
                    <br />
                    <button onClick={() => router.push('/profile')}>Perfil</button>
                    <br />
                    <button onClick={() => router.push('/topScorers')}>Top Scorers</button>
                </div>
            </div>
        </div>
    );
}