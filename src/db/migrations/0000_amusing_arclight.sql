CREATE TABLE "client_nomenclators" (
	"idNumber" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"phoneNumber" numeric,
	"contact" varchar,
	"address" varchar,
	"email" varchar
);
--> statement-breakpoint
CREATE TABLE "material_category_nomenclators" (
	"code" varchar PRIMARY KEY NOT NULL,
	"category" varchar NOT NULL,
	"value" varchar NOT NULL,
	"isDecrease" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"lastName" varchar,
	"key" varchar NOT NULL,
	"userName" varchar,
	"privileges" varchar[],
	"area" varchar[],
	"password" varchar NOT NULL
);
