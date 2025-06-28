import { faker } from "@faker-js/faker";
import "dotenv/config";

import { db } from "../src/db/drizzle"; // Adjust path to your Drizzle DB instance
import { unitMeasureNomenclators } from "../src/db/migrations/schema"; // Adjust path to your Drizzle schema

async function seedUnitMeasures() {
  const numberOfRecords = 50; // You can change this to generate more or fewer records
  const mockData = [];

  console.log(`Generating ${numberOfRecords} mock unit measure nomenclators...`);

  for (let i = 0; i < numberOfRecords; i++) {
    mockData.push({
        name: faker.word.noun({ length: { min: 5, max: 15 } }) + (i % 2 === 0 ? " (Metric)" : " (Imperial)"),
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
    });
  }

  console.log("Inserting mock data into public.unit_measure_nomenclators...");

  try {
    // Drizzle's insert method
    await db.insert(unitMeasureNomenclators).values(mockData);

    console.log(`${numberOfRecords} unit measure nomenclators inserted successfully!`);
  } catch (error) {
    console.error("Error inserting mock data:", error);
  } finally {
    // It's good practice to close the database connection if your DB client needs it.
    // Drizzle usually manages pooling, but for a standalone script,
    // ensure resources are released if your setup requires explicit closing.
    // For many Drizzle setups, the connection will implicitly close as the script exits.
    // If you're using a direct `pg` client, you might call `db.end()` or similar.
  }
}

seedUnitMeasures().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
