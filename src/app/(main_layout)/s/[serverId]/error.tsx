'use client'

import Card from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <section className={'container mt-16 flex flex-col gap-4 xl:max-w-7xl'}>
            <Card className={'items-center justify-center py-8'}>
                <h1 className={'text-center text-2xl'}>
                    Wystąpił błąd podczas pobierania informacji o serwerze :(
                </h1>
            </Card>
            <Button styling={'primary'} element={'button'} onClick={reset}>
                Spróbuj ponownie
            </Button>
        </section>
    )
}
