import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, phoneNumber, nextOfKinName, nextOfKinPhone } = body

    // Swahili-first validation rules
    if (!firstName || !lastName || !phoneNumber || !nextOfKinName || !nextOfKinPhone) {
      return NextResponse.json(
        { error: 'Tafadhali jaza maeneo yote kwenye fomu ili kusajili.' },
        { status: 400 }
      )
    }

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Majina lazima yawe na herufi zisizopungua mbili.' },
        { status: 400 }
      )
    }

    if (phoneNumber.trim().length < 8 || nextOfKinPhone.trim().length < 8) {
      return NextResponse.json(
        { error: 'Namba za simu zilizowekwa sio sahihi.' },
        { status: 400 }
      )
    }

    // Insert record in SQLite Database
    const newRegistration = await db.registration.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        nextOfKinName: nextOfKinName.trim(),
        nextOfKinPhone: nextOfKinPhone.trim(),
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
