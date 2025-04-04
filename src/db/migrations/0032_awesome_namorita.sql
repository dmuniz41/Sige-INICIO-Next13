ALTER TABLE "material_nomenclators" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "material_nomenclators" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;