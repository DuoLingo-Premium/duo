import { NextResponse } from 'next/server'
import { verifyToken } from '@/utils/auth'

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)

  if (!decoded) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  // Proceed with the protected route logic
  return NextResponse.json({ message: 'Access granted to protected route', userId: decoded.userId })
}