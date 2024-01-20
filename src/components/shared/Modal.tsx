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
                className={`active:outline-0} min-h-[50vh] w-10/12 rounded-md bg-bg-900 p-8 text-text outline-0 backdrop:bg-bg-900 backdrop:bg-opacity-50 backdrop:backdrop-blur-sm md:w-7/12 lg:w-3/5 xl:w-1/2`}
                {...props}
                ref={modalRef}
                onClose={handleClose}>
                <div className={'flex flex-col gap-2'}>
                    <div className={'mb-4 flex flex-row justify-between'}>
                        <h2 className={'text-xl font-semibold'}>{title}</h2>
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
