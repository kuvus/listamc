import type { Metadata } from 'next'

import '@/app/global.css'

import { Nunito } from 'next/font/google'

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
            <body className={`${nunito.variable} ${nunito.className}`}>
                {children}
            </body>
        </html>
    )
}
