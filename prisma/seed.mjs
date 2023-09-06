import { PrismaClient } from '@prisma/client'
import md5 from 'md5'

const prisma = new PrismaClient()

async function main() {
    const server = await prisma.server.upsert({
        where: {
            address: 'localhost',
        },
        update: {},
        create: {
            address: 'localhost',
        },
    })

    const server2 = await prisma.server.upsert({
        where: {
            address: 'localhos2t',
        },
        update: {},
        create: {
            address: 'localhos2t',
        },
    })

    const vote = await prisma.vote.upsert({
        where: {
            id: '1',
        },
        update: {},
        create: {
            server_id: server.id,
            hash: md5('localhost'),
        },
    })

    const serverData = await prisma.serverData.upsert({
        where: {
            server_id: server.id,
        },
        update: {},
        create: {
            server_id: server.id,
            players_online: 69,
            players_max: 420,
            version: '1.16.5',
            motd: 'A Minecraft Server<br>test',
            motd_text: 'A Minecraft Server\\ntest',
            icon: 'https://okaeriusercontent.stream/YrywIFGU6ii4OfyVMUcZpga9LnGJP6NmbGA9ciiUW7ysUR9l.png',
            online: true,
        },
    })

    await prisma.serverData.upsert({
        where: {
            server_id: server2.id,
        },
        update: {},
        create: {
            server_id: server2.id,
            players_online: 69,
            players_max: 420,
            version: '1.16.5',
            motd: 'A Minecraft Server<br>test',
            motd_text: 'A Minecraft Server\\ntest',
            icon: 'https://okaeriusercontent.stream/YrywIFGU6ii4OfyVMUcZpga9LnGJP6NmbGA9ciiUW7ysUR9l.png',
            online: false,
        },
    })

    await prisma.promotion.upsert({
        where: {
            server_id: server2.id,
        },
        update: {},
        create: {
            server_id: server2.id,
            date_start: new Date(),
            date_end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
    })
}

main()
    .then(() => prisma.$disconnect())
    .catch(async e => {
        console.error(e)
        await prisma.$disconnect()
        process.exit()
    })
