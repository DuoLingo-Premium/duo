import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'
import { parseJson } from '@/middleware/parseJson'

export async function POST(request: Request) {
  const parsedRequest = await parseJson(request)
  if (parsedRequest instanceof NextResponse) {
    return parsedRequest // This is an error response
  }

  try {
    const { email, password } = parsedRequest.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
    
    console.log('Generated token for login:', token) // Log the generated token

    return NextResponse.json({ token, user: { id: user.id, email: user.email } }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}