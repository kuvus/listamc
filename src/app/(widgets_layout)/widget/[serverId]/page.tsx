import { StatusIndicator } from '@/components/list/StatusIndicator'
import { Users } from 'lucide-react'

export default async function Widget({ params: { serverId }, searchParams }) {
    const data = await getData(serverId)

    if (data.error)
        return <div>Wystąpił błąd podczas pobierania informacji.</div>

    console.log('SP: ', searchParams)

    return (
        <div
            className={`flex h-full w-full flex-row justify-between gap-4 p-2  text-[#ffffff]`}>
            <img src={data.ServerData.icon} alt='' />
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

const getData = async (id: string) => {
    const res = await fetch(`${process.env.API_URL}/servers/${id}`, {
        next: { revalidate: 30 },
    })

    if (!res.ok) {
        return { error: true }
    }

    return res.json()
}
