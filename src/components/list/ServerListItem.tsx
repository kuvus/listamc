import { LuHeart, LuUsers } from 'react-icons/lu'
import { StatusIndicator } from '@/components/list/StatusIndicator'
import Link from 'next/link'
import ImgFallback from '@/components/shared/ImgFallback'
import { Server } from '@/models/Server'

interface ServerListItemProps {
    server: Server
}

export const ServerListItem = ({ server }: ServerListItemProps) => {
    return (
        <Link
            href={`/s/${server.ServerData?.server_id}-${server.address.replaceAll('.', '_')}`}>
            <article
                className={`border-semi-border grid w-full grid-cols-1 gap-4 rounded-md border px-3 py-3 text-xl md:grid-cols-12 md:px-4 ${
                    server.Promotion
                        ? 'hover:bg-semi-promoted-hover bg-semi-promoted'
                        : 'hover:bg-semi-bg-hover bg-semi-bg'
                }`}>
                <div className={'col-span-1 flex items-center gap-4'}>
                    <ImgFallback
                        src={server.ServerData?.icon}
                        fallback={'/assets/listamc-64x64.png'}
                        alt={''}
                        className={'h-8 w-8 rounded lg:h-16 lg:w-16'}
                    />
                    <span className={'inline md:hidden'}>{server.address}</span>
                </div>
                <div className={'col-span-7 flex flex-col'}>
                    <span className={'hidden md:inline'}>{server.address}</span>
                    <span className={'truncate'}>
                        {server.ServerData?.motd_text.split('\\n').join(' ')}
                    </span>
                </div>
                <div
                    className={
                        'col-span-2 flex items-center gap-2 md:justify-end'
                    }>
                    <span>{server._count.Vote}</span>
                    <LuHeart size={20} />
                </div>
                <div
                    className={
                        'col-span-2 flex flex-row items-end justify-center gap-4 md:flex-col md:gap-0'
                    }>
                    <div className={'flex items-center gap-2'}>
                        <span>{server.ServerData?.version}</span>
                        <StatusIndicator
                            status={server.ServerData?.online ?? false}
                        />
                    </div>
                    <div className={'flex items-center gap-2'}>
                        <span>
                            {server.ServerData?.players_online}/
                            {server.ServerData?.players_max}
                        </span>
                        <LuUsers size={20} />
                    </div>
                </div>
            </article>
        </Link>
    )
}
