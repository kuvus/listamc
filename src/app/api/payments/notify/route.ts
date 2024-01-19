import { NextRequest, NextResponse } from 'next/server'
import { PblClient } from 'paybylink-wrapper'
import prisma from '@/utils/prisma'
import logger from '@/utils/logger'

const pbl = new PblClient(process.env.PBL_SECRET, process.env.PBL_SHOP_ID)

export async function POST(request: NextRequest) {
    const requestJson = await request.json()

    // Check if all required data is provided
    if (
        !requestJson.transactionId ||
        !requestJson.control ||
        !requestJson.email ||
        !requestJson.amountPaid ||
        !requestJson.notificationAttempt ||
        !requestJson.paymentType ||
        !requestJson.apiVersion ||
        !requestJson.signature
    )
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 })

    // Verify that the request is from PayByLink
    const isValid = pbl.validateTransactionNotification(requestJson)

    if (!isValid)
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 })

    // Update transaction in database

    const transaction = await updateTransaction(requestJson)

    if (!transaction)
        return NextResponse.json(
            { message: 'Error while updating transaction' },
            { status: 500 }
        )

    const previousPromotion = await getPreviousPromotion(transaction.server_id)

    if (previousPromotion) {
        const newEndDate = new Date(
            previousPromotion.date_end.getDate() + transaction.amount * 2
        )

        const updatedPromotion = await updatePromotion(
            transaction.server_id,
            newEndDate
        )
        if (!updatedPromotion)
            return NextResponse.json(
                { message: 'Error while updating promotion' },
                { status: 500 }
            )
    }

    const newPromotion = await createPromotion(
        transaction.server_id,
        new Date(Date.now() + transaction.amount * 2)
    )

    if (!newPromotion)
        return NextResponse.json(
            { message: 'Error while creating promotion' },
            { status: 500 }
        )

    return new Response('OK')
}

const updateTransaction = async (requestJson: any) => {
    try {
        return await prisma.transactions.update({
            where: {
                id: requestJson.transactionId,
            },
            data: {
                state: 1,
                email: requestJson.email,
                payment_type: requestJson.paymentType,
            },
            include: {
                Server: true,
            },
        })
    } catch (e) {
        logger.error(e)
        return null
    }
}

const getPreviousPromotion = async (serverId: number) => {
    try {
        return await prisma.promotion.findUniqueOrThrow({
            where: {
                server_id: serverId,
            },
        })
    } catch (e) {
        logger.error(e)
        return null
    }
}

const updatePromotion = async (serverId: number, newEndDate: Date) => {
    try {
        return await prisma.promotion.update({
            where: {
                server_id: serverId,
            },
            data: {
                date_end: newEndDate,
            },
        })
    } catch (e) {
        logger.error(e)
        return null
    }
}

const createPromotion = async (serverId: number, newEndDate: Date) => {
    try {
        return await prisma.promotion.create({
            data: {
                server_id: serverId,
                date_end: newEndDate,
            },
        })
    } catch (e) {
        logger.error(e)
        return null
    }
}
