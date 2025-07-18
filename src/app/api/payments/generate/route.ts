import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PblClient } from 'paybylink-wrapper'
import logger from '@/lib/logger'

const pbl = new PblClient(process.env.PBL_SECRET, process.env.PBL_SHOP_ID)

export async function POST(request: NextRequest) {
    // Check if request is JSON
    if (request.headers.get('content-type') !== 'application/json')
        return NextResponse.json(
            { message: 'This API only accepts JSON format.' },
            { status: 400 }
        )

    const { serverId, price } = await request.json()

    // Check if serverId and price are provided
    if (!serverId || !price)
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 })

    // Check if price is a number
    if (isNaN(parseInt(price)))
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 })

    // Generate transaction
    try {
        const transaction = await pbl.generateTransaction({
            price,
            control: serverId,
            // notifyURL: `${process.env.API_URL}/payments/notify`,
            // TODO: Uncomment this when we have a domain
            returnUrlSuccess: `${process.env.API_URL}/payments/success`,
            returnUrlSuccessTidPass: true,
            hideReceiver: true,
        })

        await prisma.transactions.create({
            data: {
                id: transaction.transactionId,
                server_id: parseInt(serverId),
                amount: price,
            },
        })

        return NextResponse.json(transaction)
    } catch (e) {
        logger.error(e)
        return NextResponse.json(
            { message: 'Error while generating transaction' },
            { status: 500 }
        )
    }
}
