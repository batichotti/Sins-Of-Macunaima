'use client';
import styles from '@/styles/MainMenu.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AuthModal } from '../_lib/_auth';
import { useAuth } from '../_context/_authContext';

export default function MainMenu() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();

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
                {!isAuthenticated ? (
                    <div className={styles.AuthModal}>
                        <AuthModal />
                    </div>
                ) : (
                    <div className={styles.UserInfo}>
                        <p>Olá, {user?.name}!</p>
                        <button onClick={logout}>Sair</button>
                    </div>
                )}
                
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