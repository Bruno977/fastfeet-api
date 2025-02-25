/*
  Warnings:

  - Made the column `order_id` on table `attachments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_order_id_fkey";

-- DropIndex
DROP INDEX "attachments_order_id_key";

-- AlterTable
ALTER TABLE "attachments" ALTER COLUMN "order_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
