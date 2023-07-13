declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_PAGE_NAME: string
            NEXT_PUBLIC_PAGE_DESCRIPTION: string
            NEXT_PUBLIC_API_URL: string
            API_URL: string
            DATABASE_URL: string
            NEXTAUTH_URL: string
            NEXTAUTH_SECRET: string
            GOOGLE_CLIENT_ID: string
            GOOGLE_CLIENT_SECRET: string
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
