import { StockMovement } from "@/db/migrations/schema";

export type InsertStockMovement = Omit<StockMovement, "id" | "userName" | "movementDate" | "unitMeasure">;
