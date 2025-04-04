import { MaterialNomenclators } from "@/db/migrations/schema";

export type InsertMaterialNomenclator = Omit<MaterialNomenclators, "code" | "created_at" | "updated_at">;
export type UpdateMaterialNomenclator = Omit<MaterialNomenclators, "created_at" | "updated_at">;
