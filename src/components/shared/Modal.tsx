'use client'

import { ComponentProps, useState } from 'react'
import { Button } from '@/components/shared/Button'
import { X } from 'lucide-react'
import type { ButtonThemeVariations } from '@/components/shared/Button'

interface ModalProps extends ComponentProps<'div'> {
    title: string
    children: React.ReactNode
    className?: string
    buttonType: ButtonThemeVariations
    buttonText: string
}

export const Modal = ({
    title,
    children,
    buttonType,
    buttonText,
    className,
    ...props
}: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleOpen = () => {
        setIsOpen(prev => {
            return !prev
        })
    }

    return (
        <>
            <Button
                styling={buttonType}
                element={'button'}
                onClick={toggleOpen}>
                {buttonText}
            </Button>
            <div
                className={`fixed left-0 right-0 top-0 z-40 ${
                    isOpen ? 'block' : 'hidden'
                } flex h-screen max-h-full items-center justify-center overflow-y-auto overflow-x-hidden p-4 backdrop-blur-md md:inset-0 ${
                    className || ''
                }`}
                {...props}>
                <div
                    className={
                        'container z-50 min-h-[50vh] max-w-3xl rounded bg-bg-900 p-8 text-left'
                    }>
                    <div
                        className={
                            'float-right mb-2 flex w-full items-end justify-between'
                        }>
                        <span className={'text-xl font-bold'}>{title}</span>
                        <div className={'hover:cursor-pointer'}>
                            <X onClick={toggleOpen} />
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}
