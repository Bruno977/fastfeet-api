/*
  Warnings:

  - Added the required column `description` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attachments_order_id_key" ON "attachments"("order_id");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
