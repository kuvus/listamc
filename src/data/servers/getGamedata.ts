'use server'

import { GamedataResponse } from '@/models/gamedataResponse'

export default async function getGamedata(
    serverAddress: string
): Promise<GamedataResponse> {
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

    // if (!response.ok) {
    //     const body = await response.json()
    //
    //     switch (response.status) {
    //         case 400:
    //             return body
    //     }
    // }

    return await response.json()
}
