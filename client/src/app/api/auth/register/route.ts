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
    const { firstName, lastName, email, password } = parsedRequest.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
    
    console.log('Generated token:', token) // Log the generated token

    return NextResponse.json({ token, user: { id: user.id, email: user.email } }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}