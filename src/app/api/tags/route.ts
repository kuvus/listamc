import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    const gamemodesRaw: { gamemode: object }[] =
        await prisma.$queryRaw`SELECT DISTINCT JSONB_ARRAY_ELEMENTS(gamemodes) AS gamemode FROM dev."ServerMetadata"`

    const gamemodes = gamemodesRaw.map(r => r.gamemode)

    return NextResponse.json(gamemodes || [])
}
