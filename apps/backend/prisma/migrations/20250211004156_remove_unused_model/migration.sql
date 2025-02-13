/*
  Warnings:

  - You are about to drop the `Consumption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currentQuantity` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desiredQuantity` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Consumption" DROP CONSTRAINT "Consumption_productId_fkey";

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "currentQuantity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "desiredQuantity" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Consumption";
