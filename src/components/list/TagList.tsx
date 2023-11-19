import { Tag } from '@/components/list/Tag'
import type { TagProps } from '@/components/list/Tag'
import { FunctionComponent } from 'react'

// TODO: Remove hardcoded, replace with fetch
const Tags: TagProps[] = [
    {
        tag: 'Survival',
        normalized: 'survival',
    },
    {
        tag: 'SkyBlock',
        normalized: 'skyblock',
    },
]

export const TagList: FunctionComponent = async () => {
    const tags = await getData()
    return (
        <div className={'h scrollbar-thin mt-8 flex gap-4 overflow-x-auto'}>
            {tags.map(tag => {
                return (
                    <Tag tag={tag.name} normalized={tag.type} key={tag.type} />
                )
            })}
        </div>
    )
}

const getData = async () => {
    const res = await fetch(`${process.env.API_URL}/tags`, {
        next: { revalidate: 1800 },
    })

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}
