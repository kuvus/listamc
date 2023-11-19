declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string
            API_URL: string
            NEXT_PUBLIC_API_URL: string
            NEXT_PUBLIC_PAGE_URL: string
            NEXT_PUBLIC_PAGE_NAME: string
            NEXT_PUBLIC_PAGE_DESCRIPTION: string
            NEXTAUTH_URL: string
            NEXTAUTH_SECRET: string
            JWT_SECRET: string
            GOOGLE_CLIENT_ID: string
            GOOGLE_CLIENT_SECRET: string
            DISCORD_CLIENT_ID: string
            DISCORD_CLIENT_SECRET: string
            PBL_SHOP_ID: number
            PBL_SECRET: string
            NEXT_PUBLIC_LOGFLARE_API_KEY: string
            NEXT_PUBLIC_LOGFLARE_SOURCE_TOKEN: string
            NOPROXY_API_KEY: string
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
