import { ComponentProps } from 'react'

interface CardProps extends ComponentProps<'div'> {
    className?: string
}

const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <div
            className={`flex w-full rounded border border-semi-border bg-semi-bg px-6 py-4 ${
                className || ''
            }`}
            {...props}>
            {children}
        </div>
    )
}

export default Card
