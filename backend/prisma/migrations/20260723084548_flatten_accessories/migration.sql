/*
  Warnings:

  - You are about to drop the `AccessoryDoor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccessoryFoldedPlate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccessoryWindow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccessoryDoor" DROP CONSTRAINT "AccessoryDoor_accessoriesId_fkey";

-- DropForeignKey
ALTER TABLE "AccessoryFoldedPlate" DROP CONSTRAINT "AccessoryFoldedPlate_accessoriesId_fkey";

-- DropForeignKey
ALTER TABLE "AccessoryWindow" DROP CONSTRAINT "AccessoryWindow_accessoriesId_fkey";

-- AlterTable
ALTER TABLE "Accessories" ADD COLUMN     "doorHeight" DECIMAL(10,3),
ADD COLUMN     "doorNos" INTEGER,
ADD COLUMN     "doorQuantity" DECIMAL(10,3),
ADD COLUMN     "doorWidth" DECIMAL(10,3),
ADD COLUMN     "foldedPlateLength" DECIMAL(10,3),
ADD COLUMN     "foldedPlateNos" INTEGER,
ADD COLUMN     "foldedPlateQuantity" DECIMAL(10,3),
ADD COLUMN     "foldedPlateWidth" DECIMAL(10,3),
ADD COLUMN     "windowHeight" DECIMAL(10,3),
ADD COLUMN     "windowNos" INTEGER,
ADD COLUMN     "windowQuantity" DECIMAL(10,3),
ADD COLUMN     "windowWidth" DECIMAL(10,3);

-- DropTable
DROP TABLE "AccessoryDoor";

-- DropTable
DROP TABLE "AccessoryFoldedPlate";

-- DropTable
DROP TABLE "AccessoryWindow";
