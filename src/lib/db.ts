import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_wbhkOcvSK7Y9@ep-autumn-lab-alswu7mg-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  
  const pool = new Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);
  
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
