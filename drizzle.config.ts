import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./src/db/migrations/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    database: "DB_INICIO",
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "postgres",
    ssl: {
      rejectUnauthorized: false
    }
  },
  verbose: true, 
  strict: true 
});