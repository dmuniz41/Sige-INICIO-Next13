ALTER TABLE "service_fee_material_nomenclators" RENAME COLUMN "unitMeasure" TO "unit_measure";--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "name" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "category" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "description" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "provider" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "stock_movements" ALTER COLUMN "movement_type" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "service_fee_material_nomenclator_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_service_fee_material_nomenclator_id_service_fee_material_nomenclators_id_fk" FOREIGN KEY ("service_fee_material_nomenclator_id") REFERENCES "public"."service_fee_material_nomenclators"("id") ON DELETE no action ON UPDATE no action;