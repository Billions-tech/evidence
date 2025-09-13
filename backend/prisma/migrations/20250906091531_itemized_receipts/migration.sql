/*
  Warnings:

  - You are about to drop the column `amount` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Receipt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Receipt" DROP COLUMN "amount",
DROP COLUMN "description";

-- CreateTable
CREATE TABLE "public"."ReceiptItem" (
    "id" SERIAL NOT NULL,
    "receiptId" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ReceiptItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ReceiptItem" ADD CONSTRAINT "ReceiptItem_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "public"."Receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
