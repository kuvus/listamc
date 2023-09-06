// import { useSession, signIn, signOut } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { handler } from '@/app/api/auth/[...nextauth]/route'
import { LoginButton, LogoutButton } from '@/components/auth/AuthButtons'

export default async function Login() {
    // const { data: session, status } = useSession()
    const session = await getServerSession(handler)

    console.log(session)

    return <div>{!session ? <LoginButton /> : <LogoutButton />}</div>
}
