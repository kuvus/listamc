'use client'
import { Button } from '@/components/shared/Button'
import { FormEvent, FunctionComponent, useRef, useState } from 'react'

export type VoteFormProps = {
    token: string
    serverId: number
}

export const VoteForm: FunctionComponent<VoteFormProps> = ({
    token,
    serverId,
}) => {
    const playerNameRef = useRef<HTMLInputElement>(null)

    const [error, setError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        setError('')
        e.preventDefault()
        if (!playerNameRef.current)
            return {
                error: true,
                message: 'Component not mounted',
            }

        const playerName = playerNameRef.current?.value

        const voteUrl = `${process.env.NEXT_PUBLIC_API_URL}/vote`

        const body = {
            token,
            serverId,
            nick: playerName,
        }
        // TODO: ztypuj fetche w całym kodzie, podobnie jak tutaj

        try {
            const response = await fetch(voteUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                setError('Wystąpił błąd')
                return {
                    error: true,
                    message: 'Something went wrong',
                }
            }

            const data = await response.json()

            if (data.error) {
                setError('Wystąpił błąd')
                return {
                    error: true,
                    message: data.message,
                }
            }

            console.log(data)

            return {
                error: false,
                message: data.message,
            }
        } catch (e) {
            return {
                error: true,
                message: e.message,
            }
        }
    }

    return (
        <form
            className={
                'mx-auto mt-8 flex w-full flex-col gap-4 md:w-3/4 lg:w-3/5 xl:w-3/6'
            }
            onSubmit={handleSubmit}>
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
