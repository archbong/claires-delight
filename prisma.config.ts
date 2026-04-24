
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config(); // loads .env
dotenv.config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
