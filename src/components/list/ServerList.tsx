import { FunctionComponent } from 'react'
import { ServerListItem } from '@/components/list/ServerListItem'
import { getServers, searchServers } from '@/data/server'

interface ServerListProps {
    promoted: boolean
    page: number
    tags?: string[]
}

export const ServerList: FunctionComponent<ServerListProps> = async ({
    promoted,
    page,
    tags,
}) => {
    const data = await getData(promoted, page, tags)

    if (data.length === 0)
        if (promoted)
            return (
                <div
                    className={`border-semi-border bg-semi-promoted mt-4 flex min-h-fit items-center justify-center rounded border px-8 py-3 text-center text-2xl`}>
                    Chcesz zareklamować swój serwer? <br /> Wykup promowanie za
                    jedyne 50gr za dzień!
                </div>
            )
        else
            return (
                <div
                    className={`border-semi-border bg-semi-bg mt-4 flex min-h-fit items-center justify-center rounded border px-8 py-7 text-center text-2xl`}>
                    Aż tyle serwerów jeszcze nie mamy :(
                </div>
            )

    return (
        <div className={'mt-4 flex flex-col gap-2'}>
            {data
                .filter(server => server.ServerData)
                .map(server => (
                    <ServerListItem
                        key={server.ServerData?.id}
                        server={server}
                    />
                ))}
        </div>
    )
}

export const getData = async (
    promoted: boolean,
    page: number,
    tags?: string[]
) => {
    if (tags && tags.length > 0) {
        return searchServers({ query: '', tags, page, promoted })
    }
    return getServers({
        skip: 20 * (page - 1),
        take: 20 * page,
        orderBy: 'votes',
        sortOrder: 'desc',
        promoted,
    })
}
