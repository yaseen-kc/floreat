/*
  Warnings:

  - The `code` column on the `StairItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StairCode" AS ENUM ('STAIR-1', 'STAIR-2', 'STAIR-3', 'STAIR-4', 'STAIR-5', 'STAIR-6', 'STAIR-7', 'STAIR-8', 'STAIR-9', 'STAIR-10', 'STAIR-11', 'STAIR-12');

-- AlterTable
ALTER TABLE "StairItem" DROP COLUMN "code",
ADD COLUMN     "code" "StairCode";

-- CreateIndex
CREATE UNIQUE INDEX "StairItem_stairId_code_key" ON "StairItem"("stairId", "code");
