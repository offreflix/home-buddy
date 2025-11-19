/*
  Warnings:

  - You are about to drop the `Receipt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReceiptItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReceiptItem" DROP CONSTRAINT "ReceiptItem_receiptId_fkey";

-- DropTable
DROP TABLE "Receipt";

-- DropTable
DROP TABLE "ReceiptItem";

-- DropEnum
DROP TYPE "ReceiptStatus";
