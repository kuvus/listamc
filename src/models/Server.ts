export type Server = {
    address: string
    ServerData: ServerData | null
    Promotion: Promotion | null
    _count: Count
}

export type ServerData = {
    id: number
    server_id: number
    players_online: number
    players_max: number
    version: string
    motd: string
    motd_text: string
    icon: string
    online: boolean
    last_update: string
}

export type Promotion = {
    id: number
    server_id: number
    date_start: string
    date_end: string
}

export type Count = {
    _count: {
        Vote: number
    }
}
