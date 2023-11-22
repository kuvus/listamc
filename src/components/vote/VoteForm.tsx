'use client'
import { Button } from '@/components/shared/Button'
import { FormEvent, FunctionComponent, useRef } from 'react'

export type VoteFormProps = {
    token: string
    serverId: number
}

export const VoteForm: FunctionComponent<VoteFormProps> = ({
    token,
    serverId,
}) => {
    const playerNameRef = useRef<HTMLInputElement>(null)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!playerNameRef.current)
            return {
                error: true,
                message: 'Component not mounted',
            }

        const playerName = playerNameRef.current?.value

        const voteUrl = `${process.env.NEXT_PUBLIC_API_URL}/vote/${serverId}`
    }

    return (
        <form className={'flex w-full flex-col gap-4'} onSubmit={handleSubmit}>
            <div className={'flex w-full flex-col gap-2'}>
                <label htmlFor={'voter_name'}>
                    <span className={'font-semibold'}>Nazwa gracza</span>{' '}
                    <span className={'font-light'}>(opcjonalne)</span>
                </label>
                <input
                    type='text'
                    id={'voter_name'}
                    className={
                        'rounded border border-semi-border bg-bg-800 px-4 py-2'
                    }
                    pattern={'^[a-zA-Z0-9_]{2,16}$\n'}
                    ref={playerNameRef}
                />
            </div>
            <Button styling={'primary'} element={'button'} type={'submit'}>
                Oddaj głos!
            </Button>
        </form>
    )
}
