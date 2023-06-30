'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
// import { getServerSession } from 'next-auth'
// import { handler } from '@/app/api/auth/[...nextauth]/route'

export default async function Login() {
    const { data: session, status } = useSession()
    // const session = await getServerSession(handler)

    console.log(session)

    return (
        <div>
            {!session ? (
                <button onClick={() => signIn()}>Zaloguj się</button>
            ) : (
                <button onClick={() => signOut()}>Wyloguj się</button>
            )}
        </div>
    )
}
