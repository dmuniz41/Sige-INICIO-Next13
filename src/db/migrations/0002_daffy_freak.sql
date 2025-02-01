ALTER TABLE "material_nomenclators" RENAME TO "material_category_nomenclators";--> statement-breakpoint
ALTER TABLE "material_category_nomenclators" ADD COLUMN "isDecrease" boolean NOT NULL;