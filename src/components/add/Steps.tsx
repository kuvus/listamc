import { forwardRef, FunctionComponent } from 'react'
import { Loader2, X, Check } from 'lucide-react'
import { Alert } from '@/components/shared/Alert'

const StepOneDef = (props, ref) => {
    const { callback } = props
    return (
        <>
            <h1 className={'text-2xl'}>Podaj adres serwera</h1>
            <form onSubmit={callback} className={'w-full'}>
                <input
                    type={'text'}
                    className={
                        'w-full rounded border border-semi-border bg-bg-800 px-4 py-4 text-xl'
                    }
                    placeholder={'adresserwera.pl'}
                    ref={ref}
                />
            </form>
        </>
    )
}

const StepOne = forwardRef(StepOneDef)

type StateIconType = {
    state: 'load' | 'ok' | 'fail'
}

const StateIcon: FunctionComponent<StateIconType> = ({ state }) => {
    switch (state) {
        case 'load':
            return <Loader2 className={'animate-spin text-text'} />
        case 'ok':
            return <Check className={'text-green-500'} />
        case 'fail':
            return <X className={'text-red-600'} />
        default:
            return null
    }
}

type StepStateIconType = {
    step: number
    current: number
    error: number
}

const StepStateIcon: FunctionComponent<StepStateIconType> = ({
    step,
    current,
    error,
}) => {
    console.log(step, current, error, step === current, error === current)
    if (error === step) return <StateIcon state={'fail'} />
    if (current > step) return <StateIcon state={'ok'} />
    if (current <= step) return <StateIcon state={'load'} />

    return null
}

const StepTwo = ({ step, key, error }) => {
    // TODO:
    // 1. Fetch do API Gamedata
    // 2. Fetch do API listy czy nie ma jeszcze serwera na liście
    // 3a. Jeśli nie ma to dodajemy serwer do listy
    // 3b. Jeśli jest to wyświetlamy komunikat o tym
    // 4. Przejście do kroku 3

    // console.log(error)

    //
    // console.log(step, error)
    const errorText = [
        'Wystąpił błąd podczas pobierania danych serwera',
        'Wystąpił błąd podczas pobierania danych serwera',
    ]

    return (
        <>
            <h1 className={'text-2xl'}>Weryfikowanie statusu serwera...</h1>
            {error >= 0 && <Alert type={'error'}>{errorText[error]}</Alert>}
            <div className={'flex gap-2'}>
                <StepStateIcon step={0} current={step} error={error} />
                <span>Sprawdzanie statusu serwera...</span>
            </div>
            {step > 0 && (
                <div className={'flex gap-2'}>
                    <StepStateIcon step={1} current={step} error={error} />
                    <span className={'flex gap-2'}>
                        Sprawdzanie czy serwer został już dodany na listę...
                    </span>
                </div>
            )}
            {step > 1 && (
                <div className={'flex gap-2'}>
                    <StepStateIcon step={2} current={step} error={error} />
                    <span>Dodawanie serwera na listę...</span>
                </div>
            )}
        </>
    )
}

const StepThree = () => {
    return <></>
}

export { StepOne, StepTwo, StepThree }
