import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   dialect: "postgresql",
//   schema: "./src/schema/*",
//   dbCredentials: {
//     database: "DB_INICIO",
//     host: "localhost",
//     port: 5432,
//     user: "postgres",
//     password: "postgres"
//   }
// });

export default defineConfig({
  schema: "./src/db/schema.ts", // Path to your schema file
  out: "./src/db/migrations",
  dialect: "postgresql", // Use "pg" as the driver (even for the `postgres` package)
  dbCredentials: {
    database: "DB_INICIO",
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    ssl: {
      rejectUnauthorized: false
    }
  },
  verbose: true, // Optional: Enable detailed logging
  strict: true // Optional: Enable strict schema checks,
});