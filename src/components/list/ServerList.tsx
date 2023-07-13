import { FunctionComponent } from 'react'
import { ServerListItem } from '@/components/list/ServerListItem'
import type { ServerListItemProps as Server } from '@/components/list/ServerListItem'
import { TagList } from '@/components/list/TagList'

interface ServerListProps {
    promoted: boolean
    page: number
}

export const ServerList: FunctionComponent<ServerListProps> = async ({
    promoted,
    page,
}) => {
    const data = await getData(promoted, page)

    if (promoted && data.length === 0)
        return (
            <div
                className={`px-8 py-3 flex justify-between border border-semi-border rounded text-xl hover:cursor-pointer ${
                    promoted ? 'bg-semi-promoted' : 'bg-semi-bg'
                }`}>
                Chcesz zareklamować swój serwer? Wykup promowanie za jedyne 80gr
                za dzień!
            </div>
        )

    return (
        <div className={'mt-4 flex flex-col gap-2'}>
            {data.map(server => (
                <ServerListItem
                    key={server.ServerData.server_id}
                    id={server.ServerData.server_id}
                    address={server.address}
                    img={server.ServerData.icon}
                    motd={server.ServerData.motd_text.split('\\n')}
                    players={[
                        server.ServerData.players_online,
                        server.ServerData.players_max,
                    ]}
                    version={server.ServerData.version}
                    votes={server._count.Vote}
                    promoted={promoted}
                    online={server.ServerData.online}
                />
            ))}
        </div>
    )
}

const getData = async (promoted: boolean, page: number) => {
    const res = await fetch(
        `${process.env.API_URL}/servers/${20 * (page - 1)}-${
            20 * page
        }/votes/desc/${promoted}`,
        { next: { revalidate: 10 } }
    )
    // TODO: zmień revalidate na większe (teraz 10s)

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}
