import { notFound, redirect } from 'next/navigation'
import type { ComponentProps } from 'react'
import { Box, Heart, Users } from 'lucide-react'
import ImgFallback from '@/components/shared/ImgFallback'
import { Button } from '@/components/shared/Button'
import { Modal } from '@/components/shared/Modal'

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

        return (
            <div
                className={
                    'flex flex-col gap-4 container mx-auto xl:max-w-7xl mt-16'
                }>
                <Card className={'justify-between items-center gap-4'}>
                    <div className={'flex flex-col'}>
                        <span className={'text-lg font-semibold'}>
                            {data?.address}
                        </span>
                        <span className={'text-lg break-all'}>
                            {data.ServerData?.motd_text}
                        </span>
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
                <div className={'flex flex-row gap-4 flex-wrap lg:flex-nowrap'}>
                    <div className={'flex flex-col gap-4 w-full'}>
                        <div className={'flex flex-row gap-4 columns-3'}>
                            <Card className={'justify-between items-center'}>
                                <div className={'flex flex-col'}>
                                    <span>Liczba graczy</span>
                                    <span
                                        className={
                                            'text-4xl mt-1 font-semibold'
                                        }>
                                        {data.ServerData?.players_online}/
                                        {data.ServerData?.players_max}
                                    </span>
                                </div>
                                <Users size={64} />
                            </Card>
                            <Card className={'justify-between items-center'}>
                                <div className={'flex flex-col'}>
                                    <span>Wersja</span>
                                    <span
                                        className={
                                            'text-4xl mt-1 font-semibold'
                                        }>
                                        {data.ServerData?.version}
                                    </span>
                                </div>
                                <Box size={64} />
                            </Card>
                            <Card className={'justify-between items-center'}>
                                <div className={'flex flex-col'}>
                                    <span>Głosy</span>
                                    <span
                                        className={
                                            'text-4xl mt-1 font-semibold'
                                        }>
                                        {data._count?.Vote}
                                    </span>
                                </div>
                                <Heart size={64} />
                            </Card>
                        </div>
                        <Card className={'flex-col h-full justify-between'}>
                            <div
                                className={
                                    'border-b w-full border-b-semi-border pb-3 mb-3'
                                }>
                                <span className={'text-xl'}>Opis serwera</span>
                            </div>
                            <div
                                className={
                                    'border-b w-full border-b-semi-border pb-3 mb-3'
                                }>
                                <span className={'text-xl'}>
                                    Przydatne linki
                                </span>
                            </div>
                        </Card>
                    </div>
                    <Card
                        className={
                            'w-full lg:w-1/3 flex-col items-center justify-center text-center gap-3 h-full py-8'
                        }>
                        <span className={'text-2xl font-bold'}>
                            Oddaj głos na serwer
                        </span>
                        <span>
                            Każdy oddany głos podnosi pozycję serwera na liście.
                        </span>
                        <Button
                            type={'primary'}
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
                    className={'bg-semi-promoted justify-between items-center'}>
                    <span className={'text-xl font-semibold'}>
                        Wykup promowanie tego serwera za jedyne 50gr za dzień!
                    </span>
                    <Modal
                        buttonType={'primary'}
                        buttonText={'Wykup promowanie!'}>
                        Test
                    </Modal>
                </Card>
                <div className={'flex flex-row gap-4 flex-wrap lg:flex-nowrap'}>
                    <Card>Statystyki</Card>
                    <div className={'flex flex-col gap-4 w-full lg:w-1/3'}>
                        <Card className={'gap-6 flex-col text-center py-10'}>
                            <span className={'text-xl'}>
                                Jesteś właścicielem tego serwera?
                            </span>
                            <Modal
                                buttonType={'outline'}
                                buttonText={'Przypisz serwer do konta'}>
                                Test
                            </Modal>
                        </Card>
                        <Card className={'gap-6 flex-col text-center py-10'}>
                            <span className={'text-xl'}>
                                Dodaj widget ListaMC.pl na swoją stronę
                                internetową!
                            </span>
                            {/*<Button*/}
                            {/*    type={'outline'}*/}
                            {/*    element={'a'}*/}
                            {/*    href={`/s/${serverId}/widgets`}>*/}
                            {/*    Przeglądaj widgety*/}
                            {/*</Button>*/}
                            <Modal
                                buttonType={'outline'}
                                buttonText={'Przeglądaj widgety'}>
                                Test
                            </Modal>
                        </Card>
                    </div>
                </div>
            </div>
        )
    } catch (e) {
        console.log(e)
        notFound()
    }
}

interface CardProps extends ComponentProps<'div'> {
    className?: string
}

const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <div
            className={`rounded bg-semi-bg border border-semi-border px-6 py-4 w-full flex ${
                className || ''
            }`}
            {...props}>
            {children}
        </div>
    )
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
