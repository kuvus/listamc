'use client'

import { ComponentProps, useState } from 'react'
import { Button } from '@/components/shared/Button'
import { X } from 'lucide-react'

interface ModalProps extends ComponentProps<'div'> {
    title: string
    children: React.ReactNode
    className?: string
    buttonType: string
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
            <Button type={buttonType} element={'button'} onClick={toggleOpen}>
                {buttonText}
            </Button>
            <div
                className={`fixed top-0 left-0 right-0 z-40 ${
                    isOpen ? 'block' : 'hidden'
                } p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen max-h-full backdrop-blur-md justify-center items-center flex ${
                    className || ''
                }`}>
                <div
                    className={
                        'rounded bg-bg-900 container max-w-3xl min-h-[50vh] p-8 text-left z-50'
                    }>
                    <div
                        className={
                            'w-full float-right justify-between items-end flex mb-2'
                        }>
                        <span className={'font-bold text-xl'}>{title}</span>
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
