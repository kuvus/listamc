import { notFound, redirect } from 'next/navigation'
import { Box, Heart, Users } from 'lucide-react'
import ImgFallback from '@/components/shared/ImgFallback'
import { Button } from '@/components/shared/Button'
import Card from '@/components/shared/Card'
import { PromoteModal } from '@/components/server/PromoteModal'
import { WidgetsModal } from '@/components/server/WidgetsModal'
import { VoteModal } from '@/components/server/VoteModal'
import jwt from '@/components/shared/Jwt'
import Link from 'next/link'

interface Data {
    id?: number
    address?: string
    ServerData?: {
        id: string
        server_id: number
        players_online: number
        players_max: number
        version: string
        motd: string
        motd_text: string
        icon: string
    } | null
    Promotion?: {
        id: string
        server_id: number
        date_start: string
        date_end: string
    } | null
    ServerMetadata?: {
        id: string
        server_id: number
        description: string
        gamemodes: any
        urls: any
    } | null
    _count?: {
        Vote: number
    }
}

export default async function Server({ params: { serverId } }) {
    // check if serverId starts with a number
    if (isNaN(serverId.split('-')[0])) redirect('/')

    const serverIdUrl = serverId.split('-')[0]

    try {
        const data: Data = await getData(serverIdUrl)

        if (!data.id) notFound()

        const motd: string[] = data.ServerData?.motd_text.split('\\n') || [
            data.address || '',
            '',
        ]

        const voteToken = jwt({ serverId: data.id, type: 'vote' })

        return (
            <section
                className={'container mt-16 flex flex-col gap-4 xl:max-w-7xl'}>
                <h1 className={'text-3xl font-semibold'}>{data.address}</h1>
                <Card className={'items-center justify-between gap-4'}>
                    <div className={'flex flex-col'}>
                        <span className={'text-lg font-semibold'}>
                            {motd[0]}
                        </span>
                        <span className={'break-all text-lg'}>{motd[1]}</span>
                    </div>
                    <ImgFallback
                        src={data.ServerData?.icon}
                        fallback={'/assets/listamc-64x64.png'}
                        alt={''}
                        className={'rounded'}
                        width={64}
                        height={64}
                    />
                </Card>
                <div className={'flex flex-row flex-wrap gap-4 lg:flex-nowrap'}>
                    <div className={'flex w-full flex-col gap-4'}>
                        <div
                            className={
                                'hidden columns-3 flex-row gap-4 md:flex'
                            }>
                            <Card className={'items-center justify-between'}>
                                <div className={'flex flex-col'}>
                                    <span>Liczba graczy</span>
                                    <span
                                        className={
                                            'mt-1 text-4xl font-semibold'
                                        }>
                                        {data.ServerData?.players_online}/
                                        {data.ServerData?.players_max}
                                    </span>
                                </div>
                                <Users size={64} />
                            </Card>
                            <Card className={'items-center justify-between'}>
                                <div className={'flex flex-col'}>
                                    <span>Wersja</span>
                                    <span
                                        className={
                                            'mt-1 text-4xl font-semibold'
                                        }>
                                        {data.ServerData?.version}
                                    </span>
                                </div>
                                <Box size={64} />
                            </Card>
                            <Card className={'items-center justify-between'}>
                                <div className={'flex flex-col'}>
                                    <span>Głosy</span>
                                    <span
                                        className={
                                            'mt-1 text-4xl font-semibold'
                                        }>
                                        {data._count?.Vote}
                                    </span>
                                </div>
                                <Heart size={64} />
                            </Card>
                        </div>
                        <Card
                            className={
                                'h-full flex-col justify-between gap-2 md:hidden'
                            }>
                            <div className={'flex flex-row justify-between'}>
                                <div className={'flex items-center gap-2'}>
                                    <Users size={16} /> Liczba graczy
                                </div>
                                <span>
                                    {data.ServerData?.players_online}/
                                    {data.ServerData?.players_max}
                                </span>
                            </div>
                            <div className={'flex flex-row justify-between'}>
                                <div className={'flex items-center gap-2'}>
                                    <Box size={16} /> Wersja
                                </div>
                                <span>{data.ServerData?.version}</span>
                            </div>
                            <div className={'flex flex-row justify-between'}>
                                <div className={'flex items-center gap-2'}>
                                    <Heart size={16} /> Głosy
                                </div>
                                <span>{data._count?.Vote}</span>
                            </div>
                        </Card>
                        <Card className={'h-full flex-col justify-between'}>
                            {data.ServerMetadata?.description && (
                                <div
                                    className={`${
                                        data.ServerMetadata?.urls?.length > 0 &&
                                        'border-b border-b-semi-border'
                                    } mb-3 w-full pb-3`}>
                                    <span className={'text-xl'}>
                                        Opis serwera
                                    </span>
                                </div>
                            )}
                            {data.ServerMetadata?.urls?.length > 0 && (
                                <div className={'mb-3 w-full pb-3'}>
                                    <span className={'text-xl'}>
                                        Przydatne linki
                                    </span>
                                    {data.ServerMetadata?.urls.map(
                                        (url: {
                                            type: string
                                            value: string
                                        }) => (
                                            <Link
                                                href={url.value}
                                                key={url.type}>
                                                {url.type}
                                            </Link>
                                        )
                                    )}
                                </div>
                            )}
                        </Card>
                    </div>
                    <Card
                        className={
                            'h-full w-full flex-col items-center justify-center gap-3 py-8 text-center lg:w-1/3'
                        }>
                        <span className={'text-2xl font-bold'}>
                            Oddaj głos na serwer
                        </span>
                        <span>
                            Każdy oddany głos podnosi pozycję serwera na liście.
                        </span>
                        <Button
                            styling={'primary'}
                            element={'a'}
                            href={'?m=vote'}
                            className={'my-5'}
                            scroll={false}>
                            Zagłosuj na serwer
                        </Button>

                        <small className={'text-sm'}>
                            Głos jest ważny przez 14 dni od daty dodania.
                        </small>
                    </Card>
                </div>
                <Card
                    className={
                        'flex flex-wrap items-center justify-center gap-4 bg-semi-promoted text-center md:flex-nowrap md:justify-between md:text-left'
                    }>
                    <span className={'text-xl font-semibold'}>
                        Wykup promowanie tego serwera za jedyne 50gr za dzień!
                    </span>
                    <Button
                        styling={'primary'}
                        element={'a'}
                        href={'?m=promote'}
                        scroll={false}>
                        Wykup promowanie!
                    </Button>
                </Card>
                <div className={'flex flex-row flex-wrap gap-4 lg:flex-nowrap'}>
                    <Card>Statystyki</Card>
                    <div className={'flex w-full flex-col gap-4 lg:w-1/3'}>
                        {/*<Card className={'flex-col gap-6 py-10 text-center'}>*/}
                        {/*    <span className={'text-xl'}>*/}
                        {/*        Jesteś właścicielem tego serwera?*/}
                        {/*    </span>*/}
                        {/*    <Button*/}
                        {/*        styling={'outline'}*/}
                        {/*        element={'a'}*/}
                        {/*        href={'?m=claim'}*/}
                        {/*        scroll={false}>*/}
                        {/*        Przypisz serwer do konta*/}
                        {/*    </Button>*/}
                        {/*</Card>*/}
                        <Card className={'flex-col gap-6 py-10 text-center'}>
                            <span className={'text-xl'}>
                                Dodaj widget ListaMC.pl na swoją stronę
                                internetową!
                            </span>
                            <Button
                                styling={'outline'}
                                element={'a'}
                                href={'?m=widget'}
                                scroll={false}>
                                Przeglądaj widgety
                            </Button>
                        </Card>
                    </div>
                </div>
                <VoteModal token={voteToken} serverId={data.id} />
                <PromoteModal />
                <WidgetsModal serverId={serverIdUrl} />
            </section>
        )
    } catch (e) {
        // console.log(e)
        notFound()
    }
}

const getData = async (id: string) => {
    const res = await fetch(`${process.env.API_URL}/server/${id}`, {
        next: { revalidate: 30 },
    })

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}
