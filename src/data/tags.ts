import prisma from '@/lib/prisma'

export type Tag = {
    tag: string
    normalized: string
}

export const getTags = async () => {
    const result = await prisma.$queryRaw`
        SELECT DISTINCT jsonb_array_elements(gamemodes) as value
        FROM server_metadata
        WHERE gamemodes IS NOT NULL
        ORDER BY value
    `

    console.log(result)

    return result as Array<{ value: Tag }>
}
