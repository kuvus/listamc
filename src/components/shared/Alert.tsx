import { FunctionComponent } from 'react'
import { cx, cva } from '@/utils/cva'

export const alert = cva({
    base: 'w-full rounded border p-4',
    variants: {
        intent: {
            error: 'border-red-600 bg-red-500',
            success: 'border-green-800 bg-green-600',
            info: 'border-blue-600 bg-blue-400',
        },
    },
    defaultVariants: {
        intent: 'info',
    },
})

type AlertProps = {
    children: React.ReactNode
    type: 'error' | 'success' | 'info'
    className?: string
}

export const Alert: FunctionComponent<AlertProps> = ({
    children,
    type,
    className,
}) => {
    return (
        <div className={cx(alert({ intent: type }), className)}>{children}</div>
    )
}
