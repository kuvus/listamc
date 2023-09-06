'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/shared/Button'
import { StepOne, StepTwo, StepThree } from '@/components/add/Steps'
import StepCard from '@/components/add/StepCard'
import * as process from 'process'

export default function Add() {
    const [step, setStep] = useState(0)

    const [serverAddress, setServerAddress] = useState('')

    const inputRef = useRef<HTMLInputElement>(null)

    const steps = [
        <StepOne key={'step-1'} ref={inputRef} />,
        <StepTwo key={'step-2'} step={step} />,
        <StepThree key={'step-3'} />,
    ]

    const incrementStep = () => {
        if (step == 0) setServerAddress(inputRef.current?.value || '')
        setStep(cs => (cs == steps.length - 1 ? cs : cs + 1))
    }

    const decrementStep = () => {
        setStep(cs => (cs == 0 ? cs : cs - 1))
    }

    const fetchServerDetails = async (address: string) => {
        const gamedataURL = encodeURI(
            `https://api.gamedata.okaeri.cloud/v1/minecraftjava/${address.replaceAll(
                '/',
                ''
            )}/info`
        )
        const res = await fetch(gamedataURL)

        if (!res.ok) {
            return { error: true }
        }

        return res.json()
    }

    const checkIfServerInDB = async (address: string) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/server/${address}`
        )
        if (!res.ok) {
            return { error: true }
        }
        return res.json()
    }

    useEffect(() => {
        switch (step) {
            case 0:
                if (inputRef.current) {
                    inputRef.current.value = serverAddress
                    inputRef.current.focus()
                }
                break
            case 1:
                ;(async () => {
                    const serverDetails = await fetchServerDetails(
                        serverAddress
                    )

                    if (serverDetails.error) {
                        console.log('error')
                        return
                    }

                    console.log(serverDetails)

                    const serverInDB = await checkIfServerInDB(serverAddress)

                    if (serverInDB.error) {
                        console.log('error')
                        return
                    }
                })()
                break
            default:
                break
        }
    }, [step, serverAddress])

    return (
        <section className={'container mt-16 flex flex-col gap-4 xl:max-w-7xl'}>
            <div className={'grid grid-cols-3 gap-4'}>
                <StepCard step={0} active={step == 0} />
                <StepCard step={1} active={step == 1} />
                <StepCard step={2} active={step == 2} />
            </div>
            <div
                className={
                    'flex flex-col gap-4 rounded border border-semi-border bg-semi-bg px-6 py-6'
                }>
                {steps[step]}
                <div className={'flex w-full justify-end gap-4'}>
                    <Button
                        styling={'outline'}
                        element={'button'}
                        onClick={decrementStep}>
                        Cofnij
                    </Button>
                    <Button
                        styling={'primary'}
                        element={'button'}
                        onClick={incrementStep}>
                        Przejdź do kolejnego kroku!
                    </Button>
                </div>
            </div>
        </section>
    )
}
