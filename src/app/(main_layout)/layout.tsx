import type { Metadata } from 'next'
import { NextAuthProvider } from '@/app/providers'

import '../global.css'

import { Nunito } from 'next/font/google'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

const nunito = Nunito({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
    weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_PAGE_NAME,
    description: process.env.NEXT_PUBLIC_PAGE_DESCRIPTION,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='pl'>
            <body
                className={`${nunito.variable} ${nunito.className} bg-gradient-radial from-bg-800 to-bg-900 bg-fixed text-text`}>
                <NextAuthProvider>
                    <Navbar />
                    <main className={'min-h-[40vh]'}>{children}</main>
                    <Footer />
                </NextAuthProvider>
            </body>
        </html>
    )
}
