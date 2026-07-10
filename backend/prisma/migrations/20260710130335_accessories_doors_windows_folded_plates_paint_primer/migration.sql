-- CreateEnum
CREATE TYPE "PaintType" AS ENUM ('EPOXY PRIMER', 'EPOXY PAINT');

-- CreateEnum
CREATE TYPE "PurlinsGirtsFinish" AS ENUM ('PRE-GALVANISED');

-- CreateEnum
CREATE TYPE "PurlinsGirtsPaint" AS ENUM ('UNPAINTED', 'PAINTED');

-- CreateEnum
CREATE TYPE "FoundationBoltFinish" AS ENUM ('BLACK (UNPAINTED)');

-- AlterTable
ALTER TABLE "Accessories" ADD COLUMN     "foundationBoltFinish" "FoundationBoltFinish",
ADD COLUMN     "framesPaintCoats" INTEGER,
ADD COLUMN     "framesPaintType" "PaintType",
ADD COLUMN     "framesPrimerCoats" INTEGER,
ADD COLUMN     "framesPrimerType" "PaintType",
ADD COLUMN     "purlinsGirtsFinish" "PurlinsGirtsFinish",
ADD COLUMN     "purlinsGirtsGsm" INTEGER,
ADD COLUMN     "purlinsGirtsPaint" "PurlinsGirtsPaint";

-- CreateTable
CREATE TABLE "AccessoryDoor" (
    "id" TEXT NOT NULL,
    "accessoriesId" TEXT NOT NULL,
    "height" DECIMAL(10,3),
    "width" DECIMAL(10,3),
    "nos" INTEGER,
    "quantity" INTEGER,

    CONSTRAINT "AccessoryDoor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessoryWindow" (
    "id" TEXT NOT NULL,
    "accessoriesId" TEXT NOT NULL,
    "height" DECIMAL(10,3),
    "width" DECIMAL(10,3),
    "nos" INTEGER,
    "quantity" INTEGER,

    CONSTRAINT "AccessoryWindow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessoryFoldedPlate" (
    "id" TEXT NOT NULL,
    "accessoriesId" TEXT NOT NULL,
    "length" DECIMAL(10,3),
    "width" DECIMAL(10,3),
    "nos" INTEGER,
    "quantity" INTEGER,

    CONSTRAINT "AccessoryFoldedPlate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccessoryDoor" ADD CONSTRAINT "AccessoryDoor_accessoriesId_fkey" FOREIGN KEY ("accessoriesId") REFERENCES "Accessories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessoryWindow" ADD CONSTRAINT "AccessoryWindow_accessoriesId_fkey" FOREIGN KEY ("accessoriesId") REFERENCES "Accessories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessoryFoldedPlate" ADD CONSTRAINT "AccessoryFoldedPlate_accessoriesId_fkey" FOREIGN KEY ("accessoriesId") REFERENCES "Accessories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
