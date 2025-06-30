'use client';

import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });
const ScreenRotation = dynamic(() => import('@/game/core/ScreenRotation'), { ssr: false });
const MainMenu       = dynamic(() => import('./mainMenu/page'),       { ssr: false });

export default function Page() {
  return (
    <main className={inter.className}>
      <ScreenRotation />
      <MainMenu />
    </main>
  );
}
