import prisma from '@/lib/prisma'

export const getTags = async () => {
    const gamemodesRaw: { gamemode: object }[] =
        await prisma.$queryRaw`SELECT DISTINCT JSONB_ARRAY_ELEMENTS(gamemodes) AS gamemode FROM dev."ServerMetadata"`

    return gamemodesRaw.map(r => r.gamemode)
}
