/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Production` table. All the data in the column will be lost.
  - You are about to drop the column `modelId` on the `Production` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Production" DROP CONSTRAINT "Production_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Production" DROP CONSTRAINT "Production_modelId_fkey";

-- AlterTable
ALTER TABLE "Production" DROP COLUMN "categoryId",
DROP COLUMN "modelId";
