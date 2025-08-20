import { relations } from "drizzle-orm";
import { pgTable, varchar, integer, numeric, serial, boolean, text, timestamp, doublePrecision, pgView } from "drizzle-orm/pg-core";

//* TABLAS *//
export const users = pgTable("users", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
  lastName: varchar(),
  key: varchar().notNull(),
  userName: varchar(),
  privileges: varchar().array(),
  area: varchar().array(),
  password: varchar().notNull()
});

export const materialNomenclators = pgTable("material_nomenclators", {
  code: serial().primaryKey().notNull(),
  material_category: varchar({ length: 100 }).notNull(), // Categoria del material (Ej: PVC, Acrilico, Lona, etc..)
  material_name: varchar({ length: 100 }).notNull(), // Nombre de la variante de la catergoria selceccionada (3mm, Rojo mate, mech, etc..)
  created_at: timestamp().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  isDecrease: boolean().notNull() // Indica si el los materiales de esa categoria son gastables o no
});

export const providerNomenclators = pgTable("provider_nomenclators", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 100 }).notNull(),
  contact: varchar({ length: 20 }).notNull(), // Numero de telefono para contactar con el proveedor
  created_at: timestamp().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(), 
});

export const unitMeasureNomenclators = pgTable("unit_measure_nomenclators", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 100 }).notNull(), // (Ej: m2, cm, m, litros, etc..)
  created_at: timestamp().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp()
});

export const nomenclators = pgTable("nomenclators", {
  id: serial().primaryKey().notNull(),
  category: varchar().notNull(), // Indica el tipo de nomenclador(Unidad de Medida, Moneda, ....)
  categoryCode: varchar().notNull(), // Identificador de la categoria del nomenclador(Unidad de Medida(N_UM), Moneda(N_MO), ....)
  value: varchar().notNull()
});

export const clientNomenclators = pgTable("client_nomenclators", {
  idNumber: serial().primaryKey().notNull(), // Numero de cliente
  name: varchar({ length: 255 }).notNull(),
  phoneNumber: numeric(),
  contact: varchar({ length: 255 }),
  address: varchar({ length: 255 }),
  email: varchar({ length: 255 })
});

export const representativeNomenclators = pgTable("representative_nomenclators", {
  idNumber: serial().primaryKey().notNull(), // Numero de representante
  name: varchar({ length: 255 }).notNull(),
  phoneNumber: varchar({ length: 255 }).notNull(),
  percentage: integer().notNull(), // Porcentaje de representacion
  contact: varchar({ length: 255 }),
  address: varchar({ length: 255 }),
  email: varchar({ length: 255 })
});

export const warehouse = pgTable("warehouse", {
  id: serial().primaryKey().notNull(),
  name: text("name").notNull(),
  totalValue: doublePrecision("totalValue").notNull()
});

export const serviceFeeMaterialNomenclators = pgTable("service_fee_material_nomenclators", {
  id: serial("id").primaryKey().notNull(),
  code: varchar("name", { length: 100 }).notNull(),
  displayName: varchar("display_name", { length: 100 }),
  costPerUnit: doublePrecision("costPerUnit").notNull(),
  unitMeasure: varchar("unit_measure", { length: 25 }).notNull()
});

export const materials = pgTable("materials", {
  id: serial("id").primaryKey().notNull(),
  name: varchar({ length: 50 }).notNull(),
  category: varchar({ length: 25 }).notNull(),
  description: varchar({ length: 25 }).notNull(),
  enterDate: timestamp("enterDate").defaultNow(),
  modifyDate: timestamp("modifyDate").defaultNow(),
  unitMeasure: text("unitMeasure").notNull(),
  costPerUnit: doublePrecision("costPerUnit").notNull(),
  stock: doublePrecision("stock").notNull(),
  minimumExistence: doublePrecision("minimumExistence").notNull(),
  totalValue: doublePrecision("totalValue").notNull(),
  provider: varchar({ length: 25 }).notNull(),
  warehouseId: integer("warehouse_id")
    .references(() => warehouse.id)
    .notNull(),
  serviceFeeMaterialNomenclatorId: integer("service_fee_material_nomenclator_id")
    .references(() => serviceFeeMaterialNomenclators.id)
    .notNull()
});

