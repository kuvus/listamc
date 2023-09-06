'use client'

import { forwardRef, useState } from 'react'

const StepOneDef = (props, ref) => {
    return (
        <>
            <h1 className={'text-2xl'}>Podaj adres serwera</h1>
            <input
                type={'text'}
                className={
                    'rounded border border-semi-border bg-bg-800 px-4 py-4 text-xl'
                }
                placeholder={'adresserwera.pl'}
                ref={ref}
            />
        </>
    )
}

const StepOne = forwardRef(StepOneDef)

const StepTwo = ({ step, key }) => {
    // TODO:
    // 1. Fetch do API Gamedata
    // 2. Fetch do API listy czy nie ma jeszcze serwera na liście
    // 3a. Jeśli nie ma to dodajemy serwer do listy
    // 3b. Jeśli jest to wyświetlamy komunikat o tym
    // 4. Przejście do kroku 3

    return (
        <>
            <h1 className={'text-2xl'}>Weryfikowanie statusu serwera...</h1>
            <span>Sprawdzanie statusu serwera...</span>
            <span className={step > 0 ? '' : 'hidden'}>
                Sprawdzanie czy serwer został już dodany na listę...
            </span>
            <span className={step > 1 ? '' : 'hidden'}>
                Dodawanie serwera na listę...
            </span>
        </>
    )
}

const StepThree = () => {
    return <></>
}

export { StepOne, StepTwo, StepThree }
