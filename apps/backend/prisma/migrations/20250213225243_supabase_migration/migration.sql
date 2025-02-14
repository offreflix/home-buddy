/*
  Warnings:

  - The `unit` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('kg', 'g', 'L', 'lata', 'pacote', 'unidade');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "unit",
ADD COLUMN     "unit" "Unit" NOT NULL DEFAULT 'unidade';

-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "currentQuantity" SET DEFAULT 0;
