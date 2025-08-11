#!/usr/bin/env ts-node

import { PrismaClient } from '../src/generated/prisma'
import { getGamedataRaw } from '../src/data/servers/getGamedata'
import { GamedataResponse } from '../src/models/gamedataResponse'

// Configuration
const CONFIG = {
    BATCH_SIZE: 100,
    MIN_UPDATE_INTERVAL_MINUTES: 5,
    RATE_LIMIT_TOKENS_PER_SECOND: 50, // PRO plan allows 50 requests per second
    PROACTIVE_COOLDOWN_THRESHOLD: 1, // Pause when 1 or fewer requests remaining
} as const

interface RateLimitInfo {
    remaining: number
    limit: number
    resetTime: Date
    retryAfter?: number
}

class ServerStatusUpdater {
    private prisma: PrismaClient
    private isRunning = false

    constructor() {
        this.prisma = new PrismaClient()
    }

    async start(): Promise<void> {
        if (this.isRunning) {
            console.log('Update process is already running')
            return
        }

        this.isRunning = true
        console.log('🚀 Starting server status update process...')

        try {
            await this.updateAllServers()
        } catch (error) {
            console.error('❌ Fatal error in update process:', error)
        } finally {
            this.isRunning = false
            await this.prisma.$disconnect()
            console.log('✅ Update process completed')
        }
    }

    private async updateAllServers(): Promise<void> {
        let skip = 0
        let processedCount = 0

        while (true) {
            // Fetch servers in batches
            const servers = await this.prisma.server.findMany({
                select: {
                    id: true,
                    address: true,
                    ServerData: {
                        select: {
                            last_update: true,
                        },
                    },
                },
                skip,
                take: CONFIG.BATCH_SIZE,
                orderBy: {
                    id: 'asc',
                },
            })

            if (servers.length === 0) {
                console.log(`📊 Total servers processed: ${processedCount}`)
                break
            }

            console.log(
                `📦 Processing batch: ${skip + 1}-${skip + servers.length}`
            )

            // Process each server in the batch sequentially to respect rate limits
            for (const server of servers) {
                if (await this.shouldSkipServer(server)) {
                    console.log(
                        `⏭️  Skipping ${server.address} (recently updated)`
                    )
                    continue
                }

                await this.updateServerStatus(server)
                processedCount++
            }

            skip += CONFIG.BATCH_SIZE
        }
    }

    private async shouldSkipServer(server: any): Promise<boolean> {
        if (!server.ServerData?.last_update) {
            return false // Never updated, should update
        }

        const lastUpdate = new Date(server.ServerData.last_update)
        const minUpdateTime = new Date(
            Date.now() - CONFIG.MIN_UPDATE_INTERVAL_MINUTES * 60 * 1000
        )

        return lastUpdate > minUpdateTime
    }

    private async updateServerStatus(server: any): Promise<void> {
        const startTime = Date.now()

        try {
            console.log(`🔄 Updating ${server.address}...`)

            const response = await getGamedataRaw(server.address)
            const rateLimitInfo = this.parseRateLimitHeaders(response)

            // Handle rate limiting
            await this.handleRateLimit(response, rateLimitInfo)

            if (response.ok) {
                const gamedata: GamedataResponse = await response.json()
                await this.updateServerInDatabase(server.id, gamedata)

                const duration = Date.now() - startTime
                console.log(`✅ Updated ${server.address} (${duration}ms)`)
            } else {
                await this.handleServerError(server, response)
            }
        } catch (error) {
            console.error(`❌ Error updating ${server.address}:`, error.message)
            // Mark server as offline in case of error
            await this.markServerOffline(server.id)
        }
    }

    private parseRateLimitHeaders(response: Response): RateLimitInfo {
        const remaining = parseInt(
            response.headers.get('RateLimit-Remaining') || '0'
        )
        const limit = parseInt(response.headers.get('RateLimit-Limit') || '50')
        const resetTime = new Date(
            response.headers.get('RateLimit-Reset') || Date.now()
        )
        const retryAfter = response.headers.get('RateLimit-Retry-After')
            ? parseInt(response.headers.get('RateLimit-Retry-After')!)
            : undefined

        return { remaining, limit, resetTime, retryAfter }
    }

    private async handleRateLimit(
        response: Response,
        rateLimitInfo: RateLimitInfo
    ): Promise<void> {
        // Handle explicit retry-after header (API overload protection)
        if (rateLimitInfo.retryAfter) {
            console.log(
                `⏸️  Rate limit retry-after: waiting ${rateLimitInfo.retryAfter}s`
            )
            await this.sleep(rateLimitInfo.retryAfter * 1000)
            return
        }

        // Handle 429 Too Many Requests
        if (response.status === 429) {
            const waitTime = rateLimitInfo.retryAfter || 60 // Default to 60s if no retry-after
            console.log(`⏸️  Rate limit exceeded (429): waiting ${waitTime}s`)
            await this.sleep(waitTime * 1000)
            return
        }

        // Proactive cooldown when approaching rate limit
        if (rateLimitInfo.remaining <= CONFIG.PROACTIVE_COOLDOWN_THRESHOLD) {
            const cooldownTime = Math.ceil(
                1000 / CONFIG.RATE_LIMIT_TOKENS_PER_SECOND
            )
            console.log(
                `⏸️  Proactive cooldown: waiting ${cooldownTime}ms (${rateLimitInfo.remaining} requests remaining)`
            )
            await this.sleep(cooldownTime)
        }
    }

    private async updateServerInDatabase(
        serverId: number,
        gamedata: GamedataResponse
    ): Promise<void> {
        if ('status' in gamedata) {
            // Error response from API
            await this.markServerOffline(serverId)
            return
        }

        // Successful response - update server data
        await this.prisma.serverData.upsert({
            where: { server_id: serverId },
            update: {
                players_online: gamedata.players.online,
                players_max: gamedata.players.max,
                version: gamedata.version.raw.name,
                motd: gamedata.motd.raw,
                motd_text: gamedata.motd.text,
                icon: gamedata.favicon.base64,
                online: true,
                last_update: new Date(),
            },
            create: {
                server_id: serverId,
                players_online: gamedata.players.online,
                players_max: gamedata.players.max,
                version: gamedata.version.raw.name,
                motd: gamedata.motd.raw,
                motd_text: gamedata.motd.text,
                icon: gamedata.favicon.base64,
                online: true,
                last_update: new Date(),
            },
        })
    }

    private async markServerOffline(serverId: number): Promise<void> {
        await this.prisma.serverData.upsert({
            where: { server_id: serverId },
            update: {
                online: false,
                last_update: new Date(),
            },
            create: {
                server_id: serverId,
                players_online: 0,
                players_max: 0,
                version: 'Unknown',
                motd: '',
                motd_text: '',
                icon: '',
                online: false,
                last_update: new Date(),
            },
        })
    }

    private async handleServerError(
        server: any,
        response: Response
    ): Promise<void> {
        const statusText = response.statusText || 'Unknown error'
        console.log(
            `⚠️  Server ${server.address} error: ${response.status} ${statusText}`
        )
        await this.markServerOffline(server.id)
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

// Main execution
if (require.main === module) {
    const updater = new ServerStatusUpdater()
    updater.start().catch(console.error)
}

export { ServerStatusUpdater }
