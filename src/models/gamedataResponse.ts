export type GamedataResponse = {
    address: ServerRealAddress
    version: MinecraftJavaVersion
    players: PLayers
    favicon: Favicon
    motd: Motd
    query: any
}

type ServerRealAddress = {
    ip: string
    port: number
    wildcard: boolean
}

type MinecraftJavaVersion = {
    raw: Version
    range: {
        display: string
        minimal_version: Version
        maximal_version: Version
    }
}

type Version = {
    name: string
    protocol: number
    full_name?: string
}

type PLayers = {
    max: number
    online: number
    list: string[]
}

type Favicon = {
    generic: boolean
    base64: string
    url: string
}

type Motd = {
    raw: string
    text: string
    normalized: string
    html: string
}
