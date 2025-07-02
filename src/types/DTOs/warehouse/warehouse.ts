import { Warehouse } from "@/db/migrations/schema";

export type InsertWarehouse = Omit<Warehouse, "id">;
export type UpdateWarehouse = Omit<Warehouse, "totalValue">;

export type WarehouseFilters = {
  name?: string;
};
