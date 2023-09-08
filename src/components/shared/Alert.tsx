import { FunctionComponent } from 'react'

type AlertProps = {
    children: React.ReactNode
    type: 'error' | 'success' | 'info'
}

export const Alert: FunctionComponent<AlertProps> = ({ children, type }) => {
    const colors = {
        error: 'border-red-600 bg-red-500',
        success: 'border-green-800 bg-green-600',
        info: 'border-blue-600 bg-blue-400',
    }
    return (
        <div className={`w-full rounded border p-4 ${colors[type]}`}>
            {children}
        </div>
    )
}