export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey().notNull(),
  materialId: integer("material_id")
    .references(() => materials.id)
    .notNull(),
  warehouseId: integer("warehouse_id")
    .references(() => warehouse.id)
    .notNull(),
  quantityChange: doublePrecision("quantity_change").notNull(),
  movementType: varchar("movement_type", { length: 25 }).notNull(), // "ADDED", "REMOVED"
  movementDate: timestamp("movement_date").defaultNow(),
  unitMeasure: varchar("unit_measure", { length: 25 }),
  notes: text("notes"),
  userName: varchar("user_name", { length: 50 }).notNull()
});

//* RELACIONES *//
export const warehouseRelations = relations(warehouse, ({ many }) => ({
  materials: many(materials), // A warehouse can have many materials
  stockMovements: many(stockMovements) // A warehouse can have many stock movements
}));

export const serviceFeeMaterialNomenclatorRelations = relations(serviceFeeMaterialNomenclators, ({ many }) => ({
  materials: many(materials)
}));

export const materialsRelations = relations(materials, ({ one }) => ({
  warehouse: one(warehouse, {
    // A material belongs to one warehouse
    fields: [materials.warehouseId],
    references: [warehouse.id]
  }),
  // A material have one service fee material nomenclator
  serviceFeeMaterialNomenclator: one(serviceFeeMaterialNomenclators, {
    fields: [materials.serviceFeeMaterialNomenclatorId],
    references: [serviceFeeMaterialNomenclators.id]
  })
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  material: one(materials, {
    // A stock movement belongs to one material
    fields: [stockMovements.materialId],
    references: [materials.id]
  }),
  warehouse: one(warehouse, {
    // A stock movement belongs to one warehouse
    fields: [stockMovements.warehouseId],
    references: [warehouse.id]
  })
}));

//* VISTAS *//
export const materialStockMovementsView = pgView("material_stock_movements", {
  // Material columns
  materialId: integer("material_id").references(() => materials.id),
  materialName: varchar("material_name", { length: 50 }),
  materialCategory: varchar("material_category", { length: 25 }),
  currentStock: doublePrecision("current_stock"),

  // Stock Movement columns
  movementId: integer("movement_id").references(() => stockMovements.id),
  quantityChange: doublePrecision("quantity_change"),
  movementType: varchar("movement_type", { length: 25 }),
  movementDate: timestamp("movement_date"),
  warehouseId: integer("warehouse_id").references(() => warehouse.id),
  unitMeasure: text("unit_measure"),
  userName: varchar("user_name", { length: 255 }) // Ad
}).existing();

// export const projects = pgTable("projects", {
// 	id: serial().primaryKey().notNull(),
// 	key: text({ length: 255 }).notNull(),
// 	projectname: text({ length: 255 }).notNull(),
// 	projectid: varchar({ length: 255 }).notNull(),
// 	representativename: varchar({ length: 255 }).notNull(),
// 	value: numeric({ precision: 10, scale:  2 }).notNull(),
// 	isfinaloffer: boolean().notNull(),
// 	representationpercentage: integer().notNull(),
// 	version: varchar({ length: 50 }).notNull(),
// 	versionInt: integer("version_int").default(0),
// });

// export const servicefee = pgTable("servicefee", {
// 	id: serial().primaryKey().notNull(),
// 	category: varchar({ length: 255 }),
// 	nomenclatorId: varchar("nomenclator_id", { length: 50 }),
// 	key: varchar({ length: 255 }),
// 	workersAmount: integer("workers_amount"),
// 	taskName: varchar("task_name", { length: 255 }),
// 	currencyChange: numeric("currency_change", { precision: 10, scale:  2 }),
// 	unitMeasure: varchar("unit_measure", { length: 255 }),
// 	rawMaterialsSubtotal: numeric("raw_materials_subtotal", { precision: 10, scale:  2 }),
// 	taskListSubtotal: numeric("task_list_subtotal", { precision: 10, scale:  2 }),
// 	equipmentDepreciationSubtotal: numeric("equipment_depreciation_subtotal", { precision: 10, scale:  2 }),
// 	equipmentMaintenanceSubtotal: numeric("equipment_maintenance_subtotal", { precision: 10, scale:  2 }),
// 	administrativeExpensesSubtotal: numeric("administrative_expenses_subtotal", { precision: 10, scale:  2 }),
// 	transportationExpensesSubtotal: numeric("transportation_expenses_subtotal", { precision: 10, scale:  2 }),
// 	hiredPersonalExpensesSubtotal: numeric("hired_personal_expenses_subtotal", { precision: 10, scale:  2 }),
// 	expensesTotalValue: numeric("expenses_total_value", { precision: 10, scale:  2 }),
// 	salePrice: numeric("sale_price", { precision: 10, scale:  2 }),
// 	salePriceUsd: numeric("sale_price_usd", { precision: 10, scale:  2 }),
// 	estimatedTime: numeric("estimated_time", { precision: 10, scale:  2 }),
// });

