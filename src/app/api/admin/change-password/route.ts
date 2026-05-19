import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import db from '@/lib/db'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: Request) {
  try {
    // Verify session
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')

    if (!session || session.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Huruhusiwi kufanya mabadiliko haya bila kuingia kwenye mfumo.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { newPassword, confirmPassword } = body

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'Tafadhali jaza password zote mbili.' },
        { status: 400 }
      )
    }

    if (newPassword.trim().length < 6) {
      return NextResponse.json(
        { error: 'Password mpya lazima iwe na herufi zisizopungua sita.' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Password ulizoweka hazilingani. Hakikisha zinafanana!' },
        { status: 400 }
      )
    }

    const newHash = hashPassword(newPassword.trim())

    // Update password in database
    await db.adminSettings.upsert({
      where: { id: 'singleton' },
      update: {
        passwordHash: newHash,
        isFirstLogin: false
      },
      create: {
        id: 'singleton',
        passwordHash: newHash,
        isFirstLogin: false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Password imebadilishwa kikamilifu! Sasa unaweza kutumia mfumo.'
    })
  } catch (error) {
    console.error('Error in change password API:', error)
    return NextResponse.json(
      { error: 'Hitilafu imetokea wakati wa kubadilisha password. Jaribu tena.' },
      { status: 500 }
    )
  }
}
