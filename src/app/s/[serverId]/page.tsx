import { notFound, redirect } from 'next/navigation'
import type { ComponentProps } from 'react'
import { Box, Heart, Users } from 'lucide-react'
import ImgFallback from '@/components/shared/ImgFallback'
import { Button } from '@/components/shared/Button'
import { Modal } from '@/components/shared/Modal'
import Card from '@/components/shared/Card'

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

        const motd: string[] = data.ServerData?.motd_text.split('\\n') || [
            data.address || '',
            '',
        ]

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
                            <div
                                className={
                                    'mb-3 w-full border-b border-b-semi-border pb-3'
                                }>
                                <span className={'text-xl'}>Opis serwera</span>
                            </div>
                            <div
                                className={
                                    'mb-3 w-full border-b border-b-semi-border pb-3'
                                }>
                                <span className={'text-xl'}>
                                    Przydatne linki
                                </span>
                            </div>
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
                            element={'button'}
                            className={'my-5'}>
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
                    <Modal
                        title={'Promowanie'}
                        buttonType={'primary'}
                        buttonText={'Wykup promowanie!'}>
                        Test
                    </Modal>
                </Card>
                <div className={'flex flex-row flex-wrap gap-4 lg:flex-nowrap'}>
                    <Card>Statystyki</Card>
                    <div className={'flex w-full flex-col gap-4 lg:w-1/3'}>
                        <Card className={'flex-col gap-6 py-10 text-center'}>
                            <span className={'text-xl'}>
                                Jesteś właścicielem tego serwera?
                            </span>
                            <Modal
                                title={'Przypisanie serwera do konta'}
                                buttonType={'outline'}
                                buttonText={'Przypisz serwer do konta'}>
                                <div className='relative flex w-full'>
                                    <input
                                        type='radio'
                                        id='option0'
                                        name='tabs'
                                        className='appearance-none'
                                    />
                                    <label
                                        htmlFor='option0'
                                        className='flex w-1/6 cursor-pointer select-none items-center justify-center truncate rounded-full py-2 text-lg font-semibold uppercase'>
                                        OPTION 0
                                    </label>

                                    <input
                                        type='radio'
                                        id='option1'
                                        name='tabs'
                                        className='appearance-none'
                                    />
                                    <label
                                        htmlFor='option1'
                                        className='flex w-1/6 cursor-pointer select-none items-center justify-center truncate rounded-full py-2 text-lg font-semibold uppercase'>
                                        OPTION 1
                                    </label>

                                    <input
                                        type='radio'
                                        id='option2'
                                        name='tabs'
                                        className='appearance-none'
                                    />
                                    <label
                                        htmlFor='option2'
                                        className='flex w-1/6 cursor-pointer select-none items-center justify-center truncate rounded-full py-2 text-lg font-semibold uppercase'>
                                        OPTION 2
                                    </label>

                                    <input
                                        type='radio'
                                        id='option3'
                                        name='tabs'
                                        className='appearance-none'
                                    />
                                    <label
                                        htmlFor='option3'
                                        className='flex w-1/6 cursor-pointer select-none items-center justify-center truncate rounded-full py-2 text-lg font-semibold uppercase'>
                                        OPTION 3
                                    </label>

                                    <input
                                        type='radio'
                                        id='option4'
                                        name='tabs'
                                        className='appearance-none'
                                    />
                                    <label
                                        htmlFor='option4'
                                        className='flex w-1/6 cursor-pointer select-none items-center justify-center truncate rounded-full py-2 text-lg font-semibold uppercase'>
                                        OPTION 4
                                    </label>

                                    <div className='tabAnim absolute flex h-full w-1/6 transform select-none items-center justify-center truncate rounded-full bg-indigo-600 p-0 text-lg font-semibold uppercase transition-transform'></div>
                                </div>
                            </Modal>
                        </Card>
                        <Card className={'flex-col gap-6 py-10 text-center'}>
                            <span className={'text-xl'}>
                                Dodaj widget ListaMC.pl na swoją stronę
                                internetową!
                            </span>
                            <Modal
                                title={'Widgety'}
                                buttonType={'outline'}
                                buttonText={'Przeglądaj widgety'}>
                                Test
                            </Modal>
                        </Card>
                    </div>
                </div>
            </section>
        )
    } catch (e) {
        console.log(e)
        notFound()
    }
}

const getData = async (id: string) => {
    const res = await fetch(`${process.env.API_URL}/server/${id}`, {
        next: { revalidate: 10 },
    })
    // TODO: zmień revalidate na większe (teraz 10s)

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}