// export const rawMaterials = pgTable("raw_materials", {
// 	id: serial().primaryKey().notNull(),
// 	serviceFeeId: integer("service_fee_id"),
// 	description: varchar({ length: 255 }),
// 	unitMeasure: varchar("unit_measure", { length: 50 }),
// 	amount: numeric({ precision: 10, scale:  2 }),
// 	price: numeric({ precision: 10, scale:  2 }),
// 	value: numeric({ precision: 10, scale:  2 }),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.serviceFeeId],
// 			foreignColumns: [servicefee.id],
// 			name: "raw_materials_service_fee_id_fkey"
// 		}).onDelete("cascade"),
// ]);

// export const taskList = pgTable("task_list", {
// 	id: serial().primaryKey().notNull(),
// 	serviceFeeId: integer("service_fee_id"),
// 	key: varchar({ length: 255 }),
// 	amount: integer(),
// 	category: varchar({ length: 255 }),
// 	description: varchar({ length: 255 }),
// 	unitMeasure: varchar("unit_measure", { length: 50 }),
// 	currentComplexityName: varchar("current_complexity_name", { length: 50 }),
// 	currentComplexityValue: numeric("current_complexity_value", { precision: 10, scale:  2 }),
// 	currentComplexityTime: numeric("current_complexity_time", { precision: 10, scale:  2 }),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.serviceFeeId],
// 			foreignColumns: [servicefee.id],
// 			name: "task_list_service_fee_id_fkey"
// 		}).onDelete("cascade"),
// ]);

// export const equipmentDepreciation = pgTable("equipment_depreciation", {
// 	id: serial().primaryKey().notNull(),
// 	serviceFeeId: integer("service_fee_id"),
// 	description: varchar({ length: 255 }),
// 	unitMeasure: varchar("unit_measure", { length: 50 }),
// 	amount: numeric({ precision: 10, scale:  2 }),
// 	price: numeric({ precision: 10, scale:  2 }),
// 	value: numeric({ precision: 10, scale:  2 }),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.serviceFeeId],
// 			foreignColumns: [servicefee.id],
// 			name: "equipment_depreciation_service_fee_id_fkey"
// 		}).onDelete("cascade"),
// ]);

// export const equipmentMaintenance = pgTable("equipment_maintenance", {
// 	id: serial().primaryKey().notNull(),
// 	serviceFeeId: integer("service_fee_id"),
// 	description: varchar({ length: 255 }),
// 	unitMeasure: varchar("unit_measure", { length: 50 }),
// 	amount: numeric({ precision: 10, scale:  2 }),
// 	price: numeric({ precision: 10, scale:  2 }),
// 	value: numeric({ precision: 10, scale:  2 }),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.serviceFeeId],
// 			foreignColumns: [servicefee.id],
// 			name: "equipment_maintenance_service_fee_id_fkey"
// 		}).onDelete("cascade"),
// ]);

// export const administrativeExpenses = pgTable("administrative_expenses", {
// 	id: serial().primaryKey().notNull(),
// 	serviceFeeId: integer("service_fee_id"),
// 	description: varchar({ length: 255 }),
// 	unitMeasure: varchar("unit_measure", { length: 50 }),
// 	amount: numeric({ precision: 10, scale:  2 }),
// 	price: numeric({ precision: 10, scale:  2 }),
// 	value: numeric({ precision: 10, scale:  2 }),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.serviceFeeId],
// 			foreignColumns: [servicefee.id],
// 			name: "administrative_expenses_service_fee_id_fkey"
// 		}).onDelete("cascade"),
// ]);

// export const hiredPersonalExpenses = pgTable("hired_personal_expenses", {
// 	id: serial().primaryKey().notNull(),
// 	serviceFeeId: integer("service_fee_id"),
// 	description: varchar({ length: 255 }),
// 	unitMeasure: varchar("unit_measure", { length: 50 }),
// 	amount: numeric({ precision: 10, scale:  2 }),
// 	price: numeric({ precision: 10, scale:  2 }),
// 	value: numeric({ precision: 10, scale:  2 }),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.serviceFeeId],
// 			foreignColumns: [servicefee.id],
// 			name: "hired_personal_expenses_service_fee_id_fkey"
// 		}).onDelete("cascade"),
// ]);

