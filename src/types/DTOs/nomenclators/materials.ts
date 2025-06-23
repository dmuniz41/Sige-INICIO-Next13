import { MaterialNomenclators } from "@/db/migrations/schema";

export type InsertMaterialNomenclator = Omit<MaterialNomenclators, "code" | "created_at" | "updated_at">;
export type UpdateMaterialNomenclator = Omit<MaterialNomenclators, "code" | "created_at" | "updated_at">;

export type MaterialNomenclatorsFilters = {
  material_category?: string;
  material_name?: string;
  isDecrease?: boolean;
  isNotDecrease?: boolean;
};
