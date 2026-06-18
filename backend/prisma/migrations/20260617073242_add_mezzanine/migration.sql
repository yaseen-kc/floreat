-- CreateEnum
CREATE TYPE "MezzanineType" AS ENUM ('DECK SHEET', 'FOLDED PLATE', 'PANEL', 'BOARD', 'RCC SLAB');

-- CreateEnum
CREATE TYPE "MezzanineFloorLevel" AS ENUM ('1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor', '6th Floor', '7th Floor', '8th Floor', '9th Floor', '10th Floor');

-- CreateEnum
CREATE TYPE "MezzanineHeightFrom" AS ENUM ('Ground', 'First Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor');

-- CreateTable
CREATE TABLE "Mezzanine" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mezzanine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MezzanineFloor" (
    "id" TEXT NOT NULL,
    "mezzanineId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "floor" "MezzanineFloorLevel" NOT NULL,
    "type" "MezzanineType" NOT NULL,
    "heightFrom" "MezzanineHeightFrom" NOT NULL,
    "thicknessMm" DECIMAL(10,3) NOT NULL,
    "lengthM" DECIMAL(10,3) NOT NULL,
    "widthM" DECIMAL(10,3) NOT NULL,
    "heightM" DECIMAL(10,3) NOT NULL,
    "materialConsumptionKgPerSqft" DECIMAL(10,3) NOT NULL,
    "beamsMidPrimary" INTEGER NOT NULL,
    "beamsEndPrimary" INTEGER NOT NULL,
    "beamsSecondary" INTEGER NOT NULL,
    "jointsMidPrimary" INTEGER NOT NULL,
    "jointsEndPrimary" INTEGER NOT NULL,
    "internalColumnsMidPrimary" INTEGER NOT NULL,
    "internalColumnsEndPrimary" INTEGER NOT NULL,

    CONSTRAINT "MezzanineFloor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MezzanineFloorExtension" (
    "id" TEXT NOT NULL,
    "mezzanineId" TEXT NOT NULL,
    "type" "MezzanineType" NOT NULL,
    "heightFrom" "MezzanineHeightFrom" NOT NULL,
    "typicalTo" "MezzanineFloorLevel" NOT NULL,
    "thicknessMm" DECIMAL(10,3) NOT NULL,
    "lengthM" DECIMAL(10,3) NOT NULL,
    "widthM" DECIMAL(10,3) NOT NULL,
    "heightM" DECIMAL(10,3) NOT NULL,
    "beamsMidPrimary" INTEGER,
    "beamsEndPrimary" INTEGER,
    "beamsSecondary" INTEGER,
    "jointsMidPrimary" INTEGER,
    "jointsEndPrimary" INTEGER,
    "extendedColumnsMidPrimary" INTEGER,
    "extendedColumnsEndPrimary" INTEGER,

    CONSTRAINT "MezzanineFloorExtension_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mezzanine_jobId_key" ON "Mezzanine"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "MezzanineFloor_mezzanineId_code_key" ON "MezzanineFloor"("mezzanineId", "code");

-- AddForeignKey
ALTER TABLE "Mezzanine" ADD CONSTRAINT "Mezzanine_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MezzanineFloor" ADD CONSTRAINT "MezzanineFloor_mezzanineId_fkey" FOREIGN KEY ("mezzanineId") REFERENCES "Mezzanine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MezzanineFloorExtension" ADD CONSTRAINT "MezzanineFloorExtension_mezzanineId_fkey" FOREIGN KEY ("mezzanineId") REFERENCES "Mezzanine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
