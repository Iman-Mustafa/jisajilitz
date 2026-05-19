import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

let db: PrismaClient

// Detect production (Vercel) or explicit Turso override env
const isProduction = process.env.NODE_ENV === 'production'
const useTurso = process.env.USE_TURSO === 'true'

if (isProduction || useTurso) {
  // production or Turso override - use LibSQL driver adapter for Turso Cloud
  const config = {
    url: process.env.TURSO_DATABASE_URL ? process.env.TURSO_DATABASE_URL.replace("libsql://", "https://") : "",
    authToken: process.env.TURSO_AUTH_TOKEN,
  }

  const adapter = new PrismaLibSql(config)
  db = new PrismaClient({ adapter })
  console.log("⚡ [Database] Mfumo umeunganishwa moja kwa moja na Turso Cloud DB (Production).");
} else {
  // Local development - use standard native SQLite engine for maximum local speed
  const globalForPrisma = global as unknown as { db: PrismaClient }
  
  if (!globalForPrisma.db) {
    globalForPrisma.db = new PrismaClient()
  }
  db = globalForPrisma.db
  console.log("💻 [Database] Mfumo umeunganishwa na SQLite Local dev.db.");
}

export default db
