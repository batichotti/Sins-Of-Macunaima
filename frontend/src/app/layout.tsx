'use client';
import AuthModal from '@/app/_components/_authModal';
import styles from '@/styles/layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br" className={styles.html}>
            <head>
                <title>Sins of Macunaíma</title>
                <meta name="description" content="Roguelike puramente brasileiro." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </head>
            <body className={styles.body}>
                <header className={styles.header}>
                    <div className={styles.titleContainer}>
                        <h1>Sins of Macunaíma</h1>
                    </div>
                    <div className={styles.buttonContainer}>
                        <AuthModal />
                    </div>
                </header>
                <main className={styles.main}>
                    {children}
                </main>
            </body>
        </html>
    );
}