import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        API_URL: z.string().url(),
        JWT_SECRET: z.string().min(1),
        PBL_SHOP_ID: z.coerce.number().optional(),
        PBL_SECRET: z.string().optional(),
        NOPROXY_API_KEY: z.string().optional(),
        GAMEDATA_API_KEY: z.string().optional(),
        BETTER_AUTH_SECRET: z.string().min(1),
        BETTER_AUTH_URL: z.string().url(),
    },
    client: {
        NEXT_PUBLIC_API_URL: z.string().url(),
        NEXT_PUBLIC_PAGE_URL: z.string().url(),
        NEXT_PUBLIC_PAGE_NAME: z.string().min(1),
        NEXT_PUBLIC_PAGE_DESCRIPTION: z.string().min(1),
        NEXT_PUBLIC_LOGFLARE_API_KEY: z.string().optional(),
        NEXT_PUBLIC_LOGFLARE_SOURCE_TOKEN: z.string().optional(),
    },
    // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
    // runtimeEnv: {
    //     DATABASE_URL: process.env.DATABASE_URL,
    //     OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    //     NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
    // },
    // For Next.js >= 13.4.4, you only need to destructure client variables:
    experimental__runtimeEnv: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_PAGE_URL: process.env.NEXT_PUBLIC_PAGE_URL,
        NEXT_PUBLIC_PAGE_NAME: process.env.NEXT_PUBLIC_PAGE_NAME,
        NEXT_PUBLIC_PAGE_DESCRIPTION: process.env.NEXT_PUBLIC_PAGE_DESCRIPTION,
        NEXT_PUBLIC_LOGFLARE_API_KEY: process.env.NEXT_PUBLIC_LOGFLARE_API_KEY,
        NEXT_PUBLIC_LOGFLARE_SOURCE_TOKEN:
            process.env.NEXT_PUBLIC_LOGFLARE_SOURCE_TOKEN,
    },
})
