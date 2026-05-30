import type { Metadata } from 'next'
import { Bebas_Neue, Exo_2, Rajdhani } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo',
  display: 'swap',
})

const rajdhani = Rajdhani({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rustep Dashboard',
  description: 'Panel de administracion de Rustep - App fitness + videojuego',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${exo2.variable} ${rajdhani.variable}`}>
      <body className="bg-[#0A0A12] font-exo text-white antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
