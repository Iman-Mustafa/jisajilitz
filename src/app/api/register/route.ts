import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      phoneNumber, 
      nextOfKin1Name, 
      nextOfKin1Phone,
      nextOfKin2Name,
      nextOfKin2Phone
    } = body

    // Swahili-first validation rules for all 7 fields
    if (
      !firstName || !lastName || !phoneNumber || 
      !nextOfKin1Name || !nextOfKin1Phone || 
      !nextOfKin2Name || !nextOfKin2Phone
    ) {
      return NextResponse.json(
        { error: 'Tafadhali jaza maeneo yote kwenye fomu ili kusajili (ikiwemo wasimamizi wote wawili).' },
        { status: 400 }
      )
    }

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Majina lazima yawe na herufi zisizopungua mbili.' },
        { status: 400 }
      )
    }

    if (phoneNumber.trim().length < 8 || nextOfKin1Phone.trim().length < 8 || nextOfKin2Phone.trim().length < 8) {
      return NextResponse.json(
        { error: 'Hakikisha namba zote za simu zilizowekwa ni sahihi.' },
        { status: 400 }
      )
    }

    // Insert record in SQLite Database
    const newRegistration = await db.registration.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        nextOfKin1Name: nextOfKin1Name.trim(),
        nextOfKin1Phone: nextOfKin1Phone.trim(),
        nextOfKin2Name: nextOfKin2Name.trim(),
        nextOfKin2Phone: nextOfKin2Phone.trim(),
      },
    })

    return NextResponse.json(
      { 
        message: 'Hongera! Usajili umekamilika kikamilifu.', 
        data: newRegistration 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in /api/register:', error)
    return NextResponse.json(
      { error: 'Hitilafu imetokea kwenye mfumo wa database. Jaribu tena baadaye.' },
      { status: 500 }
    )
  }
}
