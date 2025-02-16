CREATE TABLE "materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" serial NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"enterDate" date NOT NULL,
	"modifyDate" date,
	"unitMeasure" text NOT NULL,
	"costPerUnit" numeric NOT NULL,
	"stock" numeric NOT NULL,
	"minimumExistence" numeric NOT NULL,
	"provider" text NOT NULL,
	"warehouse_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warehouse" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"totalValue" double precision NOT NULL
);
--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_warehouse_id_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouse"("id") ON DELETE no action ON UPDATE no action;