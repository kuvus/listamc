import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/models/apiResponse'
import { GamedataResponse } from '@/models/gamedataResponse'
import getGamedata from '@/data/servers/getGamedata'

export async function GET(
    request: NextRequest,
    { params }: { params: { serverAddress: string } }
) {
    const { serverAddress } = params

    const json = await getGamedata(serverAddress)

    if ('status' in json)
        return NextResponse.json(json, { status: json.status })

    return NextResponse.json(json)
}
