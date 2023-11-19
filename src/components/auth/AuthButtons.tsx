'use client'

import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/shared/Button'
import { SiGoogle, SiDiscord } from '@icons-pack/react-simple-icons'

export const SignInButton = ({ providerName, providerID, key }) => {
    const Icon = ({ providerID }) => {
        switch (providerID) {
            case 'google':
                return <SiGoogle />
            case 'discord':
                return <SiDiscord />
            default:
                return <></>
        }
    }

    return (
        <Button
            element={'button'}
            styling={'outline'}
            onClick={() => signIn(providerID)}
            key={key}
            className={'inline-flex flex-row justify-center gap-4'}>
            <Icon providerID={providerID} />
            Zaloguj się z {providerName}
        </Button>
    )
}

export const SignOutButton = () => {
    return (
        <Button
            element={'button'}
            styling={'outline'}
            onClick={() => signOut()}>
            Wyloguj się
        </Button>
    )
}
