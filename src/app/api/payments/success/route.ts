import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/prisma'
import * as process from 'process'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const tid = searchParams.get('tid')

    if (!tid) return NextResponse.redirect(process.env.NEXT_PUBLIC_PAGE_URL)

    const transaction = await prisma.transactions.findUnique({
        where: {
            id: tid,
        },
        include: {
            Server: true,
        },
    })

    if (!transaction)
        return NextResponse.redirect(process.env.NEXT_PUBLIC_PAGE_URL)

    if (!transaction.Server)
        return NextResponse.redirect(process.env.NEXT_PUBLIC_PAGE_URL)

    return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_PAGE_URL}/s/${transaction.server_id}-${transaction.Server?.address}`
    )
}
