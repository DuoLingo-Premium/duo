import { NextResponse } from 'next/server'

export async function parseJson(request: Request) {
  try {
    const contentType = request.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const body = await request.json()
      return { ...request, body }
    }
    throw new Error('Content-Type must be application/json')
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }
}