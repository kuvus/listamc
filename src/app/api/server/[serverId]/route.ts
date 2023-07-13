import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { serverId: string } }
) {
    const { serverId } = params
    const select = {
        id: true,
        address: true,
        ServerData: true,
        Promotion: true,
        _count: {
            select: {
                Vote: {
                    where: {
                        date: {
                            gte: new Date(
                                Date.now() - 1000 * 60 * 60 * 24 * 7 * 2
                            ),
                        },
                    },
                },
            },
        },
        ServerMetadata: true,
    }
    let server = await prisma.server.findUnique({
        where: {
            id: serverId,
        },
        select: select,
    })
    if (!server)
        server = await prisma.server.findUnique({
            where: {
                address: serverId,
            },
            select: select,
        })

    return NextResponse.json(server || {})
}
