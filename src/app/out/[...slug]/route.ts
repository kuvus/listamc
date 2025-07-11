import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string[] }> }) {
    const params = await props.params;
    return NextResponse.redirect(params.slug.join('/'))
}
