import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FunctionComponent } from 'react'
import Link from 'next/link'

const Pages = [
    {
        key: 'home',
        text: 'Strona Główna',
        href: '/',
    },
    {
        key: 'search',
        text: 'Wyszukiwarka',
        href: '/search',
    },
    {
        key: 'account',
        text: 'Konto',
        href: '/account',
    },
]

export const Navbar: FunctionComponent = () => {
    return (
        <div className={'sticky top-0 backdrop-blur-md'}>
            <nav
                className={
                    'container flex max-w-7xl flex-wrap items-center justify-between gap-8 py-3 sm:gap-4 lg:gap-12'
                }>
                <Link href={'/'}>
                    <Image
                        src={'/assets/listamc-64x64.png'}
                        alt={'ListaMC'}
                        width={64}
                        height={64}
                    />
                </Link>
                <ul
                    className={
                        'text-text hidden list-none gap-8 font-semibold md:flex'
                    }>
                    {Pages.map(page => {
                        return (
                            <li key={page.key}>
                                <Link href={page.href}>{page.text}</Link>
                            </li>
                        )
                    })}
                </ul>
                <Button variant={'outline'} size={'lg'} asChild>
                    <Link href={'/add'}>Dodaj swój serwer</Link>
                </Button>
            </nav>
        </div>
    )
}
