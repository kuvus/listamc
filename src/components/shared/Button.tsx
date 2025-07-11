'use client'

import { FunctionComponent } from 'react'
import Link from 'next/link'
import { cx, cva } from '@/lib/cva'

export const button = cva({
    base: 'px-8 py-2.5  rounded font-semibold inline-block text-base w-auto',
    variants: {
        intent: {
            primary: 'text-text bg-sky-500 hover:bg-sky-600',
            secondary:
                'text-text bg-semi-bg border border-semi-border hover:bg-semi-bg-hover',
            outline:
                'text-text bg-semi-bg border border-semi-border hover:bg-semi-bg-hover',
        },
    },
    defaultVariants: {
        intent: 'primary',
    },
})

export type ButtonThemeVariations = 'primary' | 'outline' | 'secondary'

type ButtonProps = {
    children?: React.ReactNode
    styling: ButtonThemeVariations
    size?: string
    onClick?: () => void
    href?: string
    element: string
    className?: string
    scroll?: boolean
    replace?: boolean
    prefetch?: boolean
    type?: 'button' | 'submit' | 'reset'
}

export const Button: FunctionComponent<ButtonProps> = ({
    children,
    styling,
    size,
    onClick,
    href,
    element,
    className,
    ...props
}) => {
    const classes = cx(button({ intent: styling }), className)

    if (element === 'a')
        return (
            <Link className={classes} href={`${href}`} {...props}>
                <span>{children}</span>
            </Link>
        )

    return (
        <button
            className={classes}
            onClick={onClick}
            type={'button'}
            {...props}>
            {children}
        </button>
    )
}
