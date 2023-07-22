import { FunctionComponent } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export const Footer: FunctionComponent = () => {
    return (
        <footer
            className={
                'flex flex-col gap-8 justify-center items-center pb-4 mt-16 relative bottom-0 flex-wrap md:flex-nowrap'
            }>
            <Image
                src={'/assets/listamc-64x64.png'}
                alt={'ListaMC'}
                width={64}
                height={64}
            />
            <div className={'flex flex-col md:flex-row text-center md:text-left gap-4 md:gap-12 text-sm'}>
                <Link href={'/terms'}>Dokumenty</Link>
                <Link href={'/stats'}>Statystyki</Link>
                <Link href={'/promo'}>Materiały promocyjne</Link>
                <Link href={'/faq'}>FAQ</Link>
                <Link href={'/contact'}>Kontakt</Link>
            </div>
            <span>&copy; ListaMC.pl {new Date().getFullYear()}</span>
        </footer>
    )
}
