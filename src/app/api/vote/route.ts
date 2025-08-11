import { NextRequest, NextResponse } from 'next/server'
import { getClientIp } from 'request-ip'
import prisma from '@/lib/prisma'
import md5 from 'md5'
import { verify } from 'jsonwebtoken'
import { env } from '@/env'

export async function POST(request: NextRequest) {
    const contentType = request.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json'))
        return NextResponse.json(
            { message: 'This API only accepts JSON format.' },
            { status: 400 }
        )

    const req = await request.json()
    const serverId = Number(req?.serverId)
    const token = req?.token as string | undefined
    const nick = req?.nick as string | undefined

    if (!serverId || Number.isNaN(serverId))
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 })

    // Verify vote token
    if (!token)
        return NextResponse.json({ message: 'Missing token' }, { status: 401 })

    try {
        const decoded = verify(token, process.env.JWT_SECRET!) as {
            serverId?: number
            type?: string
        }
        if (decoded?.type !== 'vote' || decoded?.serverId !== serverId)
            return NextResponse.json(
                { message: 'Invalid token' },
                { status: 401 }
            )
    } catch {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // Resolve client IP
    let clientIP =
        (getClientIp(request as unknown as any) as string | null) ||
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        ''
    if (!clientIP)
        return NextResponse.json(
            { message: 'Could not check client IP address' },
            { status: 400 }
        )

    // Normalize IPv6-mapped IPv4
    if (clientIP.startsWith('::ffff:'))
        clientIP = clientIP.replace('::ffff:', '')

    // Check server existence
    const server = await prisma.server.findUnique({
        where: { id: serverId },
        select: { id: true },
    })
    if (!server)
        return NextResponse.json(
            { message: 'Server not found' },
            { status: 404 }
        )

    // Proxy check (skip for localhost)
    const isLocalhost = clientIP === '127.0.0.1' || clientIP === '::1'
    if (!isLocalhost) {
        const isSafe = await checkIP(clientIP)
        if (!isSafe)
            return NextResponse.json(
                { message: 'Client IP marked as proxy' },
                { status: 400 }
            )
    }

    // 24h rate-limit per IP per server
    const twentyFourHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 24)
    const recentVote = await prisma.vote.findFirst({
        where: {
            server_id: serverId,
            hash: md5(clientIP),
            date: { gte: twentyFourHoursAgo },
        },
        select: { id: true, date: true },
    })

    if (recentVote)
        return NextResponse.json(
            { message: 'You can vote for this server again in 24 hours.' },
            { status: 429 }
        )

    // Create vote
    const vote = await prisma.vote.create({
        data: {
            server_id: serverId,
            hash: md5(clientIP),
        },
        select: { id: true },
    })

    if (!vote)
        return NextResponse.json(
            { message: 'Error while creating vote' },
            { status: 500 }
        )

    return NextResponse.json({ success: true })
}

type IPCheckResponse = {
    general: {
        ip: string
        asn: number
        provider: string
        country: string
    }
    risks: {
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
    try {
        const res = await fetch(`https://api.noproxy.okaeri.cloud/v1/${ip}`, {
            headers: {
                Authorization: `Bearer ${env.NOPROXY_API_KEY ?? ''}`,
            },
            cache: 'no-store',
        })

        if (!res.ok) {
            // Try to read error body to decide behavior
            let message = 'Could not check IP address'
            try {
                const body = (await res.json()) as {
                    status?: number
                    error?: string
                    message?: string
                }
                message = body?.message || body?.error || message
            } catch {}
            throw new Error(message)
        }

        const data = (await res.json()) as IPCheckResponse

        // Consider IP unsafe if service suggests blocking or flags proxy risk
        const shouldBlock = data.suggestions?.block === true
        const isProxy = data.risks?.proxy === true
        return !(shouldBlock || isProxy)
    } catch {
        return false
    }
}
