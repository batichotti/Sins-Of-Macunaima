import Head from "next/head";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const ScreenRotation = dynamic(() => import('@/game/core/ScreenRotation'), { ssr: false });

const MainMenu = dynamic(() => import("@/app/mainMenu/page"), { ssr: false });

export default function Home() {
    return (
        <>
            <Head>
                <title>Sins of Macunaíma</title>
                <meta name="description" content="Roguelike puramente brasileiro." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className={`${inter.className}`}>
                <ScreenRotation />
                <MainMenu />
            </main>
        </>
    );
}
