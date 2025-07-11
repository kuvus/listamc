import { JsonValue } from '@prisma/client/runtime/library'

export type Server = {
    address: string
    ServerData?: ServerData | null
    Promotion?: Promotion | null
    ServerMetadata?: ServerMetadata | null
    _count: Count
}

export type ServerData = {
    id: string
    server_id: number
    players_online: number
    players_max: number
    version: string
    motd: string
    motd_text: string
    icon: string
    online: boolean
    last_update: Date
}

export type Promotion = {
    id: string
    server_id: number
    date_start: Date
    date_end: Date
}

export type Count = {
    Vote: number
}

export type ServerMetadata = {
    id: string
    server_id: number
    description: string | null
    gamemodes: JsonValue
    urls: JsonValue
}
