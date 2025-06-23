import styles from '@/styles/layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br" className={styles.html}>
            <head className={styles.head}>
                <title>Sins of Macunaíma</title>
                <meta name="description" content="Roguelike puramente brasileiro." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </head>
            <body>
                <header>
                    <h1>Sins of Macunaíma</h1>
                </header>
                {children}
            </body>
        </html>
    );
}