import styles from '@/styles/layout.module.css';
import { AuthProvider } from './_context/_authContext';
import Header from './_components/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br" className={styles.html}>
            <AuthProvider>
            <body className={styles.body}>
                    <Header />
                    <main className={styles.main}>
                        {children}
                    </main>
                </body>
            </AuthProvider>
        </html>
    );
}
