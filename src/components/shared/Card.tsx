import { ComponentProps } from 'react'
import { cx } from '@/lib/cva'

interface CardProps extends ComponentProps<'div'> {
    className?: string
}

const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <div
            className={cx(
                'border-semi-border bg-semi-bg flex w-full rounded border px-6 py-4',
                className
            )}
            {...props}>
            {children}
        </div>
    )
}

export default Card
