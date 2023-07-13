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
        <Link href={`/tag/${normalized}`}>
            <div
                className={
                    'px-6 py-2 flex gap-1 bg-semi-bg border border-semi-border rounded items-center'
                }>
                <Hash size={18} />
                {tag}
            </div>
        </Link>
    )
}
