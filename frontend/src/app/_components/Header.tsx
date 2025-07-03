'use client';
import styles from '@/styles/layout.module.css';
import Link from 'next/link';
import { useAuth } from '../_context/_authContext';
import { AuthModal } from '../_lib/_auth';

export default function Header() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.titleContainer}>
                <h1>Sins of Macunaíma</h1>
            </div>
            
            <div className={styles.leftSection}>
                <Link className={styles.link} href="/">Menu Principal</Link>
            </div>

            <div className={styles.rightSection}>
                {isLoading ? (
                    <div>Carregando...</div>
                ) : !isAuthenticated ? (
                    <div className={styles.headerAuth}>
                        <AuthModal isHeader={true} />
                    </div>
                ) : (
                    <div className={styles.headerUserInfo}>
                        <span>Olá, {user?.name || 'Usuário'}!</span>
                        <button className={styles.logoutButton} onClick={logout}>Sair</button>
                    </div>
                )}
            </div>
        </header>
    );
}
