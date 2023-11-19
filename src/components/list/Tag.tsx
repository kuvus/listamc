import { FunctionComponent } from 'react'
import Link from 'next/link'
import { Hash } from 'lucide-react'

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
                    'flex items-center gap-1 whitespace-nowrap rounded border border-semi-border bg-semi-bg px-6 py-2'
                }>
                <Hash size={18} />
                {tag}
            </div>
        </Link>
    )
}
