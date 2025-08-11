import { MongoClient } from 'mongodb'
import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

const mongoUri = process.env.MONGO_DATABASE_URL
if (!mongoUri) {
    console.error('MONGO_DATABASE_URL environment variable is not set.')
    process.exit(1)
}
const mongoClient = new MongoClient(mongoUri)

type AnyRecord = Record<string, any>

function toDate(value: any): Date | undefined {
    if (!value) return undefined
    const d = value instanceof Date ? value : new Date(value)
    return isNaN(d.getTime()) ? undefined : d
}

function coalesce<T>(...values: T[]): T | undefined {
    for (const v of values) {
        if (v !== undefined && v !== null) return v as T
    }
    return undefined
}

function extractPlayers(source: AnyRecord): { online: number; max: number } {
    // Try explicit numeric fields first
    const onlineCandidates = [
        source.players_online,
        source.playersOnline,
        source.playerCount,
        source.players?.online,
        source.players?.current,
    ].filter(v => typeof v === 'number')

    const maxCandidates = [
        source.players_max,
        source.playersMax,
        source.maxPlayers,
        source.players?.max,
        source.players?.maximum,
    ].filter(v => typeof v === 'number')

    let online = onlineCandidates.length ? Number(onlineCandidates[0]) : NaN
    let max = maxCandidates.length ? Number(maxCandidates[0]) : NaN

    // Fallback to string like "12/100"
    if ((isNaN(online) || isNaN(max)) && typeof source.players === 'string') {
        const [a, b] = source.players
            .split('/')
            .map((s: string) => parseInt(s.trim(), 10))
        if (isNaN(online)) online = a
        if (isNaN(max)) max = b
    }

    // Final normalization
    online = Number.isFinite(online) ? online : 0
    max = Number.isFinite(max) ? max : 0
    return { online, max }
}

async function main() {
    try {
        await mongoClient.connect()
        console.log('Connected to MongoDB')

        const db = mongoClient.db()

        // Migrate Servers from new collection name
        const serversCollection = db.collection<AnyRecord>('servermodels')
        const servers = await serversCollection.find({}).toArray()

        console.log(`Found ${servers.length} servers to migrate`)

        for (const doc of servers) {
            try {
                const address = coalesce<string>(doc.name, doc.ip, doc.address)
                if (!address) {
                    console.warn('Skipping server without address/ip:', doc._id)
                    continue
                }

                // Avoid duplicates if script is re-run
                const existing = await prisma.server.findUnique({
                    where: { address },
                })
                if (existing) {
                    console.log(`Server already exists, skipping: ${address}`)
                    continue
                }

                const createdAt = coalesce<Date | string>(
                    doc.created_at,
                    doc.createdAt
                )
                const updatedAt = coalesce<Date | string>(
                    doc.updated_at,
                    doc.updatedAt
                )
                const { online: players_online, max: players_max } =
                    extractPlayers(doc)

                const version =
                    coalesce<string>(doc.version, doc.server_version) ?? ''
                const motd =
                    coalesce<string>(doc.motd, doc.motd_text, doc.rawMotd) ?? ''
                const motd_text =
                    coalesce<string>(doc.motd_text, doc.rawMotd, doc.motd) ?? ''
                const icon = coalesce<string>(doc.icon, '') ?? ''
                const onlineVal = coalesce<any>(doc.online, doc.status)
                const online =
                    typeof onlineVal === 'string'
                        ? onlineVal.toLowerCase() === 'online'
                        : Boolean(onlineVal)

                // Promotion mapping
                const promoted = Boolean(
                    coalesce(doc.promoted, doc.promotion?.enabled)
                )
                const promoStartRaw = coalesce<any>(
                    doc.promotedStart,
                    doc.promotion?.start,
                    doc.promotion?.date_start
                )
                const promoLengthDays =
                    coalesce<number>(
                        doc.promotedLength,
                        doc.promotion?.lengthDays,
                        doc.promotion?.days,
                        0
                    ) ?? 0
                const promoEndRaw =
                    doc.promotion?.end ?? doc.promotion?.date_end

                const promoStart =
                    toDate(promoStartRaw) ?? toDate(createdAt) ?? new Date()
                const promoEnd =
                    toDate(promoEndRaw) ??
                    new Date(
                        promoStart.getTime() +
                            promoLengthDays * 24 * 60 * 60 * 1000
                    )

                const newServer = await prisma.server.create({
                    data: {
                        address,
                        createdAt: toDate(createdAt) ?? new Date(),
                        ServerData: {
                            create: {
                                players_online,
                                players_max,
                                version,
                                motd,
                                motd_text,
                                icon,
                                online,
                                last_update: toDate(updatedAt) ?? new Date(),
                            },
                        },
                        Promotion: promoted
                            ? {
                                  create: {
                                      date_start: promoStart,
                                      date_end: promoEnd,
                                  },
                              }
                            : undefined,
                    },
                })
                console.log(`Migrated server: ${newServer.address}`)
            } catch (e) {
                console.error('Failed to migrate a server document', e)
            }
        }

        // Migrate Stats from new collection name
        const statsCollection = db.collection<AnyRecord>('statsmodels')
        const stats = await statsCollection.find({}).toArray()

        console.log(`Found ${stats.length} stats documents to migrate`)

        for (const statDoc of stats) {
            try {
                const serverAddress = coalesce<string>(
                    statDoc.name,
                    statDoc.server,
                    statDoc.address,
                    statDoc.ip
                )
                if (!serverAddress) {
                    console.warn(
                        'Skipping stats without server identifier:',
                        statDoc._id
                    )
                    continue
                }

                const server = await prisma.server.findUnique({
                    where: { address: serverAddress },
                })
                if (!server) {
                    console.warn(
                        `No matching server found for stats: ${serverAddress}`
                    )
                    continue
                }

                const items: AnyRecord[] = Array.isArray(statDoc.stats)
                    ? statDoc.stats
                    : Array.isArray(statDoc.history)
                      ? statDoc.history
                      : []

                if (!items.length) {
                    console.log(
                        `No stats entries for ${serverAddress}, skipping`
                    )
                    continue
                }

                const historyData = items.map((s: AnyRecord) => ({
                    server_id: server.id.toString(),
                    players:
                        Number(
                            coalesce<number>(s.players, s.online, s.count, 0)
                        ) ?? 0,
                    timestamp: toDate(
                        coalesce<any>(s.date, s.timestamp, s.time, new Date())
                    )!,
                }))

                await prisma.serverHistory.createMany({
                    data: historyData,
                })
                console.log(`Migrated stats for server: ${serverAddress}`)
            } catch (e) {
                console.error('Failed to migrate a stats document', e)
            }
        }

        console.log('Migration completed successfully.')
    } catch (error) {
        console.error('Migration failed:', error)
    } finally {
        await mongoClient.close()
        await prisma.$disconnect()
    }
}

main()
