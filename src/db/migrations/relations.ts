import { relations } from "drizzle-orm/relations";
import { servicefee, rawMaterials, taskList, equipmentDepreciation, equipmentMaintenance, administrativeExpenses, hiredPersonalExpenses, pricePerRepresentative, activityItem, measuresActivity, projects, itemProject, materialsProject, materials, operations } from "./schema";

export const rawMaterialsRelations = relations(rawMaterials, ({one}) => ({
	servicefee: one(servicefee, {
		fields: [rawMaterials.serviceFeeId],
		references: [servicefee.id]
	}),
}));

export const servicefeeRelations = relations(servicefee, ({many}) => ({
	rawMaterials: many(rawMaterials),
	taskLists: many(taskList),
	equipmentDepreciations: many(equipmentDepreciation),
	equipmentMaintenances: many(equipmentMaintenance),
	administrativeExpenses: many(administrativeExpenses),
	hiredPersonalExpenses: many(hiredPersonalExpenses),
	pricePerRepresentatives: many(pricePerRepresentative),
}));

export const taskListRelations = relations(taskList, ({one}) => ({
	servicefee: one(servicefee, {
		fields: [taskList.serviceFeeId],
		references: [servicefee.id]
	}),
}));

export const equipmentDepreciationRelations = relations(equipmentDepreciation, ({one}) => ({
	servicefee: one(servicefee, {
		fields: [equipmentDepreciation.serviceFeeId],
		references: [servicefee.id]
	}),
}));

export const equipmentMaintenanceRelations = relations(equipmentMaintenance, ({one}) => ({
	servicefee: one(servicefee, {
		fields: [equipmentMaintenance.serviceFeeId],
		references: [servicefee.id]
	}),
}));

export const administrativeExpensesRelations = relations(administrativeExpenses, ({one}) => ({
	servicefee: one(servicefee, {
		fields: [administrativeExpenses.serviceFeeId],
		references: [servicefee.id]
	}),
}));

export const hiredPersonalExpensesRelations = relations(hiredPersonalExpenses, ({one}) => ({
	servicefee: one(servicefee, {
		fields: [hiredPersonalExpenses.serviceFeeId],
		references: [servicefee.id]
	}),
}));

export const pricePerRepresentativeRelations = relations(pricePerRepresentative, ({one}) => ({
	servicefee: one(servicefee, {
		fields: [pricePerRepresentative.serviceFeeId],
		references: [servicefee.id]
	}),
}));

export const measuresActivityRelations = relations(measuresActivity, ({one, many}) => ({
	activityItem: one(activityItem, {
		fields: [measuresActivity.activityId],
		references: [activityItem.id]
	}),
	materialsProjects: many(materialsProject),
}));

export const activityItemRelations = relations(activityItem, ({one, many}) => ({
	measuresActivities: many(measuresActivity),
	itemProject: one(itemProject, {
		fields: [activityItem.itemId],
		references: [itemProject.id]
	}),
}));

export const itemProjectRelations = relations(itemProject, ({one, many}) => ({
	project: one(projects, {
		fields: [itemProject.projectId],
		references: [projects.id]
	}),
	activityItems: many(activityItem),
}));

export const projectsRelations = relations(projects, ({many}) => ({
	itemProjects: many(itemProject),
}));

export const materialsProjectRelations = relations(materialsProject, ({one}) => ({
	measuresActivity: one(measuresActivity, {
		fields: [materialsProject.projectId],
		references: [measuresActivity.id]
	}),
}));

export const operationsRelations = relations(operations, ({one}) => ({
	material: one(materials, {
		fields: [operations.materialId],
		references: [materials.id]
	}),
}));

export const materialsRelations = relations(materials, ({many}) => ({
	operations: many(operations),
}));