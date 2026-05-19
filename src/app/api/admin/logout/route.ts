import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Umetoka kwenye mfumo kikamilifu!'
    })

    // Clear session cookie
    response.cookies.delete('admin_session')

    return response
  } catch (error) {
    console.error('Error in admin logout API:', error)
    return NextResponse.json(
      { error: 'Hitilafu imetokea. Jaribu tena.' },
      { status: 500 }
    )
  }
}