// export const pricePerRepresentative = pgTable("price_per_representative", {
// 	id: serial().primaryKey().notNull(),
// 	serviceFeeId: integer("service_fee_id"),
// 	representativeName: varchar("representative_name", { length: 255 }),
// 	price: numeric({ precision: 10, scale:  2 }),
// 	priceUsd: numeric("price_usd", { precision: 10, scale:  2 }),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.serviceFeeId],
// 			foreignColumns: [servicefee.id],
// 			name: "price_per_representative_service_fee_id_fkey"
// 		}).onDelete("cascade"),
// ]);

// export const measuresActivity = pgTable("measures_activity", {
// 	id: serial().primaryKey().notNull(),
// 	activityId: integer("activity_id").notNull(),
// 	amount: integer().notNull(),
// 	description: varchar({ length: 255 }).notNull(),
// 	height: numeric({ precision: 10, scale:  2 }).notNull(),
// 	unitmeasure: varchar({ length: 50 }).notNull(),
// 	width: numeric({ precision: 10, scale:  2 }).notNull(),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.activityId],
// 			foreignColumns: [activityItem.id],
// 			name: "measures_activity_activity_id_fkey"
// 		}).onDelete("cascade"),
// ]);

// export const itemProject = pgTable("item_project", {
// 	id: serial().primaryKey().notNull(),
// 	projectId: integer("project_id").notNull(),
// 	key: varchar({ length: 255 }).notNull(),
// 	description: varchar({ length: 255 }).notNull(),
// 	value: numeric({ precision: 10, scale:  2 }).notNull(),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.projectId],
// 			foreignColumns: [projects.id],
// 			name: "item_project_project_id_fkey"
// 		}).onDelete("cascade"),
// ]);

// export const activityItem = pgTable("activity_item", {
// 	id: serial().primaryKey().notNull(),
// 	itemId: integer("item_id").notNull(),
// 	amount: integer().notNull(),
// 	complexity: varchar({ length: 50 }).notNull(),
// 	description: varchar({ length: 255 }).notNull(),
// 	unitmeasure: varchar({ length: 50 }).notNull(),
// 	price: numeric({ precision: 10, scale:  2 }).notNull(),
// 	value: numeric({ precision: 10, scale:  2 }).notNull(),
// 	size: integer().notNull(),
// 	width: numeric({ precision: 10, scale:  2 }).notNull(),
// 	height: numeric({ precision: 10, scale:  2 }).notNull(),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.itemId],
// 			foreignColumns: [itemProject.id],
// 			name: "activity_item_item_id_fkey"
// 		}).onDelete("cascade"),
// ]);

// export const materialsProject = pgTable("materials_project", {
// 	id: serial().primaryKey().notNull(),
// 	projectId: integer("project_id").notNull(),
// 	description: varchar({ length: 255 }).notNull(),
// 	amount: integer().notNull(),
// 	unitmeasure: varchar({ length: 50 }).notNull(),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.projectId],
// 			foreignColumns: [measuresActivity.id],
// 			name: "materials_project_project_id_fkey"
// 		}).onDelete("cascade"),
// ]);

// export const materialNomenclators = pgTable("material_nomenclators", {
// 	id: serial().primaryKey().notNull(),
// 	key: varchar({ length: 255 }).notNull(),
// 	name: varchar({ length: 255 }).notNull(),
// 	isdecrease: boolean().notNull(),
// 	version: integer().default(0),
// });

export type ClientNomenclator = typeof clientNomenclators.$inferSelect;
export type MaterialNomenclators = typeof materialNomenclators.$inferSelect;
export type ProviderNomenclators = typeof providerNomenclators.$inferSelect;
export type Nomenclator = typeof nomenclators.$inferSelect;
export type RepresentativeNomenclator = typeof representativeNomenclators.$inferSelect;
export type UnitmeasureNomenclator = typeof unitMeasureNomenclators.$inferSelect;
export type User = typeof users.$inferSelect;
export type Warehouse = typeof warehouse.$inferSelect;
export type Material = typeof materials.$inferSelect;
export type StockMovement = typeof stockMovements.$inferSelect;
export type serviceFeeMaterialNomenclators = typeof serviceFeeMaterialNomenclators.$inferSelect;
export type MaterialStockMovementsView = typeof materialStockMovementsView.$inferSelect;
