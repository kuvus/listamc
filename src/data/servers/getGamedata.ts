'use server'

import { GamedataResponse } from '@/models/gamedataResponse'

export default async function getGamedata(
    serverAddress: string
): Promise<GamedataResponse> {
    const response = await getGamedataRaw(serverAddress)

    if (!response.ok) {
        const body = await response.text()
        throw new Error(body)
    }

    return response.json()
}

// New function that returns the raw Response object for rate limit header access
export async function getGamedataRaw(serverAddress: string): Promise<Response> {
    const gamedataURL = encodeURI(
        `https://api.gamedata.okaeri.cloud/v1/minecraftjava/${serverAddress.replaceAll(
            '/',
            ''
        )}/info`
    )

    return fetch(gamedataURL, {
        headers: {
            Authorization: `Bearer ${process.env.GAMEDATA_API_KEY}`,
        },
    })
}
