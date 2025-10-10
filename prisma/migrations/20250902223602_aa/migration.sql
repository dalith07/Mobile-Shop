/*
  Warnings:

  - You are about to drop the column `productionId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `productionId` on the `Model` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_productionId_fkey";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_productionId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "productionId";

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "categoryId",
DROP COLUMN "productionId";

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
