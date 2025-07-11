'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { StepOne, StepTwo, StepThree } from '@/components/add/Steps'
import StepCard from '@/components/add/StepCard'
import { addServer, getServerByAddress } from '@/data/server'
import getGamedata from '@/data/servers/getGamedata'
import { GamedataResponse } from '@/models/gamedataResponse'

export default function Add() {
    const [step, setStep] = useState(0)
    const [addStep, setAddStep] = useState(0) // State for the second step step
    const [serverAddress, setServerAddress] = useState('')
    const [stepFail, setStepFail] = useState(-1)
    const [nextStepReady, setNextStepReady] = useState(true)
    const [serverDetails, setServerDetails] = useState<GamedataResponse | null>(
        null
    )
    const [serverExists, setServerExists] = useState(false)
    const [isAddingServer, setIsAddingServer] = useState(false)
    const [existingServer, setExistingServer] = useState<any>(null)

    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

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
        if (step == 2) {
            setNextStepReady(true)
        }
        setStep(cs => (cs == 0 ? cs : cs - 1))
    }

    const handleAddServer = async () => {
        if (!serverDetails || serverDetails.hasOwnProperty('error')) return

        setIsAddingServer(true)

        try {
            const serverData = {
                version:
                    'version' in serverDetails
                        ? serverDetails.version.range.display || 'Unknown'
                        : 'Unknown',
                players_online:
                    'players' in serverDetails
                        ? serverDetails.players.online
                        : 0,
                players_max:
                    'players' in serverDetails ? serverDetails.players.max : 0,
                motd:
                    'motd' in serverDetails
                        ? serverDetails.motd.html
                        : 'Unknown',
                motd_text:
                    'motd' in serverDetails
                        ? serverDetails.motd.text
                        : 'Unknown',
                icon:
                    'favicon' in serverDetails ? serverDetails.favicon.url : '',
                online: true,
                last_update: new Date(),
            }

            const addedServer = await addServer(serverData, serverAddress)

            router.push(`/s/${addedServer.id}`)
        } catch (error) {
            console.error('Error adding server:', error)
            setIsAddingServer(false)
        }
    }

    const steps = [
        <StepOne ref={inputRef} callback={incrementStep} />,
        <StepTwo step={addStep} error={stepFail} />,
        <StepThree
            serverDetails={serverDetails}
            serverExists={serverExists}
            existingServer={existingServer}
            onAddServer={handleAddServer}
            isAdding={isAddingServer}
        />,
    ]

    const getServerDetailsFromAPI = async (
        address: string
    ): Promise<GamedataResponse> => {
        setAddStep(0)

        try {
            const res = await getGamedata(address)

            if (!res) {
                setStepFail(0)
                return res
            }

            return res
        } catch (e) {
            setStepFail(0)
            console.log(e)
        }

        return {
            status: 404,
            error: 'Server not reachable',
            message: 'Server not reachable',
        }
    }

    const checkIfServerInDB = async (address: string) => {
        setAddStep(1)
        try {
            const res = await getServerByAddress(address)
            if (!res) {
                setAddStep(2)
                setServerExists(false)
                setExistingServer(null)
                return { error: false }
            }
            setServerExists(true)
            setExistingServer(res)
            setAddStep(2)
            return res
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
                    const fetchedServerDetails =
                        await getServerDetailsFromAPI(serverAddress)

                    if (fetchedServerDetails.hasOwnProperty('error')) {
                        console.log('error')
                        return
                    }

                    console.log('SD: ', fetchedServerDetails)
                    setServerDetails(fetchedServerDetails)

                    await checkIfServerInDB(serverAddress)

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
                    'border-semi-border bg-semi-bg flex flex-col gap-4 rounded border px-6 py-6'
                }>
                {steps[step]}
                <div className={'flex w-full justify-end gap-4'}>
                    {step > 0 && (
                        <Button
                            variant={'outline'}
                            onClick={decrementStep}
                            size={'lg'}
                            disabled={isAddingServer}>
                            Cofnij
                        </Button>
                    )}
                    {nextStepReady && step < 2 && (
                        <Button size={'lg'} onClick={incrementStep}>
                            Przejdź do kolejnego kroku!
                        </Button>
                    )}
                </div>
            </div>
        </section>
    )
}
