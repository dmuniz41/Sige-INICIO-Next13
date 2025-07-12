import { Material } from "@/db/migrations/schema";

export type InsertMaterial = Omit<Material, "id" | "enterDate" | "modifyDate" | "serviceFeeMaterialNomenclatorId" | "totalValue">;
export type RemoveMaterial = { id: number; amount: number; warehouseId: number };
export type UpdateMaterial = Omit<Material, "id" |"warehouseId" | "enterDate" | "modifyDate" | "serviceFeeMaterialNomenclatorId" | "totalValue">;

export type MaterialFilters = {
  name?: string;
  category?: string;
  description?: string;
  enterDateStart?: string;
  enterDateEnd?: string;
  unitMeasure?: string;
  provider?: string;
};
