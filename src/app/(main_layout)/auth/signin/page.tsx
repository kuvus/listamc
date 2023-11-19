import { useSession, getProviders } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SignInButton } from '@/components/auth/AuthButtons'
import { getServerSession } from 'next-auth'

export default async function Login() {
    // const { data: session, status } = useSession()
    const session = await getServerSession(authOptions)

    const providers = await getProviders()

    if (session) return redirect('/')

    if (!providers)
        return (
            <section
                className={'container mt-16 flex flex-col gap-4 xl:max-w-7xl'}>
                Brak dostępnych opcji logowania
            </section>
        )

    return (
        <section
            className={
                'container mt-16 flex flex-col items-center gap-4 xl:max-w-7xl'
            }>
            <div
                className={
                    'flex w-3/4 flex-col gap-2 rounded border border-semi-border bg-bg-800 p-8 text-center'
                }>
                <span className={'mb-4 text-xl'}>
                    Wybierz jedną z poniższych metod, aby się zalogować:
                </span>
                {Object.values(providers).map(provider => (
                    <SignInButton
                        providerName={provider.name}
                        providerID={provider.id}
                        key={provider.name}
                    />
                ))}
            </div>
        </section>
    )
}
