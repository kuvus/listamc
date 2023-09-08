'use client'

import { ComponentProps, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface ModalProps extends ComponentProps<'dialog'> {
    name: string
    title: string
    children: React.ReactNode
    className?: string
}

export const Modal = ({
    name,
    title,
    children,
    className,
    ...props
}: ModalProps) => {
    const router = useRouter()
    const pathname = usePathname()

    const searchParams = useSearchParams()
    const modalRef = useRef<HTMLDialogElement>(null)

    const showModal: boolean = searchParams.get('m') === name

    useEffect(() => {
        if (showModal) {
            modalRef.current?.showModal()
        } else {
            modalRef.current?.close()
        }
    }, [showModal])

    const handleClose = () => {
        router.push(pathname, { scroll: false })
    }

    return (
        <>
            <dialog
                className={`min-h-[50vh] w-1/2 rounded bg-bg-900 p-8 text-text outline-0 backdrop:bg-bg-900 backdrop:bg-opacity-50 backdrop:backdrop-blur-sm active:outline-0`}
                {...props}
                ref={modalRef}
                onClose={handleClose}>
                <div className={'flex flex-col gap-2'}>
                    <div className={'flex flex-row justify-between'}>
                        <h2 className={'text-xl font-bold'}>{title}</h2>
                        <Link href={pathname} scroll={false}>
                            <X />
                        </Link>
                    </div>
                    {children}
                </div>
            </dialog>
        </>
    )
}
