'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/shared/Button'
import { StepOne, StepTwo, StepThree } from '@/components/add/Steps'
import StepCard from '@/components/add/StepCard'
import * as process from 'process'

export default function Add() {
    const [step, setStep] = useState(0)
    const [addStep, setAddStep] = useState(0) // State for the second step step
    const [serverAddress, setServerAddress] = useState('')
    const [stepFail, setStepFail] = useState(-1)
    const [nextStepReady, setNextStepReady] = useState(true)

    const inputRef = useRef<HTMLInputElement>(null)

    const incrementStep = () => {
        setStepFail(-1)
        if (step == 0) setServerAddress(inputRef.current?.value || '')
        setNextStepReady(false)
        setStep(cs => (cs == steps.length - 1 ? cs : cs + 1))
    }

    const decrementStep = () => {
        setStepFail(-1)
        if (step == 1) {
            setNextStepReady(true)
        }
        setStep(cs => (cs == 0 ? cs : cs - 1))
    }

    const steps = [
        <StepOne key={'step-1'} ref={inputRef} callback={incrementStep} />,
        <StepTwo key={'step-2'} step={addStep} error={stepFail} />,
        <StepThree key={'step-3'} />,
    ]

    const fetchServerDetails = async (address: string) => {
        setAddStep(0)
        const gamedataURL = encodeURI(
            `${process.env.NEXT_PUBLIC_API_URL}/gamedata/${address.replaceAll('/', '')}`
        )

        try {
            const res = await fetch(gamedataURL)

            if (!res.ok) {
                setStepFail(0)
                return { error: true }
            }

            const body = await res.json()

            console.log('GD response', body)

            return body
        } catch (e) {
            setStepFail(0)
            console.log(e)
        }

        return { error: true }
    }

    const checkIfServerInDB = async (address: string) => {
        setAddStep(1)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/servers/${address}`
            )
            if (!res.ok) {
                switch (res.status) {
                    case 404:
                        setAddStep(2)
                        break
                    default:
                        setStepFail(1)
                        break
                }
            }
            return res.json()
        } catch (e) {
            setStepFail(1)
        }

        return { error: true }
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
                    const serverDetails =
                        await fetchServerDetails(serverAddress)

                    if (serverDetails.error) {
                        console.log('error')
                        return
                    }

                    console.log('SD: ', serverDetails)

                    const serverInDB = await checkIfServerInDB(serverAddress)

                    // if (serverInDB.error) {
                    //     console.log('error')
                    //     return
                    // }

                    setAddStep(3)
                    setNextStepReady(true)
                })()
                break
            default:
                break
        }
    }, [step, serverAddress])

    console.log(stepFail)

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
                    {step > 0 && (
                        <Button
                            styling={'outline'}
                            element={'button'}
                            onClick={decrementStep}>
                            Cofnij
                        </Button>
                    )}
                    {nextStepReady && (
                        <Button
                            styling={'primary'}
                            element={'button'}
                            onClick={incrementStep}>
                            Przejdź do kolejnego kroku!
                        </Button>
                    )}
                </div>
            </div>
        </section>
    )
}
