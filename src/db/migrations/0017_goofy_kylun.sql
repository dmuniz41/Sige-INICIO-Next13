ALTER TABLE "materials" ALTER COLUMN "enterDate" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "enterDate" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "enterDate" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "modifyDate" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "modifyDate" SET DEFAULT now();