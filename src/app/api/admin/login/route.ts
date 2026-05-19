import { NextResponse } from 'next/server'
import crypto from 'crypto'
import db from '@/lib/db'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Tafadhali weka password ili kuingia.' },
        { status: 400 }
      )
    }

    // Auto-seed default credentials if AdminSettings table is empty
    let settings = await db.adminSettings.findUnique({
      where: { id: 'singleton' }
    })

    if (!settings) {
      const defaultHash = hashPassword('ALIX2026')
      settings = await db.adminSettings.create({
        data: {
          id: 'singleton',
          passwordHash: defaultHash,
          isFirstLogin: true
        }
      })
    }

    // Compare hashed passwords
    const inputHash = hashPassword(password)
    if (inputHash !== settings.passwordHash) {
      return NextResponse.json(
        { error: 'Password uliyoweka siyo sahihi. Jaribu tena!' },
        { status: 401 }
      )
    }

    // Login successful - Set secure HttpOnly session cookie
    const response = NextResponse.json({
      success: true,
      isFirstLogin: settings.isFirstLogin,
      message: 'Umeingia kwa mafanikio!'
    })

    // Set cookie valid for 7 days
    response.cookies.set({
      name: 'admin_session',
      value: 'authenticated',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Error in admin login API:', error)
    return NextResponse.json(
      { error: 'Hitilafu imetokea. Jaribu tena baadaye.' },
      { status: 500 }
    )
  }
}
