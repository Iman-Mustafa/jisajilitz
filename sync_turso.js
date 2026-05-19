const { createClient } = require('@libsql/client');
require('dotenv').config();

const url = process.env.TURSO_DATABASE_URL ? process.env.TURSO_DATABASE_URL.replace("libsql://", "https://") : "";
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("⚠️ Error: TURSO_DATABASE_URL na TURSO_AUTH_TOKEN lazima ziwekwe kwenye faili la .env");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  console.log("⏳ Inasawazisha database ya Turso (Jisajili)...");

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "Registration" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      "phoneNumber" TEXT NOT NULL,
      "nextOfKin1Name" TEXT NOT NULL,
      "nextOfKin1Phone" TEXT NOT NULL,
      "nextOfKin2Name" TEXT NOT NULL,
      "nextOfKin2Phone" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await client.execute(createTableQuery);
    console.log("✅ Meza ya 'Registration' imetengenezwa/imesawazishwa kikamilifu kwenye Turso DB!");
  } catch (error) {
    console.error("❌ Hitilafu imetokea wakati wa kusawazisha:", error);
  } finally {
    client.close();
  }
}

main();
