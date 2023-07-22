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
            <div
                className={`px-3 md:px-4 py-3 border border-semi-border rounded text-xl hover:cursor-pointer flex flex-col gap-2 ${
                    promoted ? 'bg-semi-promoted' : 'bg-semi-bg'
                }`}>
                <div
                    className={
                        'flex flex-col gap-2 md:gap-4 md:flex-row justify-between flex-wrap'
                    }>
                    <div
                        className={'flex gap-2 md:gap-8 flex-row items-center'}>
                        <ImgFallback
                            src={img}
                            fallback={'/assets/listamc-64x64.png'}
                            alt={''}
                            className={'rounded w-8 h-8 md:w-16 md:h-16'}
                        />
                        <div className={'flex flex-col justify-center'}>
                            <span>{address}</span>
                            <span className={'hidden md:inline'}>
                                {motd.join(' ')}
                            </span>
                        </div>
                    </div>
                    <div
                        className={
                            'flex flex-row flex-wrap gap-4 md:gap-16 md:justify-between'
                        }>
                        <div className={'flex gap-2 items-center'}>
                            <span>{votes}</span>
                            <Heart size={20} />
                        </div>
                        <div
                            className={
                                'flex flex-row gap-4 md:gap-0 md:flex-col items-end justify-center'
                            }>
                            <div className={'flex gap-2 items-center'}>
                                <span>{version}</span>
                                <StatusIndicator status={online} />
                            </div>
                            <div className={'flex gap-2 items-center'}>
                                <span>
                                    {players[0]}/{players[1]}
                                </span>
                                <Users size={20} />
                            </div>
                        </div>
                    </div>
                </div>
                <span className={'md:hidden'}>{motd.join(' ')}</span>
            </div>
        </Link>
    )
}
