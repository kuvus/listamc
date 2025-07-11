import { notFound, redirect } from 'next/navigation'
import { LuBox, LuHeart, LuUsers } from 'react-icons/lu'
import ImgFallback from '@/components/shared/ImgFallback'
import { Button } from '@/components/ui/button'
import Card from '@/components/shared/Card'
import { PromoteModal } from '@/components/server/PromoteModal'
import { WidgetsModal } from '@/components/server/WidgetsModal'
import { VoteModal } from '@/components/server/VoteModal'
import jwt from '@/lib/jwt'
import { getServer } from '@/data/servers/getServer'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function Server(props) {
    const params = await props.params

    const { serverId } = params

    if (isNaN(serverId.split('-')[0])) redirect('/')

    const serverIdUrl = serverId.split('-')[0]

    try {
        const data = await getData(serverIdUrl)

        if (!data) notFound()

        const motd: string[] = data.ServerData?.motd_text.split('\\n') || [
            data.address || '',
            '',
        ]

        const voteToken = jwt({
            serverId: data.ServerData?.server_id,
            type: 'vote',
        })

        return (
            <section
                className={'container mt-16 flex flex-col gap-6 xl:max-w-7xl'}>
                <h1 className={'text-3xl font-semibold'}>{data.address}</h1>
                <Card className={'items-center justify-between gap-4'}>
                    <div className={'flex flex-col'}>
                        <span className={'text-lg font-semibold'}>
                            {motd[0]}
                        </span>
                        <span className={'text-lg break-all'}>{motd[1]}</span>
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
                                <LuUsers size={64} />
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
                                <LuBox size={64} />
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
                                <LuHeart size={64} />
                            </Card>
                        </div>
                        <Card
                            className={
                                'h-full flex-col justify-between gap-2 md:hidden'
                            }>
                            <div className={'flex flex-row justify-between'}>
                                <div className={'flex items-center gap-2'}>
                                    <LuUsers size={16} /> Liczba graczy
                                </div>
                                <span>
                                    {data.ServerData?.players_online}/
                                    {data.ServerData?.players_max}
                                </span>
                            </div>
                            <div className={'flex flex-row justify-between'}>
                                <div className={'flex items-center gap-2'}>
                                    <LuBox size={16} /> Wersja
                                </div>
                                <span>{data.ServerData?.version}</span>
                            </div>
                            <div className={'flex flex-row justify-between'}>
                                <div className={'flex items-center gap-2'}>
                                    <LuHeart size={16} /> Głosy
                                </div>
                                <span>{data._count?.Vote}</span>
                            </div>
                        </Card>
                        <Card className={'h-full flex-col justify-between'}>
                            <div
                                // className={`${
                                //     data.ServerMetadata?.urls?.length > 0 &&
                                //     'border-b-semi-border border-b'
                                //     } mb-3 w-full pb-3`}
                                className={cn(
                                    'mb-3 w-full pb-3',
                                    data.ServerMetadata?.urls?.toString()
                                        .length &&
                                        'border-b-semi-border border-b'
                                )}>
                                <h3 className={'mb-2 text-xl font-semibold'}>
                                    Opis serwera
                                </h3>
                                {!data.ServerMetadata?.description && (
                                    <p>
                                        Ten serwer nie ma jeszcze opisu. Jeśli
                                        jesteś jego właścicielem, przypisz ten
                                        serwer do swojego konta i dodaj opis.
                                    </p>
                                )}
                                {data.ServerMetadata?.description && (
                                    <p>{data.ServerMetadata?.description}</p>
                                )}
                            </div>

                            {/*
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
                            )} */}
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
                        <Button asChild className={'my-5'} size={'lg'}>
                            <Link href={'?m=vote'}>Zagłosuj na serwer</Link>
                        </Button>

                        <small className={'text-sm'}>
                            Głos jest ważny przez 14 dni od daty dodania.
                        </small>
                    </Card>
                </div>
                <Card
                    className={
                        'bg-semi-promoted flex flex-wrap items-center justify-center gap-4 text-center md:flex-nowrap md:justify-between md:text-left'
                    }>
                    <span className={'text-xl font-semibold'}>
                        Wykup promowanie tego serwera już od 1zł za dzień!
                    </span>
                    <Button asChild className={'my-5'} size={'lg'}>
                        <Link href={'?m=promote'}>Wykup promowanie!</Link>
                    </Button>
                </Card>
                <div className={'flex flex-row flex-wrap gap-4 lg:flex-nowrap'}>
                    <Card className={'flex-col gap-6'}>
                        <h3 className={'text-xl font-semibold'}>Statystyki</h3>
                    </Card>
                    <div className={'flex w-full flex-col gap-4 lg:w-1/3'}>
                        <Card className={'flex-col gap-6 py-10 text-center'}>
                            <span className={'text-xl'}>
                                Jesteś właścicielem tego serwera?
                            </span>
                            <Button variant={'outline'} size={'lg'} asChild>
                                <Link href={'?m=claim'}>
                                    Przypisz serwer do konta
                                </Link>
                            </Button>
                        </Card>
                        <Card className={'flex-col gap-6 py-10 text-center'}>
                            <span className={'text-xl'}>
                                Dodaj widget ListaMC.pl na swoją stronę
                                internetową!
                            </span>
                            <Button asChild className={'my-5'} size={'lg'}>
                                <Link href={'?m=widget'}>
                                    Przeglądaj widgety
                                </Link>
                            </Button>
                        </Card>
                    </div>
                </div>
                <VoteModal
                    token={voteToken}
                    serverId={data.ServerData?.server_id ?? 0}
                />
                <PromoteModal />
                <WidgetsModal serverId={serverIdUrl} />
            </section>
        )
    } catch (e) {
        console.error(e)
        notFound()
    }
}

const getData = async (id: string) => {
    return await getServer(id)
}
