import { ServerList } from '@/components/list/ServerList'
import { TagList } from '@/components/list/TagList'
import { Pagination } from '@/components/list/Pagination'
import { LuChevronsRight } from 'react-icons/lu'

export default function Home() {
    return (
        <>
            <div className={'container xl:max-w-7xl'}>
                <div className={'mt-16 flex flex-wrap justify-between'}>
                    <h1 className={'text-xl font-semibold'}>
                        Serwery promowane
                    </h1>
                    <a
                        href='#'
                        className={
                            'flex items-center gap-1 underline-offset-2 hover:underline'
                        }>
                        Dowiedz się więcej <LuChevronsRight size={16} />
                    </a>
                </div>
                <ServerList page={1} promoted={true} />
                <TagList />
                <ServerList page={1} promoted={false} />
            </div>
            <Pagination current={1} />
        </>
    )
}
