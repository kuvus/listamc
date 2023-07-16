import { Button } from '@/components/shared/Button'
import { Navbar } from '@/components/shared/Navbar'
import { ServerList } from '@/components/list/ServerList'
import { ChevronsRight } from 'lucide-react'
import { TagList } from '@/components/list/TagList'
import { Pagination } from '@/components/list/Pagination'
import { Footer } from '@/components/shared/Footer'

export default function Home() {
    return (
        <>
            <div className={'container mx-auto xl:max-w-7xl'}>
                <div className={'flex justify-between mt-16'}>
                    <h1 className={'text-xl font-semibold'}>
                        Serwery promowane
                    </h1>
                    <a href='#' className={'flex gap-1 items-center'}>
                        Dowiedz się więcej <ChevronsRight size={16} />
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
