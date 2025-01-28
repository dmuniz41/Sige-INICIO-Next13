import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./migrations/schema"; // Import the generated schema

const connectionString = process.env.POSTGRES_DB_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
