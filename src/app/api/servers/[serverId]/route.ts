import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/prisma'
import { getServer } from '@/data/servers/getServer'

export async function GET(
    request: NextRequest,
    { params }: { params: { serverId: string } }
) {
    const { serverId } = params

    const server = await getServer(serverId)

    if (!server)
        return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    return NextResponse.json(server)
}
