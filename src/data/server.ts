'use server'

import { ServerData } from '@/models/Server'
import prisma from '@/lib/prisma'

const TWO_WEEKS_MS = 1000 * 60 * 60 * 24 * 7 * 2

type OrderBy = 'players' | 'votes'
type SortOrder = 'asc' | 'desc'

interface GetServersParams {
    skip: number
    take: number
    orderBy?: OrderBy
    sortOrder?: SortOrder
    promoted?: boolean
}

const SERVER_SELECT = {
    id: true,
    address: true,
    ServerData: true,
    Promotion: true,
    _count: {
        select: {
            Vote: {
                where: {
                    date: {
                        gte: new Date(Date.now() - TWO_WEEKS_MS),
                    },
                },
            },
        },
    },
    ServerMetadata: true,
} as const

const SERVER_LIST_SELECT = {
    address: true,
    ServerData: true,
    _count: {
        select: {
            Vote: {
                where: {
                    date: {
                        gte: new Date(Date.now() - TWO_WEEKS_MS),
                    },
                },
            },
        },
    },
    Promotion: true,
} as const

const isNumericServerId = (serverId: string): boolean => {
    return !isNaN(parseInt(serverId))
}

const buildOrderByClause = (
    orderBy?: OrderBy,
    sortOrder: SortOrder = 'desc'
) => {
    if (!orderBy) return undefined

    const order: 'asc' | 'desc' = sortOrder === 'asc' ? 'asc' : 'desc'

    switch (orderBy) {
        case 'players':
            return [
                {
                    ServerData: {
                        online: 'desc' as const,
                        players_online: order,
                    },
                },
            ]
        case 'votes':
            return [
                {
                    ServerData: {
                        online: 'desc' as const,
                    },
                },
                {
                    Vote: {
                        _count: order,
                    },
                },
            ]
        default:
            return undefined
    }
}

const buildWhereClause = (promoted?: boolean) => {
    if (promoted === undefined) return undefined

    if (promoted) {
        return {
            Promotion: {
                date_end: {
                    gte: new Date(),
                },
            },
        }
    }

    return {
        OR: [
            {
                Promotion: null,
            },
            {
                Promotion: {
                    date_end: {
                        lt: new Date(),
                    },
                },
            },
        ],
    }
}

export const getServer = async (serverId: string) => {
    try {
        if (isNumericServerId(serverId)) {
            const serverIdParsed = parseInt(serverId)
            return await prisma.server.findUnique({
                where: { id: serverIdParsed },
                select: SERVER_SELECT,
            })
        }

        return await prisma.server.findUnique({
            where: { address: serverId },
            select: SERVER_SELECT,
        })
    } catch (error) {
        console.error('Error fetching server:', error)
        throw new Error('Failed to fetch server')
    }
}

export const getServers = async ({
    skip,
    take,
    orderBy,
    sortOrder = 'desc',
    promoted,
}: GetServersParams) => {
    try {
        const servers = await prisma.server.findMany({
            select: SERVER_LIST_SELECT,
            skip,
            take,
            orderBy: buildOrderByClause(orderBy, sortOrder),
            where: buildWhereClause(promoted),
        })

        console.dir(servers, { depth: null })

        return servers
    } catch (error) {
        console.error('Error fetching servers:', error)
        throw new Error('Failed to fetch servers')
    }
}

export const getServerByAddress = async (address: string) => {
    return await prisma.server.findUnique({
        where: { address },
        select: SERVER_SELECT,
    })
}

export const addServer = async (
    server: Omit<ServerData, 'id' | 'server_id'>,
    address: string
) => {
    // Set default icon if missing
    const serverWithIcon = {
        ...server,
        icon: server.icon || '/assets/listamc-64x64.png',
    }
    return await prisma.server.create({
        data: {
            address,
            ServerData: {
                create: {
                    ...serverWithIcon,
                },
            },
        },
    })
}

export const getServerCount = async () => {
    return await prisma.server.count()
}
