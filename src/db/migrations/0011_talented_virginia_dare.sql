CREATE TABLE "service_fee_material_nomenclators" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"costPerUnit" numeric NOT NULL,
	"unitMeasure" varchar(100) NOT NULL
);
