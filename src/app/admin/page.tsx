import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import crypto from 'crypto'
import AdminDashboard from './AdminDashboard'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export default async function Page() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')

  // 1. Check authentication cookie
  if (!session || session.value !== 'authenticated') {
    redirect('/admin/login')
  }

  // 2. Check if isFirstLogin is active in database
  let settings = await db.adminSettings.findUnique({
    where: { id: 'singleton' }
  })

  // Auto-seed default credentials if AdminSettings table is empty
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

  if (settings.isFirstLogin) {
    redirect('/admin/change-password')
  }

  // 3. Render Dashboard if fully authenticated & password changed
  return <AdminDashboard />
}
