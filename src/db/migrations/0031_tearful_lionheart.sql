CREATE TABLE "material_nomenclators" (
	"code" serial PRIMARY KEY NOT NULL,
	"material_category" varchar(100) NOT NULL,
	"material_name" varchar(100) NOT NULL,
	"isDecrease" boolean NOT NULL
);
--> statement-breakpoint
DROP TABLE "material_category_nomenclators" CASCADE;