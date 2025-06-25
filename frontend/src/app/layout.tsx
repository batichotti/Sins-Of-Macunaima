import styles from '@/styles/layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br" className={styles.html}>
            <body className={styles.body}>
                <header className={styles.header}>
                    <div className={styles.titleContainer}>
                        <h1>Sins of Macunaíma</h1>
                    </div>
                </header>
                <main className={styles.main}>
                    {children}
                </main>
            </body>
        </html>
    );
}