import jwt from 'jsonwebtoken'

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
  } catch (error) {
    return null
  }
}