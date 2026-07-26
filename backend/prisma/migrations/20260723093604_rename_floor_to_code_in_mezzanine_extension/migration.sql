/*
  Warnings:

  - You are about to drop the column `floor` on the `MezzanineFloorExtension` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MezzanineFloorCodeExt" AS ENUM ('EXT-1', 'EXT-2', 'EXT-3');

-- AlterTable
ALTER TABLE "MezzanineFloorExtension" DROP COLUMN "floor",
ADD COLUMN     "code" "MezzanineFloorCodeExt";
