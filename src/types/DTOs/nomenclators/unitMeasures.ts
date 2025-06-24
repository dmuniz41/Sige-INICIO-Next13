import { UnitmeasureNomenclator } from "@/db/migrations/schema";

export type InsertUnitMeasureNomenclator = Omit<UnitmeasureNomenclator, "id" | "created_at" | "updated_at" | "deleted_at">;
export type UpdateUnitMeasureNomenclator = Omit<UnitmeasureNomenclator, "id" | "created_at" | "updated_at" | "deleted_at">;

export type MaterialNomenclatorsFilters = {
  name?: string;
};
