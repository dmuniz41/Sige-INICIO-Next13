import { Material } from "@/db/migrations/schema";

export type InsertMaterial = Omit<Material, "id" | "enterDate" | "modifyDate">;
export type RemoveMaterial = { id: number; amount: number; warehouseId: number };
// export type UpdateMaterial = Omit<Material, "totalValue">;
