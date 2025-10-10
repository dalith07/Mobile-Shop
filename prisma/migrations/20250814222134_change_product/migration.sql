/*
  Warnings:

  - You are about to drop the column `priority` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sold` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "priority",
DROP COLUMN "sold",
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0;
