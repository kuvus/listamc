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

export const TagList: FunctionComponent = () => {
    return (
        <div className={'flex gap-4 overflow-auto mt-8'}>
            {Tags.map(tag => {
                return (
                    <Tag
                        tag={tag.tag}
                        normalized={tag.normalized}
                        key={tag.normalized}
                    />
                )
            })}
        </div>
    )
}
