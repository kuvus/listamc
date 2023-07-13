import type { Metadata } from 'next'
import { NextAuthProvider } from '@/app/providers'

import './global.css'

import { Nunito } from 'next/font/google'

const nunito = Nunito({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
    weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
    title: 'ListaMc.pl',
    description:
        'Lista serwerów Minecraft ListaMc.pl. U nas znajdziesz serwer, który sprosta Twoim wymaganiom!',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='pl'>
            <body
                className={`${nunito.variable} ${nunito.className} bg-gradient-radial from-bg-800 to-bg-900 text-text bg-fixed`}>
                <NextAuthProvider>{children}</NextAuthProvider>
            </body>
        </html>
    )
}
