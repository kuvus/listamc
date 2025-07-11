import { StatusIndicator } from '@/components/list/StatusIndicator'
import { LuUsers } from 'react-icons/lu'
import { getServer } from '@/data/servers/getServer'

export default async function Widget(props) {
    const params = await props.params

    const { serverId } = params

    const data = await getServer(serverId)

    if (!data || !data.ServerData)
        return <div>Wystąpił błąd podczas pobierania informacji.</div>

    return (
        <div
            className={`bg-bg-800 text-text flex h-full w-full flex-row justify-between gap-4 p-2`}>
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
                    <LuUsers size={20} />
                </div>
            </div>
        </div>
    )
}
