import { NextRequest, NextResponse } from 'next/server'
import { Resolver } from 'node:dns/promises'

export async function GET(
    request: NextRequest,
    { params }: { params: { serverId: string } }
) {
    return NextResponse.json({
        error: 'Not implemented',
    })

    // TODO: rate limiting https://vercel.com/guides/securing-ai-app-rate-limiting
    // const { serverId } = params
    // const resolver = new Resolver()
    //
    // try {
    //     const records = await resolver.resolveTxt(serverId)
    //
    //     let verificationRecord: string | null = null
    //
    //     for (let recordSplits of records) {
    //         const record = recordSplits.join('')
    //         if (!record.startsWith('LMC-VERIFY-')) continue
    //         verificationRecord = record
    //     }
    //
    //     if (!verificationRecord)
    //         return NextResponse.json({
    //             error: 'No verification TXT record found',
    //         })
    //
    //     const verificationRecordSplit = verificationRecord.split('-')
    //
    //     if (verificationRecordSplit.length !== 3)
    //         return NextResponse.json({
    //             error: 'Invalid verification code',
    //         })
    //
    //     const verificationCode = verificationRecordSplit[2]
    //
    //     // TODO: check logic here
    //
    //     return NextResponse.json({
    //         success: true,
    //     })
    // } catch {
    //     return NextResponse.json({
    //         error: 'No TXT records found',
    //     })
    // }
}
