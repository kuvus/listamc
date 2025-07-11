import { Tag } from '@/components/list/Tag'
import type { TagProps } from '@/components/list/Tag'
import { getTags } from '@/data/tags'
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
    const tags = await getTags()
    return (
        <div
            className={
                'h scrollbar-thin scrollbar-track-semi-bg scrollbar-thumb-semi-border mt-8 flex gap-4 overflow-x-auto pb-2'
            }>
            {tags.map((tag: { name: string; type: string }) => {
                return (
                    <Tag tag={tag.name} normalized={tag.type} key={tag.type} />
                )
            })}
        </div>
    )
}
