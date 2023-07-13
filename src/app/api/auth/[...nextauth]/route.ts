import NextAuth from 'next-auth'
import { Provider } from 'next-auth/providers'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
//
const providers: Provider[] = [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
]

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers,
})

export { handler }

export { handler as GET, handler as POST }
