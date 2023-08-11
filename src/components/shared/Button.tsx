'use client'

import { FunctionComponent } from 'react'
import Link from 'next/link'

const ButtonThemes = {
    primary: 'text-text bg-sky-500 hover:bg-sky-600',
    outline: 'text-text bg-semi-bg border border-semi-border',
}

type ButtonThemeVariations = 'primary' | 'outline'

type ButtonProps = {
    children?: React.ReactNode
    styling: ButtonThemeVariations
    size?: string
    onClick?: () => void
    href?: string
    element: string
    className?: string
}

export const Button: FunctionComponent<ButtonProps> = ({
    children,
    styling,
    size,
    onClick,
    href,
    element,
    className,
}) => {
    const classes = `px-8 py-2.5  rounded font-semibold inline-block text-base w-auto ${
        className || ''
    } ${ButtonThemes[styling] || ''}`

    if (element === 'a')
        return (
            <Link className={classes} href={`${href}`}>
                <span>{children}</span>
            </Link>
        )

    return (
        <button className={classes} onClick={onClick} type={'button'}>
            {children}
        </button>
    )
}
