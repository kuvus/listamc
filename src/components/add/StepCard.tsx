import { FunctionComponent } from 'react'

interface StepCardProps {
    step: number
    active: boolean
}

const StepCard: FunctionComponent<StepCardProps> = ({ step, active }) => {
    const steps = [
        'Podaj adres serwera',
        'Sprawdzenie statusu serwera',
        'Gotowe!',
    ]

    return (
        <div
            className={`flex flex-row items-center rounded border border-semi-border px-6 py-4 ${
                active ? 'bg-semi-promoted' : 'bg-semi-bg'
            }
            `}>
            <span className={'mr-4 border-r-2 border-r-gray-600 pr-4 text-5xl'}>
                {step + 1}
            </span>
            <span>{steps[step]}</span>
        </div>
    )
}

export default StepCard
