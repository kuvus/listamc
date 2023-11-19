import NextAuth, { NextAuthOptions } from 'next-auth'
import { Provider } from 'next-auth/providers'
import GoogleProvider from 'next-auth/providers/google'
import DiscordProvider from 'next-auth/providers/discord'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import logger from '@/utils/logger'

const prisma = new PrismaClient()

const providers: Provider[] = [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
]

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers,
    pages: {
        signIn: '/auth/signin',
    },
    logger: {
        error(code, metadata) {
            logger.error(code, metadata)
        },
        warn(code) {
            logger.warn(code)
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
