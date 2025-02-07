CREATE TABLE "representative_nomenclators" (
	"idNumber" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phoneNumber" bigint NOT NULL,
	"percentage" integer NOT NULL,
	"contact" varchar(255),
	"address" varchar(255),
	"email" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "client_nomenclators" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "client_nomenclators" ALTER COLUMN "contact" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "client_nomenclators" ALTER COLUMN "address" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "client_nomenclators" ALTER COLUMN "email" SET DATA TYPE varchar(255);