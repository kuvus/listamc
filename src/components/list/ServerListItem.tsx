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
                className={`px-8 py-3 flex justify-between border border-semi-border rounded text-xl hover:cursor-pointer ${
                    promoted ? 'bg-semi-promoted' : 'bg-semi-bg'
                }`}>
                <div className={'flex gap-8'}>
                    <ImgFallback
                        src={img}
                        fallback={'/assets/listamc-64x64.png'}
                        alt={''}
                        className={'rounded'}
                        width={64}
                        height={64}
                    />
                    <div className={'flex flex-col justify-center'}>
                        <span>{motd[0]}</span>
                        <span>{motd[1]}</span>
                    </div>
                </div>
                <div className={'flex gap-2 items-center'}>
                    <span>{votes}</span>
                    <Heart size={20} />
                </div>
                <div className={'flex flex-col items-end justify-center'}>
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
        </Link>
    )
}
