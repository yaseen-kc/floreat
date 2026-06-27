-- CreateEnum
CREATE TYPE "CanopyHeightFrom" AS ENUM ('GROUND', 'FF', 'SF', '3rd Floor', '4th Floor', '5th Floor');

-- CreateEnum
CREATE TYPE "CanopySheetType" AS ENUM ('NCGL', 'PPGL', 'Puff', 'Other');

-- CreateEnum
CREATE TYPE "YesNo" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "ApprovalDrawingsTimeUnit" AS ENUM ('DAYS', 'WEEKS', 'MONTHS');

-- CreateTable
CREATE TABLE "Canopy" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Canopy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanopyItem" (
    "id" TEXT NOT NULL,
    "canopyId" TEXT NOT NULL,
    "code" TEXT,
    "heightFrom" "CanopyHeightFrom",
    "length" DECIMAL(10,3),
    "width" DECIMAL(10,3),
    "height" DECIMAL(10,3),
    "materialConsumptionKgPerSqft" DECIMAL(10,3),
    "numberOfBeams" INTEGER,
    "numberOfPurlins" INTEGER,
    "purlinDepth" DECIMAL(10,3),
    "unitWeightOfPurlin" DECIMAL(10,3),
    "canopySheet" "CanopySheetType",
    "sheetThick" DECIMAL(10,3),
    "canopySideCoveringHeight" DECIMAL(10,3),
    "gutter" "YesNo",
    "downTake" "YesNo",
    "flashing" "YesNo",

    CONSTRAINT "CanopyItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Load" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "deadLoadOnRoofRafters" DECIMAL(10,3),
    "liveLoadOnRoofRafters" DECIMAL(10,3),
    "collateralLoadOnRoofRafters" DECIMAL(10,3),
    "windLoadOnRoofRaftersUpward" DECIMAL(10,3),
    "windLoadHorizontal" DECIMAL(10,3),
    "deadLoadOnRoofFloor" DECIMAL(10,3),
    "liveLoadOnRoofFloor" DECIMAL(10,3),
    "floorDeadLoad" DECIMAL(10,3),
    "floorFinishLoad" DECIMAL(10,3),
    "floorLiveLoad" DECIMAL(10,3),
    "snowLoad" DECIMAL(10,3),
    "earthquakeLoad" DECIMAL(10,3),
    "approvalDrawingsTime" INTEGER,
    "approvalDrawingsUnit" "ApprovalDrawingsTimeUnit",
    "supplyOfMaterialsDays" INTEGER,
    "erectionOfStructureDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Load_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Canopy_jobId_key" ON "Canopy"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "CanopyItem_canopyId_code_key" ON "CanopyItem"("canopyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Load_jobId_key" ON "Load"("jobId");

-- AddForeignKey
ALTER TABLE "Canopy" ADD CONSTRAINT "Canopy_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanopyItem" ADD CONSTRAINT "CanopyItem_canopyId_fkey" FOREIGN KEY ("canopyId") REFERENCES "Canopy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Load" ADD CONSTRAINT "Load_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
