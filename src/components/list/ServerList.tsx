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

    if (data.length === 0)
        if (promoted)
            return (
                <div
                    className={`px-8 py-3  min-h-fit flex justify-center items-center text-center border border-semi-border rounded text-2xl bg-semi-promoted`}>
                    Chcesz zareklamować swój serwer? <br /> Wykup promowanie za
                    jedyne 50gr za dzień!
                </div>
            )
        else
            return (
                <div
                    className={`px-8 py-7  min-h-fit flex justify-center items-center text-center border border-semi-border rounded text-2xl bg-semi-bg`}>
                    Aż tyle serwerów jeszcze nie mamy :(
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
