import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string[] } }
) {
    // console.log(params.slug)

    return NextResponse.redirect(params.slug.join('/'))
}
