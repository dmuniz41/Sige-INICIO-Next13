ALTER TABLE "materials" ALTER COLUMN "costPerUnit" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "stock" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "minimumExistence" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "totalValue" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "service_fee_material_nomenclators" ALTER COLUMN "costPerUnit" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "stock_movements" ALTER COLUMN "quantity_change" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "stock_movements" ALTER COLUMN "user_id" SET DATA TYPE double precision;