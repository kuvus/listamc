import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/prisma'
import { ApiResponse } from '@/models/apiResponse'
import { GamedataResponse } from '@/models/gamedataResponse'

export async function GET(
    request: NextRequest,
    res: NextResponse,
    { params }: { params: { serverAddress: string } }
) {
    const { serverAddress } = params

    const gamedataURL = encodeURI(
        `https://api.gamedata.okaeri.cloud/v1/minecraftjava/${serverAddress.replaceAll(
            '/',
            ''
        )}/info`
    )

    const response = await fetch(gamedataURL, {
        headers: {
            Authorization: `Bearer ${process.env.GAMEDATA_API_KEY}`,
        },
    })

    if (!response.ok)
        switch (response.status) {
            case 400:
                return NextResponse.json({})
        }

    const json: ApiResponse<GamedataResponse> = await response.json()

    return NextResponse.json(json)
}
