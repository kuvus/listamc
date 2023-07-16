import { notFound, redirect } from 'next/navigation'
import { ServerList } from '@/components/list/ServerList'
import { Pagination } from '@/components/list/Pagination'

export default function Page({ params: { slug } }) {
    if (isNaN(slug[0])) redirect('/')

    try {
        const numericPage = parseInt(slug[0])

        return (
            <>
                <div className={'container mx-auto xl:max-w-7xl mt-24'}>
                    <ServerList page={numericPage} promoted={false} />
                </div>
                <Pagination current={numericPage} />
            </>
        )
    } catch (e) {
        notFound()
    }
}
