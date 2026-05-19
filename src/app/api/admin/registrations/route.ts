import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    let registrations;

    if (query.trim()) {
      const searchQuery = query.trim()
      // Case-insensitive query against multiple fields in SQLite
      registrations = await db.registration.findMany({
        where: {
          OR: [
            { firstName: { contains: searchQuery } },
            { lastName: { contains: searchQuery } },
            { phoneNumber: { contains: searchQuery } },
            { nextOfKinName: { contains: searchQuery } },
            { nextOfKinPhone: { contains: searchQuery } },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      registrations = await db.registration.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    return NextResponse.json({ data: registrations }, { status: 200 })
  } catch (error) {
    console.error('Error in /api/admin/registrations GET:', error)
    return NextResponse.json(
      { error: 'Hitilafu imetokea wakati wa kupakia taarifa za usajili.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Namba ya kitambulisho (ID) inahitajika ili kufuta.' },
        { status: 400 }
      )
    }

    // Verify if it exists first
    const exists = await db.registration.findUnique({
      where: { id },
    })

    if (!exists) {
      return NextResponse.json(
        { error: 'Usajili unaojaribu kufuta haupatikani.' },
        { status: 404 }
      )
    }

    // Delete record
    await db.registration.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Usajili umefutwa kikamilifu kwenye faharasa yetu.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in /api/admin/registrations DELETE:', error)
    return NextResponse.json(
      { error: 'Hitilafu imetokea wakati wa kufuta taarifa ya usajili.' },
      { status: 500 }
    )
  }
}
