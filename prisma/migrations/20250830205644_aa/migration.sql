/*
  Warnings:

  - Added the required column `categoryId` to the `Production` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelId` to the `Production` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Production" ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "modelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
