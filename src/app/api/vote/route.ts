import { NextRequest, NextResponse } from 'next/server'
import { getClientIp } from 'request-ip'
import prisma from '@/utils/prisma'
import md5 from 'md5'

export async function POST(request: NextRequest) {
    if (request.headers.get('content-type') !== 'application/json')
        return NextResponse.json(
            { message: 'This API only accepts JSON format.' },
            { status: 400 }
        )

    const req = await request.json()
    const serverId = req?.serverId
    const nick = req?.nick
    const clientIP = getClientIp(request)

    console.log(clientIP)

    // TODO: przetestować IP, ale powinno działać

    if (!serverId)
        return NextResponse.json(
            {
                message: 'Invalid data',
            },
            {
                status: 400,
            }
        )

    // Check if client IP provided
    if (!clientIP)
        return NextResponse.json(
            {
                message: 'Could not check client IP address',
            },
            {
                status: 400,
            }
        )

    // Check if client IP is safe
    if (!(await checkIP(clientIP)))
        return NextResponse.json(
            {
                message: 'Client IP marked as proxy',
            },
            {
                status: 400,
            }
        )

    // TODO: check token

    // Check if user already voted
    const userVoted = await prisma.vote.findFirst({
        where: {
            server_id: serverId,
            hash: md5(clientIP),
        },
    })

    if (userVoted)
        return NextResponse.json(
            {
                message: 'You already voted for this server',
            },
            {
                status: 400,
            }
        )

    // Check if server exists
    const server = await prisma.server.findUnique({
        where: {
            id: serverId,
        },
    })

    if (!server)
        return NextResponse.json(
            {
                message: 'Server not found',
            },
            {
                status: 404,
            }
        )

    // Create vote
    const vote = await prisma.vote.create({
        data: {
            server_id: serverId,
            hash: md5(clientIP),
        },
    })

    if (!vote)
        return NextResponse.json(
            {
                message: 'Error while creating vote',
            },
            {
                status: 500,
            }
        )

    return NextResponse.json({
        success: true,
    })
}

type IPCheckResponse = {
    general: {
        ip: string
        asn: number
        provider: string
        country: string
    }
    risk: {
        total: number
        proxy: boolean
        country: boolean
        asn: boolean
        provider: boolean
        abuser: boolean
    }
    score: {
        noproxy: number
        abuseipdb: number
    }
    suggestions: {
        verify: boolean
        block: boolean
    }
}

/**
 * Returns true if IP is safe, false if not
 *
 * @param ip
 */
const checkIP = async (ip: string) => {
    console.log('aaa')
    console.log(ip)
    try {
        const res: IPCheckResponse = await fetch(
            `https://noproxy-api.okaeri.eu/v1/${ip}`
        ).then(res => {
            if (!res.ok) throw new Error('Could not check IP address')
            return res.json()
        })

        return !(res?.suggestions.verify === true)
    } catch (e) {
        return false
    }
}
