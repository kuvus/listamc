import { Tag as TagComponent } from '@/components/list/Tag'
import type { TagProps } from '@/components/list/Tag'
import { getTags, type Tag } from '@/data/tags'
import { FunctionComponent } from 'react'

export const TagList: FunctionComponent = async () => {
    const tags = await getTags()
    return (
        <div
            className={
                'h scrollbar-thin scrollbar-track-semi-bg scrollbar-thumb-semi-border mt-8 flex gap-4 overflow-x-auto pb-2'
            }>
            {tags.map((tag: { value: Tag }) => {
                return (
                    <TagComponent
                        tag={tag.value.tag}
                        normalized={tag.value.normalized}
                        key={tag.value.normalized}
                    />
                )
            })}
        </div>
    )
}
