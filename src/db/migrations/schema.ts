import { pgTable, uuid, varchar, integer, numeric, serial, boolean, foreignKey, bigint, date, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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

export const materialCategoryNomenclators = pgTable("material_category_nomenclators", {
  code: varchar().primaryKey().notNull(),
  category: varchar().notNull(), // Indica el tipo de nomenclador(Cliente, Representante, Material, ....)
  value: varchar().notNull(),
  isDecrease: boolean().notNull() // Indica si el los materiales de esa categoria son gastables o no
});

// export const clientNomenclators = pgTable("client_nomenclators", {
//   id: serial().primaryKey().notNull(),
//   key: varchar().notNull(),
//   name: varchar().notNull(),
//   idNumber: integer().notNull(),
//   phoneNumber: numeric()
// });

// export const projects = pgTable("projects", {
// 	id: serial().primaryKey().notNull(),
// 	key: varchar({ length: 255 }).notNull(),
// 	projectname: varchar({ length: 255 }).notNull(),
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

// export const representativeNomenclators = pgTable("representative_nomenclators", {
// 	id: serial().primaryKey().notNull(),
// 	key: varchar({ length: 255 }).notNull(),
// 	name: varchar({ length: 255 }).notNull(),
// 	phonenumber: bigint({ mode: "number" }).notNull(),
// 	idnumber: integer().notNull(),
// 	percentage: integer().notNull(),
// 	contactperson: varchar({ length: 255 }).notNull(),
// 	address: varchar({ length: 255 }).notNull(),
// 	email: varchar({ length: 255 }).notNull(),
// 	version: integer().default(0),
// });

// export const materialNomenclators = pgTable("material_nomenclators", {
// 	id: serial().primaryKey().notNull(),
// 	key: varchar({ length: 255 }).notNull(),
// 	name: varchar({ length: 255 }).notNull(),
// 	isdecrease: boolean().notNull(),
// 	version: integer().default(0),
// });

// export const materials = pgTable("materials", {
// 	id: serial().primaryKey().notNull(),
// 	code: integer().notNull(),
// 	key: varchar({ length: 255 }).notNull(),
// 	materialname: varchar({ length: 255 }).notNull(),
// 	category: varchar({ length: 255 }).notNull(),
// 	enterdate: date().notNull(),
// 	unitmeasure: varchar({ length: 255 }).notNull(),
// 	costperunit: numeric({ precision: 10, scale:  2 }).notNull(),
// 	unitstotal: integer().notNull(),
// 	minimumexistence: integer().notNull(),
// 	materialtotalvalue: numeric({ precision: 10, scale:  2 }).notNull(),
// 	provider: varchar({ length: 255 }).notNull(),
// 	warehouse: varchar({ length: 255 }).notNull(),
// 	version: integer().default(0),
// 	description: text(),
// });

// export const operations = pgTable("operations", {
// 	id: serial().primaryKey().notNull(),
// 	materialId: integer("material_id").notNull(),
// 	date: date().notNull(),
// 	tipo: varchar({ length: 255 }).notNull(),
// 	amount: integer().notNull(),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.materialId],
// 			foreignColumns: [materials.id],
// 			name: "operations_material_id_fkey"
// 		}).onDelete("cascade"),
// ]);

export type User = typeof users.$inferSelect;
export type MaterialCategoryNomenclators = typeof materialCategoryNomenclators.$inferSelect;
