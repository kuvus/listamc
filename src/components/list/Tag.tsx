import { FunctionComponent } from 'react'
import Link from 'next/link'
import { LuHash } from 'react-icons/lu'

interface TagProps {
    tag: string
    normalized: string
}

export type { TagProps }

export const Tag: FunctionComponent<TagProps> = ({ tag, normalized }) => {
    return (
        <Link href={`?tag=${normalized}`}>
            <div
                className={
                    'hover:bg-semi-bg-hover border-semi-border bg-semi-bg flex items-center gap-1 whitespace-nowrap rounded border px-6 py-2 hover:cursor-pointer'
                }>
                <LuHash size={18} />
                {tag}
            </div>
        </Link>
    )
}
