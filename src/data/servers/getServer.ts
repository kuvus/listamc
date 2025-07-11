'use server'

import prisma from '@/lib/prisma'
import { Server } from '@/models/Server'

export const getServer = async (serverId: string): Promise<Server | null> => {
    const serverIdParsed = parseInt(serverId)

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

    if (isNaN(parseInt(serverId)))
        return prisma.server.findUnique({
            where: {
                address: serverId,
            },
            select: select,
        })
    else
        return prisma.server.findUnique({
            where: {
                id: serverIdParsed,
            },
            select: select,
        })
}
