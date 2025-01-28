-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "users" (
	"_id" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"lastName" varchar,
	"key" varchar NOT NULL,
	"userName" varchar,
	"privileges" varchar[],
	"area" varchar[],
	"password" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nomenclators" (
	"_id" uuid PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"code" varchar NOT NULL,
	"category" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_nomenclators" (
	"_id" uuid PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"name" varchar NOT NULL,
	"idNumber" integer NOT NULL,
	"phoneNumber" numeric
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"projectname" varchar(255) NOT NULL,
	"projectid" varchar(255) NOT NULL,
	"representativename" varchar(255) NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"isfinaloffer" boolean NOT NULL,
	"representationpercentage" integer NOT NULL,
	"version" varchar(50) NOT NULL,
	"version_int" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "servicefee" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" varchar(255),
	"nomenclator_id" varchar(50),
	"key" varchar(255),
	"workers_amount" integer,
	"task_name" varchar(255),
	"currency_change" numeric(10, 2),
	"unit_measure" varchar(255),
	"raw_materials_subtotal" numeric(10, 2),
	"task_list_subtotal" numeric(10, 2),
	"equipment_depreciation_subtotal" numeric(10, 2),
	"equipment_maintenance_subtotal" numeric(10, 2),
	"administrative_expenses_subtotal" numeric(10, 2),
	"transportation_expenses_subtotal" numeric(10, 2),
	"hired_personal_expenses_subtotal" numeric(10, 2),
	"expenses_total_value" numeric(10, 2),
	"sale_price" numeric(10, 2),
	"sale_price_usd" numeric(10, 2),
	"estimated_time" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "raw_materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_fee_id" integer,
	"description" varchar(255),
	"unit_measure" varchar(50),
	"amount" numeric(10, 2),
	"price" numeric(10, 2),
	"value" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "task_list" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_fee_id" integer,
	"key" varchar(255),
	"amount" integer,
	"category" varchar(255),
	"description" varchar(255),
	"unit_measure" varchar(50),
	"current_complexity_name" varchar(50),
	"current_complexity_value" numeric(10, 2),
	"current_complexity_time" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "equipment_depreciation" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_fee_id" integer,
	"description" varchar(255),
	"unit_measure" varchar(50),
	"amount" numeric(10, 2),
	"price" numeric(10, 2),
	"value" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "equipment_maintenance" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_fee_id" integer,
	"description" varchar(255),
	"unit_measure" varchar(50),
	"amount" numeric(10, 2),
	"price" numeric(10, 2),
	"value" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "administrative_expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_fee_id" integer,
	"description" varchar(255),
	"unit_measure" varchar(50),
	"amount" numeric(10, 2),
	"price" numeric(10, 2),
	"value" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "hired_personal_expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_fee_id" integer,
	"description" varchar(255),
	"unit_measure" varchar(50),
	"amount" numeric(10, 2),
	"price" numeric(10, 2),
	"value" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "price_per_representative" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_fee_id" integer,
	"representative_name" varchar(255),
	"price" numeric(10, 2),
	"price_usd" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "measures_activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"description" varchar(255) NOT NULL,
	"height" numeric(10, 2) NOT NULL,
	"unitmeasure" varchar(50) NOT NULL,
	"width" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_project" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"key" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"value" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"complexity" varchar(50) NOT NULL,
	"description" varchar(255) NOT NULL,
	"unitmeasure" varchar(50) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"size" integer NOT NULL,
	"width" numeric(10, 2) NOT NULL,
	"height" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materials_project" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"description" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"unitmeasure" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "representative_nomenclators" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"phonenumber" bigint NOT NULL,
	"idnumber" integer NOT NULL,
	"percentage" integer NOT NULL,
	"contactperson" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"version" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "material_nomenclators" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"isdecrease" boolean NOT NULL,
	"version" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" integer NOT NULL,
	"key" varchar(255) NOT NULL,
	"materialname" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"enterdate" date NOT NULL,
	"unitmeasure" varchar(255) NOT NULL,
	"costperunit" numeric(10, 2) NOT NULL,
	"unitstotal" integer NOT NULL,
	"minimumexistence" integer NOT NULL,
	"materialtotalvalue" numeric(10, 2) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"warehouse" varchar(255) NOT NULL,
	"version" integer DEFAULT 0,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "operations" (
	"id" serial PRIMARY KEY NOT NULL,
	"material_id" integer NOT NULL,
	"date" date NOT NULL,
	"tipo" varchar(255) NOT NULL,
	"amount" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "raw_materials" ADD CONSTRAINT "raw_materials_service_fee_id_fkey" FOREIGN KEY ("service_fee_id") REFERENCES "public"."servicefee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_list" ADD CONSTRAINT "task_list_service_fee_id_fkey" FOREIGN KEY ("service_fee_id") REFERENCES "public"."servicefee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_depreciation" ADD CONSTRAINT "equipment_depreciation_service_fee_id_fkey" FOREIGN KEY ("service_fee_id") REFERENCES "public"."servicefee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "equipment_maintenance_service_fee_id_fkey" FOREIGN KEY ("service_fee_id") REFERENCES "public"."servicefee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "administrative_expenses" ADD CONSTRAINT "administrative_expenses_service_fee_id_fkey" FOREIGN KEY ("service_fee_id") REFERENCES "public"."servicefee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hired_personal_expenses" ADD CONSTRAINT "hired_personal_expenses_service_fee_id_fkey" FOREIGN KEY ("service_fee_id") REFERENCES "public"."servicefee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_per_representative" ADD CONSTRAINT "price_per_representative_service_fee_id_fkey" FOREIGN KEY ("service_fee_id") REFERENCES "public"."servicefee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measures_activity" ADD CONSTRAINT "measures_activity_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."activity_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_project" ADD CONSTRAINT "item_project_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_item" ADD CONSTRAINT "activity_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."item_project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materials_project" ADD CONSTRAINT "materials_project_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."measures_activity"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operations" ADD CONSTRAINT "operations_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
*/