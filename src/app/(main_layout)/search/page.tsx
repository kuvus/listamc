import { searchServers } from '@/data/server'
import { ServerListItem } from '@/components/list/ServerListItem'
import { getTags } from '@/data/tags'

type SearchPageProps = {
    searchParams?: {
        q?: string
        tag?: string | string[]
        page?: string
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const q = searchParams?.q?.trim() || ''
    const tagParams = searchParams?.tag
    const tags = Array.isArray(tagParams)
        ? tagParams
              .filter(Boolean)
              .map(t => t.trim())
              .filter(Boolean)
        : tagParams
          ? [tagParams.trim()].filter(Boolean)
          : []
    const page = Number(searchParams?.page || '1') || 1

    const hasFilters = (q && q.length > 0) || (tags && tags.length > 0)
    const servers = hasFilters
        ? await searchServers({ query: q, tags, page })
        : []
    const tagOptions = await getTags()

    return (
        <div className={'container xl:max-w-7xl'}>
            <h1 className={'mt-16 text-xl font-semibold'}>
                Wyszukiwarka serwerów
            </h1>

            <form
                className={'mt-6 flex flex-col gap-3 md:flex-row'}
                action={'/search'}>
                <input
                    type='text'
                    name='q'
                    placeholder='Domena serwera (np. nazwaserwera.pl)'
                    defaultValue={q}
                    className={
                        'border-semi-border bg-semi-bg w-full rounded border px-3 py-2'
                    }
                />
                <button
                    type='submit'
                    className={
                        'bg-semi-promoted hover:bg-semi-promoted-hover rounded px-4 py-2'
                    }>
                    Szukaj
                </button>
            </form>

            <div className={'mt-4'}>
                <div
                    className={
                        'h scrollbar-thin scrollbar-track-semi-bg scrollbar-thumb-semi-border flex gap-4 overflow-x-auto pb-2'
                    }>
                    {tagOptions.map(({ value }) => {
                        const normalized = (value?.normalized as string) || ''
                        const label = (value?.tag as string) || normalized
                        if (!normalized) return null
                        const isActive = tags.includes(normalized)

                        const nextTags = isActive
                            ? tags.filter(t => t !== normalized)
                            : [...tags, normalized]

                        const params = new URLSearchParams()
                        if (q) params.set('q', q)
                        nextTags.forEach(t => params.append('tag', t))
                        const href = `/search?${params.toString()}`

                        return (
                            <a
                                key={normalized}
                                href={href}
                                className={`hover:bg-semi-bg-hover ${
                                    isActive
                                        ? 'border-blue-300'
                                        : 'border-semi-border'
                                } bg-semi-bg flex items-center gap-1 rounded border px-6 py-2 whitespace-nowrap hover:cursor-pointer`}>
                                #{label}
                            </a>
                        )
                    })}
                </div>
            </div>

            <div className={'mt-6 flex flex-col gap-2'}>
                {!hasFilters ? null : servers.length === 0 ? (
                    <div
                        className={
                            'border-semi-border bg-semi-bg rounded border px-4 py-6 text-center text-lg'
                        }>
                        Brak wyników.
                    </div>
                ) : (
                    servers
                        .filter(s => s.ServerData)
                        .map(s => (
                            <ServerListItem key={s.ServerData?.id} server={s} />
                        ))
                )}
            </div>
        </div>
    )
}
