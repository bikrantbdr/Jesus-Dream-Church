import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

  // Dynamic swap to PostgreSQL/Neon if a cloud connection string is provided
  if (dbUrl.startsWith("postgres:") || dbUrl.startsWith("postgresql:")) {
    try {
      const { Pool } = require("@neondatabase/serverless");
      const { PrismaNeon } = require("@prisma/adapter-neon");
      
      const pool = new Pool({ connectionString: dbUrl });
      const adapter = new PrismaNeon(pool);
      return new PrismaClient({ adapter });
    } catch (err) {
      console.error(
        "Failed to initialize PostgreSQL/Neon adapter. Please ensure packages are installed.",
        err
      );
    }
  }

  // Default SQLite adapter for lightweight, zero-setup local dev.
  // In Prisma 7, PrismaBetterSqlite3 handles client initialization internally 
  // via a url configuration object rather than requiring manually constructed better-sqlite3 instances.
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}
