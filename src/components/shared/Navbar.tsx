import Image from 'next/image'
import { Button } from '@/components/shared/Button'
import { FunctionComponent } from 'react'

const Pages = [
    {
        key: 'home',
        text: 'Strona Główna',
        href: '/',
    },
    {
        key: 'home',
        text: 'Wyszukiwarka',
        href: '/search',
    },
    {
        key: 'home',
        text: 'Konto',
        href: '/account',
    },
]

export const Navbar: FunctionComponent = () => {
    return (
        <div className={'sticky top-0 backdrop-blur-md'}>
            <nav
                className={
                    'flex flex-wrap justify-between items-center max-w-7xl mx-auto gap-8 sm:gap-4 lg:gap-12 py-3'
                }>
                <Image
                    src={'/assets/listamc-64x64.png'}
                    alt={'ListaMC'}
                    width={64}
                    height={64}
                />
                <ul
                    className={
                        'list-none gap-8 hidden font-semibold text-text md:flex'
                    }>
                    {Pages.map(page => {
                        return (
                            <li key={page.key}>
                                <a href={page.href}>{page.text}</a>
                            </li>
                        )
                    })}
                </ul>
                <Button
                    type={'outline'}
                    size={''}
                    href={''}
                    element={'a'}
                    className={'hidden md:inline-block'}>
                    Dodaj swój serwer
                </Button>
            </nav>
        </div>
    )
}
