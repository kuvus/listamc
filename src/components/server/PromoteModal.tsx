'use client'

import { Modal } from '@/components/shared/Modal'
import { Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DayOption {
    days: number
    price: number
    label: string
    highlighted?: boolean
}

export const PromoteModal = () => {
    const [selectedOption, setSelectedOption] = useState<DayOption>({
        days: 60,
        price: 60,
        label: 'Najlepsze!',
        highlighted: true,
    })

    const dayOptions: DayOption[] = [
        { days: 7, price: 15, label: 'Tydzień' },
        { days: 15, price: 25, label: '2 tygodnie' },
        { days: 30, price: 40, label: 'Miesiąc' },
        { days: 60, price: 60, label: 'Najtaniej!', highlighted: true },
    ]

    return (
        <Suspense>
            <Modal name={'promote'} title={'Promowanie'}>
                <div className='mx-auto flex w-full flex-col gap-8 text-center'>
                    <h3 className='text-2xl font-semibold'>
                        Wybierz okres promowania
                    </h3>

                    <div className='flex flex-row flex-wrap justify-center gap-4'>
                        {dayOptions.map(option => (
                            <div
                                key={option.days}
                                onClick={() => setSelectedOption(option)}
                                className={cn(
                                    'relative min-w-[130px] cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:scale-105',
                                    selectedOption.days === option.days
                                        ? 'border-sky-500 bg-sky-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300',
                                    option.highlighted
                                        ? 'shadow-lg ring-2 shadow-yellow-400/30 ring-yellow-400/20'
                                        : ''
                                )}>
                                {option.highlighted && (
                                    <div className='absolute -inset-1 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 opacity-30 blur-sm'></div>
                                )}
                                <div className='relative'>
                                    <div className='text-3xl font-bold text-gray-800'>
                                        {option.days}
                                    </div>
                                    <div className='mb-2 text-sm text-gray-600'>
                                        {option.days === 7
                                            ? 'dni'
                                            : option.days === 15
                                              ? 'dni'
                                              : option.days === 30
                                                ? 'dni'
                                                : 'dni'}
                                    </div>
                                    <div className='text-2xl font-semibold text-sky-600'>
                                        {option.price} zł
                                    </div>
                                    {option.highlighted && (
                                        <div className='rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-1 text-xs font-bold text-white'>
                                            {option.label}
                                        </div>
                                    )}
                                    <div className='mt-2 text-xs text-gray-400'>
                                        {(option.price / option.days).toFixed(
                                            2
                                        )}{' '}
                                        zł/dzień
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='rounded-lg bg-gray-50 p-6'>
                        <div className='flex flex-col items-center justify-center gap-4 text-lg text-gray-700'>
                            <span>Wybrany pakiet:</span>
                            <div className='flex items-center justify-center gap-4'>
                                <span className='text-2xl font-bold'>
                                    {selectedOption.days} dni
                                </span>
                                <span className='text-2xl'>=</span>
                                <span className='text-2xl font-bold text-sky-600'>
                                    {selectedOption.price} zł
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button variant={'default'} size={'lg'} type={'submit'}>
                        Wykup promowanie za {selectedOption.price} zł!
                    </Button>
                </div>
            </Modal>
        </Suspense>
    )
}
