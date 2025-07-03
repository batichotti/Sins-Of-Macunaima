import styles from '@/styles/layout.module.css';
import { AuthProvider } from './_context/_authContext';
import Header from './_components/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br" className={styles.html}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body className={styles.body}>
                <AuthProvider>
                    <Header />
                    <main className={styles.main}>
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
