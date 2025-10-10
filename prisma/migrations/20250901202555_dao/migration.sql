-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Production" DROP CONSTRAINT "Production_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Production" DROP CONSTRAINT "Production_modelId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "productionId" TEXT;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "productionId" TEXT;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "Production"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "Production"("id") ON DELETE SET NULL ON UPDATE CASCADE;
