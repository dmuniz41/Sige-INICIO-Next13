ALTER TABLE "stock_movements" RENAME COLUMN "user_id" TO "userName";--> statement-breakpoint
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_user_id_users_id_fk";
