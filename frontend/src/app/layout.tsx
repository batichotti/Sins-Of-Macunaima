import styles from '@/styles/layout.module.css';
import { AuthProvider } from './_context/_authContext';
import Header from './_components/Header';
import '@/styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sins Of Macunaíma',
    description: 'Um roguelike puramente brasileiro',
    icons: {
        icon: '/favicon.png',
    },
};

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
