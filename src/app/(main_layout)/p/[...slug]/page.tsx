import { notFound, redirect } from 'next/navigation'
import { ServerList } from '@/components/list/ServerList'
import { Pagination } from '@/components/list/Pagination'

export default async function Page(props) {
    const params = await props.params;

    const {
        slug
    } = params;

    if (isNaN(slug[0])) redirect('/')

    try {
        const numericPage = parseInt(slug[0])

        return (
            <>
                <div className={'container xl:max-w-7xl mt-24'}>
                    <ServerList page={numericPage} promoted={false} />
                </div>
                <Pagination current={numericPage} />
            </>
        )
    } catch (e) {
        notFound()
    }
}
