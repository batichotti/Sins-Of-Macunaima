import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sins Of Macunaíma',
    description: 'Um roguelike puramente brasileiro',
    icons: {
        icon: '/favicon.png',
    },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
