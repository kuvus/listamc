'use client'

import { ComponentProps, useState } from 'react'
import { Button } from '@/components/shared/Button'
import { X } from 'lucide-react'

interface ModalProps extends ComponentProps<'div'> {
    children: React.ReactNode
    className?: string
    buttonType: string
    buttonText: string
}

export const Modal = ({
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
            <Button type={buttonType} element={'button'} onClick={toggleOpen}>
                {buttonText}
            </Button>
            <div
                className={`fixed top-0 left-0 right-0 z-50 ${
                    isOpen ? 'block' : 'hidden'
                } p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen max-h-full backdrop-blur-md justify-center items-center flex ${
                    className || ''
                }`}>
                <div
                    className={
                        'rounded bg-bg-900 w-2/3 min-h-[50vh] p-8 text-left'
                    }>
                    <div
                        className={
                            'w-full float-right justify-end items-end flex '
                        }>
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
