CREATE TABLE "stock_movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"material_id" integer NOT NULL,
	"quantity_change" numeric NOT NULL,
	"movement_type" text NOT NULL,
	"movement_date" timestamp DEFAULT now(),
	"notes" text,
	"user_id" numeric
);
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE no action ON UPDATE no action;