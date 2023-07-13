import { FunctionComponent } from 'react'

interface StatusIndicatorProps {
    status: boolean
}

export const StatusIndicator: FunctionComponent<StatusIndicatorProps> = ({
    status,
}) => {
    return (
        <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <circle cx='8' cy='8' r='8' fill={status ? '#40ffbf' : '#ff7878'} />
        </svg>
    )
}
