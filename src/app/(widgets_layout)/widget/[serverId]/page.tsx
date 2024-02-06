import { StatusIndicator } from '@/components/list/StatusIndicator'
import { Users } from 'lucide-react'
import { getServer } from '@/data/servers/getServer'

export default async function Widget({ params: { serverId }, searchParams }) {
    const data = await getServer(serverId)

    if (!data || !data.ServerData)
        return <div>Wystąpił błąd podczas pobierania informacji.</div>

    return (
        <div
            className={`flex h-full w-full flex-row justify-between gap-4 bg-bg-800 p-2 text-text`}>
            <div className={'flex flex-row items-center gap-4'}>
                <img src={data.ServerData.icon} alt='' />
                <div className={'text-xl font-semibold'}>{data.address}</div>
            </div>
            <div className={'flex flex-col items-end justify-center gap-0'}>
                <div className={'flex items-center gap-2'}>
                    <span>{data.ServerData.version}</span>
                    <StatusIndicator status={data.ServerData.online} />
                </div>
                <div className={'flex items-center gap-2'}>
                    <span>
                        {data.ServerData.players_online}/
                        {data.ServerData.players_max}
                    </span>
                    <Users size={20} />
                </div>
            </div>
        </div>
    )
}
