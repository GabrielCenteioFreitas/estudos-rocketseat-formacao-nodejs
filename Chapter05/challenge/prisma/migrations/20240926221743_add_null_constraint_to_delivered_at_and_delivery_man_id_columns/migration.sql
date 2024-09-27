-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_delivery_man_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "delivered_at" DROP NOT NULL,
ALTER COLUMN "delivery_man_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_man_id_fkey" FOREIGN KEY ("delivery_man_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
