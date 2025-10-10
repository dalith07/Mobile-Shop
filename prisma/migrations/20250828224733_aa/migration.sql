/*
  Warnings:

  - You are about to alter the column `price` on the `Production` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.

*/
-- AlterTable
ALTER TABLE "Production" ALTER COLUMN "price" SET DEFAULT 0.000,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,3);
