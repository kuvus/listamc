'use client'

import { Modal } from '@/components/shared/Modal'
import { Suspense, useState } from 'react'
import { Button } from '@/components/shared/Button'

export const PromoteModal = () => {
    const [promoteDays, setPromoteDays] = useState(28)

    const handlePromoteDaysChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPromoteDays(e.target.valueAsNumber)
    }

    return (
        <Suspense>
            <Modal name={'promote'} title={'Promowanie'}>
                <div
                    className={
                        'mx-auto flex w-full flex-col gap-8 text-center lg:w-3/4 xl:w-1/2'
                    }>
                    <label htmlFor={'promoteDays'} className={'text-2xl'}>
                        Wybierz okres promowania
                    </label>
                    <input
                        id={'promoteDays'}
                        type={'range'}
                        min={'7'}
                        max={'63'}
                        step={'7'}
                        defaultValue={promoteDays}
                        onChange={handlePromoteDaysChange}
                        className='transparent h-1.5 w-full cursor-pointer appearance-none rounded border-transparent bg-sky-200 px-4 accent-sky-600'
                    />
                    <div
                        className={
                            'flex w-full items-end justify-center gap-2'
                        }>
                        <span>
                            <span className={'text-4xl font-semibold'}>
                                {promoteDays}
                            </span>{' '}
                            dni
                        </span>
                        <span className={'text-4xl'}>=</span>
                        <span>
                            <span className={'text-4xl font-semibold'}>
                                {promoteDays * 0.5}
                            </span>{' '}
                            zł
                        </span>
                    </div>
                    <Button
                        styling={'primary'}
                        element={'button'}
                        type={'submit'}>
                        Oddaj głos!
                    </Button>
                </div>
            </Modal>
        </Suspense>
    )
}
