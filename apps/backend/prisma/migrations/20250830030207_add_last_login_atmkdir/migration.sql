-- DropIndex
DROP INDEX "Category_name_idx";

-- DropIndex
DROP INDEX "Product_categoryId_idx";

-- DropIndex
DROP INDEX "Product_name_categoryId_idx";

-- DropIndex
DROP INDEX "Product_name_idx";

-- DropIndex
DROP INDEX "Product_unit_idx";

-- DropIndex
DROP INDEX "Product_userId_idx";

-- DropIndex
DROP INDEX "Product_userId_name_idx";

-- DropIndex
DROP INDEX "Stock_currentQuantity_desiredQuantity_idx";

-- DropIndex
DROP INDEX "Stock_currentQuantity_idx";

-- DropIndex
DROP INDEX "Stock_desiredQuantity_idx";

-- DropIndex
DROP INDEX "Stock_productId_idx";

-- DropIndex
DROP INDEX "StockMovement_createdAt_idx";

-- DropIndex
DROP INDEX "StockMovement_movementType_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_firstName_idx";

-- DropIndex
DROP INDEX "User_firstName_lastName_idx";

-- DropIndex
DROP INDEX "User_lastName_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLoginAt" TIMESTAMP(3);
