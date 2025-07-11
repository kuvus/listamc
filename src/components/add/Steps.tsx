import { forwardRef, FunctionComponent } from 'react'
import {
    LuLoaderCircle,
    LuX,
    LuCheck,
    LuServer,
    LuUsers,
    LuMonitor,
} from 'react-icons/lu'
import { Alert } from '@/components/shared/Alert'
import { Button } from '@/components/ui/button'
import { GamedataResponse } from '@/models/gamedataResponse'

const StepOneDef = (props, ref) => {
    const { callback } = props
    return (
        <>
            <h1 className={'text-2xl'}>Podaj adres serwera</h1>
            <form onSubmit={callback} className={'w-full'}>
                <input
                    type={'text'}
                    className={
                        'border-semi-border bg-bg-800 w-full rounded border px-4 py-4 text-xl'
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
            return <LuLoaderCircle className={'text-text animate-spin'} />
        case 'ok':
            return <LuCheck className={'text-green-500'} />
        case 'fail':
            return <LuX className={'text-red-600'} />
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

const StepTwo = ({ step, error }) => {
    const errorText = [
        'Wystąpił błąd podczas pobierania danych serwera. Sprawdź czy serwer jest włączony.',
        'Wystąpił błąd podczas sprawdzania czy serwer istnieje na liście',
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
        </>
    )
}

type StepThreeProps = {
    serverDetails: GamedataResponse | null
    serverExists: boolean
    existingServer?: any
    onAddServer: () => Promise<void>
    isAdding: boolean
}

const StepThree: FunctionComponent<StepThreeProps> = ({
    serverDetails,
    serverExists,
    existingServer,
    onAddServer,
    isAdding,
}) => {
    if (!serverDetails || serverDetails.hasOwnProperty('error')) {
        return (
            <>
                <h1 className={'text-2xl'}>Błąd</h1>
                <Alert type={'error'}>
                    Nie udało się pobrać danych serwera
                </Alert>
            </>
        )
    }

    if (serverExists) {
        return (
            <>
                <h1 className={'text-2xl'}>Serwer już istnieje</h1>
                <Alert type={'info'}>
                    Ten serwer został już dodany do listy serwerów.
                </Alert>
                {existingServer?.id && (
                    <a href={`/s/${existingServer.id}`}>
                        <Button className={'mt-4 w-full'} size={'lg'}>
                            Przejdź do strony serwera
                        </Button>
                    </a>
                )}
            </>
        )
    }

    const motd = 'motd' in serverDetails ? serverDetails.motd.text : ''

    return (
        <>
            <h1 className={'text-2xl'}>Potwierdzenie dodania serwera</h1>
            <div className={'border-semi-border bg-semi-bg rounded border p-4'}>
                <div className={'mb-4'}>
                    <h2 className={'mb-2 text-lg font-semibold'}>
                        Szczegóły serwera:
                    </h2>
                </div>

                <div className={'grid grid-cols-1 gap-4 md:grid-cols-2'}>
                    <div className={'flex items-center gap-2'}>
                        <LuServer />
                        <span className={'text-sm text-gray-400'}>Wersja:</span>
                        <span>
                            {'version' in serverDetails
                                ? serverDetails.version.range.display
                                : 'Unknown'}
                        </span>
                    </div>

                    <div className={'flex items-center gap-2'}>
                        <LuUsers />
                        <span className={'text-sm text-gray-400'}>Gracze:</span>
                        <span>
                            {'players' in serverDetails
                                ? `${serverDetails.players.online}/${serverDetails.players.max}`
                                : '0/0'}
                        </span>
                    </div>
                </div>

                {motd && (
                    <div className={'mt-4'}>
                        <div className={'mb-2 flex items-center gap-2'}>
                            <LuMonitor />
                            <span className={'text-sm text-gray-400'}>
                                MOTD:
                            </span>
                        </div>
                        <div className={'rounded bg-gray-800 p-2 text-sm'}>
                            {motd}
                        </div>
                    </div>
                )}
            </div>

            <div className={'mt-6'}>
                <p className={'mb-4 text-gray-300'}>
                    Czy chcesz dodać ten serwer do listy serwerów Minecraft?
                </p>
                <Button
                    onClick={onAddServer}
                    size={'lg'}
                    disabled={isAdding}
                    className={'w-full'}>
                    {isAdding ? (
                        <>
                            <LuLoaderCircle className={'mr-2 animate-spin'} />
                            Dodawanie serwera...
                        </>
                    ) : (
                        'Dodaj serwer'
                    )}
                </Button>
            </div>
        </>
    )
}

export { StepOne, StepTwo, StepThree }
