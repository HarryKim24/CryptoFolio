/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params
  const segments = path ?? []
  const targetUrl = `https://api.upbit.com/${segments.join('/')}`

  const searchParams = req.nextUrl.searchParams
  const query = Object.fromEntries(searchParams.entries())

  try {
    const { data } = await axios.get(targetUrl, {
      params: query,
      headers: {
        Accept: 'application/json',
      },
    })

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Proxy Error:', error.message)
    return NextResponse.json(
      { error: 'Proxy request failed', details: error.message },
      { status: 500 }
    )
  }
}