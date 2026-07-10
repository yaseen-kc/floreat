-- CreateEnum
CREATE TYPE "DrainageMaterial" AS ENUM ('PPGL', 'UPVC', 'ALUMINIUM', 'GI', 'COPPER', 'TIN');

-- CreateEnum
CREATE TYPE "DrainageSize" AS ENUM ('4 inches', '6 inches', '8 inches', '10 inches', '12 inches', '18 inches', '24 inches');

-- CreateEnum
CREATE TYPE "FlashingType" AS ENUM ('PPGL', 'NCGL', 'GI');

-- CreateEnum
CREATE TYPE "FlashingThickness" AS ENUM ('0.30 MM', '0.35 MM', '0.40 MM', '0.45 MM', '0.47 MM', '0.50 MM', '0.55 MM', '0.80 MM', '1.00 MM', '1.20 MM', '1.60 MM', '1.80 MM', '2.00 MM');

-- CreateEnum
CREATE TYPE "PartitionType" AS ENUM ('AEROCON PANEL', 'CEMENT BOARD', 'PPGL SHEET', 'PUFF SHEET', 'PLY BOARD');

-- CreateEnum
CREATE TYPE "PartitionThickness" AS ENUM ('0.40 MM', '0.45 MM', '0.47 MM', '6 MM', '8 MM', '12 MM', '16 MM', '18 MM', '30 MM', '40 MM', '50 MM', '75 MM');

-- CreateEnum
CREATE TYPE "InsulationType" AS ENUM ('XLPE', 'ROCK WOOL', 'GLASS WOOL', 'ALUMINIUM BUBBLE', 'COOL BOARD');

-- CreateEnum
CREATE TYPE "TurboVentilatorDiameter" AS ENUM ('6 Inches', '1 Foot', '18 Inches', '2 Feet');

-- CreateEnum
CREATE TYPE "AccessoryOpeningKind" AS ENUM ('ROLLING_SHUTTER', 'LOUVER', 'SKY_LIGHT', 'WALL_LIGHT');

-- CreateTable
CREATE TABLE "Accessories" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "gutterType" "DrainageMaterial",
    "gutterSize" "DrainageSize",
    "gutterQuantity" INTEGER,
    "downTakeType" "DrainageMaterial",
    "downTakeSize" "DrainageSize",
    "downTakeQuantity" INTEGER,
    "dripTrimType" "FlashingType",
    "dripTrimThickness" "FlashingThickness",
    "dripTrimQuantity" INTEGER,
    "gableEndFlashingType" "FlashingType",
    "gableEndFlashingThickness" "FlashingThickness",
    "gableEndFlashingQuantity" INTEGER,
    "cornerFlashType" "FlashingType",
    "cornerFlashThickness" "FlashingThickness",
    "cornerFlashQuantity" INTEGER,
    "ridgeType" "FlashingType",
    "ridgeThickness" "FlashingThickness",
    "ridgeQuantity" INTEGER,
    "partitionType" "PartitionType",
    "partitionThickness" "PartitionThickness",
    "partitionQuantity" INTEGER,
    "roofInsulationType" "InsulationType",
    "wallInsulationType" "InsulationType",
    "turboVentilatorDiameter" "TurboVentilatorDiameter",
    "turboVentilatorNos" INTEGER,
    "handrailWeightKg" DECIMAL(10,3),
    "deckSheetFlashingEnabled" BOOLEAN,
    "gantryGirderEnabled" BOOLEAN,
    "liftStructureEnabled" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accessories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessoryOpening" (
    "id" TEXT NOT NULL,
    "accessoriesId" TEXT NOT NULL,
    "kind" "AccessoryOpeningKind" NOT NULL,
    "length" DECIMAL(10,3),
    "width" DECIMAL(10,3),
    "nos" INTEGER,
    "quantity" INTEGER,

    CONSTRAINT "AccessoryOpening_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Accessories_jobId_key" ON "Accessories"("jobId");

-- AddForeignKey
ALTER TABLE "Accessories" ADD CONSTRAINT "Accessories_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessoryOpening" ADD CONSTRAINT "AccessoryOpening_accessoriesId_fkey" FOREIGN KEY ("accessoriesId") REFERENCES "Accessories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
