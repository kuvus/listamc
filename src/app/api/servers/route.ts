import { NextApiRequest } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/prisma'

// GET /api/servers/?skip=[0..9+]&take=[0..9+]&orderBy=[orderBy]&sortOrder=[sortOrder]&promoted=[true|false]&count=[true|false]
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    if (searchParams.get('count'))
        return NextResponse.json({ count: await prisma.server.count() })

    const _skip = searchParams.get('skip')
    const _take = searchParams.get('take')
    const _orderBy = searchParams.get('orderBy')
    const _sortOrder = searchParams.get('sortOrder')
    const _promoted = searchParams.get('promoted')

    const skip = _skip ? parseInt(_skip) : undefined
    const take = _take ? parseInt(_take) : undefined

    if (_orderBy && !_orderBy.match(/^(players|votes)$/))
        return NextResponse.json(
            { message: 'Invalid orderBy, expected: [players|votes]' },
            { status: 400 }
        )

    if (_sortOrder && !_sortOrder.match(/^(asc|desc)$/))
        return NextResponse.json(
            { message: 'Invalid sort order, expected: [asc|desc]' },
            { status: 400 }
        )

    if (_promoted && !_promoted.match(/^(true|false)$/))
        return NextResponse.json(
            { message: 'Invalid promoted state, expected: [true|false]' },
            { status: 400 }
        )

    const promoted = _promoted === 'true'

    let orderBy: any = []

    if (!_orderBy) orderBy = undefined
    else
        switch (_orderBy) {
            case 'players':
                orderBy = [
                    {
                        ServerData: {
                            online: 'desc',
                            players_online:
                                _sortOrder === 'asc' ? 'asc' : 'desc',
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
                            _count: _sortOrder === 'asc' ? 'asc' : 'desc',
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
        skip: skip,
        take: take,
        where: promoted
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
