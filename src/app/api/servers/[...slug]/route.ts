import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/prisma'
import { list } from 'postcss'

// /api/servers/[range]/sortBy/sortOrder/promoted
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string[] } }
) {
    console.log(params.slug)
    if (params.slug.length !== 4 && params.slug[0] !== 'count')
        return NextResponse.json(
            { error: 'Invalid number of parameters' },
            { status: 400 }
        )

    if (params.slug[0] === 'count')
        return NextResponse.json({ count: await prisma.server.count() })

    const range = params.slug[0]
    let sortBy = params.slug[1]
    let sortOrder = params.slug[2]
    let promoted = params.slug[3]

    // check if range matches regex
    if (!range.match(/^[0-9]+-[0-9]+$/))
        return NextResponse.json({ error: 'Invalid range' }, { status: 400 })

    // check if sortBy matches regex
    if (!sortBy.match(/^(players|votes)$/))
        return NextResponse.json({ error: 'Invalid sortBy' }, { status: 400 })

    // check if sortOrder matches regex
    if (!sortOrder.match(/^(asc|desc)$/))
        return NextResponse.json(
            { error: 'Invalid sort order' },
            { status: 400 }
        )

    // check if promoted matches regex
    if (!promoted.match(/^(true|false)$/))
        return NextResponse.json(
            { error: 'Invalid promoted state' },
            { status: 400 }
        )

    const rangeParsed = range.split('-').map(Number)

    let orderBy: any = []

    const promotedParsed = promoted === 'true'

    switch (sortBy) {
        case 'players':
            orderBy = [
                {
                    ServerData: {
                        online: 'desc',
                        players_online: sortOrder === 'asc' ? 'asc' : 'desc',
                    },
                },
            ]
            break
        case 'votes':
            orderBy = [
                {
                    ServerData: {
                        online: 'desc',
                    },
                },
                {
                    Vote: {
                        _count: sortOrder === 'asc' ? 'asc' : 'desc',
                    },
                },
            ]
    }

    const servers = await prisma.server.findMany({
        select: {
            address: true,
            ServerData: true,
            _count: {
                select: {
                    Vote: {
                        where: {
                            date: {
                                gte: new Date(
                                    Date.now() - 1000 * 60 * 60 * 24 * 7 * 2
                                ),
                            },
                        },
                    },
                },
            },
            Promotion: true,
        },
        orderBy: orderBy,
        skip: rangeParsed[0],
        take: rangeParsed[1] - rangeParsed[0],
        where: promotedParsed
            ? {
                  Promotion: {
                      date_end: {
                          gte: new Date(),
                      },
                  },
              }
            : {
                  OR: [
                      {
                          Promotion: null,
                      },
                      {
                          Promotion: {
                              date_end: {
                                  lt: new Date(),
                              },
                          },
                      },
                  ],
              },
    })

    return NextResponse.json(servers || [])
}
