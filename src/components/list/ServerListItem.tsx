import { FunctionComponent } from 'react'
import Image from 'next/image'
import { list } from 'postcss'
import { Heart, PackageOpen, Users } from 'lucide-react'
import { StatusIndicator } from '@/components/list/StatusIndicator'
import Link from 'next/link'
import ImgFallback from '@/components/shared/ImgFallback'

interface ServerListItemProps {
    id: string
    address: string
    img: string
    motd: [string, string]
    players: [number, number]
    version: string
    votes: number
    promoted: boolean
    online: boolean
}

export type { ServerListItemProps }

// TODO: dodać link
export const ServerListItem: FunctionComponent<ServerListItemProps> = ({
    id,
    address,
    motd,
    players,
    version,
    img,
    votes,
    promoted,
    online,
}) => {
    return (
        <Link href={`/s/${id}-${address.replaceAll('.', '_')}`}>
            <article
                className={`grid w-full grid-cols-1 gap-4 rounded border border-semi-border px-3 py-3 text-xl md:grid-cols-12 md:px-4 ${
                    promoted ? 'bg-semi-promoted' : 'bg-semi-bg'
                }`}>
                <div className={'col-span-1 flex items-center gap-4'}>
                    <ImgFallback
                        src={img}
                        fallback={'/assets/listamc-64x64.png'}
                        alt={''}
                        className={'h-8 w-8 rounded lg:h-16 lg:w-16'}
                    />
                    <span className={'inline md:hidden'}>{address}</span>
                </div>
                <div className={'col-span-7 flex flex-col'}>
                    <span className={'hidden md:inline'}>{address}</span>
                    <span className={'truncate'}>{motd.join(' ')}</span>
                </div>
                <div
                    className={
                        'col-span-2 flex items-center gap-2 md:justify-end'
                    }>
                    <span>{votes}</span>
                    <Heart size={20} />
                </div>
                <div
                    className={
                        'col-span-2 flex flex-row items-end justify-center gap-4 md:flex-col md:gap-0'
                    }>
                    <div className={'flex items-center gap-2'}>
                        <span>{version}</span>
                        <StatusIndicator status={online} />
                    </div>
                    <div className={'flex items-center gap-2'}>
                        <span>
                            {players[0]}/{players[1]}
                        </span>
                        <Users size={20} />
                    </div>
                </div>
            </article>
        </Link>
    )
}
