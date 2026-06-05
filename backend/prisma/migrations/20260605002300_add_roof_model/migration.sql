/*
  Warnings:

  - Changed the type of `date` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SideWallSide" AS ENUM ('FRONT', 'BACK', 'RIGHT', 'LEFT');

-- CreateEnum
CREATE TYPE "PlateMaterialGrade" AS ENUM ('FE 345', 'FE 250', 'FE 400');

-- CreateEnum
CREATE TYPE "PurlinMaterialType" AS ENUM ('Z/C', 'TUBE');

-- CreateEnum
CREATE TYPE "TypeOfWindBracing" AS ENUM ('ROD', 'TUBE');

-- CreateEnum
CREATE TYPE "TypeOfWall" AS ENUM ('BRICK', 'PANEL', 'LATERITE', 'AAC', 'BLOCK');

-- CreateEnum
CREATE TYPE "CoveringType" AS ENUM ('Bare Galvalume', 'PPGL', 'Puff Sheet', 'Other');

-- CreateEnum
CREATE TYPE "RoofFrameBaseFixing" AS ENUM ('FOUNDATION BOLT', 'ANCHOR BOLT', 'JOINT BOLT ON STEEL COLUMN');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Roof" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "buildingOverallLength" DECIMAL(10,3) NOT NULL,
    "buildingOverallWidth" DECIMAL(10,3) NOT NULL,
    "eaveHeight" DECIMAL(10,3) NOT NULL,
    "roofSlope" DECIMAL(10,3) NOT NULL,
    "mainRoofFrames" INTEGER NOT NULL,
    "endRoofFrames" INTEGER NOT NULL,
    "roofPurlinSpacing" DECIMAL(10,3) NOT NULL,
    "claddingPurlins" INTEGER NOT NULL,
    "internalColumnsForMainRoofFrames" INTEGER NOT NULL,
    "internalColumnsForEndRoofFrames" INTEGER NOT NULL,
    "roofFrameBaseFixing" "RoofFrameBaseFixing" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoofMember" (
    "id" TEXT NOT NULL,
    "roofId" TEXT NOT NULL,
    "columnSegmentsInMainFrame" INTEGER NOT NULL,
    "raftersInOneHalfOfMainFrame" INTEGER NOT NULL,
    "columnSegmentsInEndFrame" INTEGER NOT NULL,
    "raftersInOneHalfOfEndFrame" INTEGER NOT NULL,
    "endFrameHorizontalTieBeam" INTEGER NOT NULL,

    CONSTRAINT "RoofMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoofPurlin" (
    "id" TEXT NOT NULL,
    "roofId" TEXT NOT NULL,
    "roofPurlinType" "PurlinMaterialType" NOT NULL,
    "roofPurlinDepth" DECIMAL(10,3) NOT NULL,
    "roofPurlinUnitWeight" DECIMAL(10,3) NOT NULL,
    "claddingPurlinType" "PurlinMaterialType" NOT NULL,
    "claddingPurlinDepth" DECIMAL(10,3) NOT NULL,
    "claddingPurlinUnitWeight" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "RoofPurlin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sidewall" (
    "id" TEXT NOT NULL,
    "roofId" TEXT NOT NULL,
    "side" "SideWallSide" NOT NULL,
    "wallType" "TypeOfWall" NOT NULL,
    "thickness" DECIMAL(10,3) NOT NULL,
    "height" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "Sidewall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoofCovering" (
    "id" TEXT NOT NULL,
    "roofId" TEXT NOT NULL,
    "roofCoveringType" "CoveringType" NOT NULL,
    "roofCoveringThickness" DECIMAL(10,3) NOT NULL,
    "claddingCoveringType" "CoveringType" NOT NULL,
    "claddingCoveringThickness" DECIMAL(10,3) NOT NULL,
    "roofAreaDeduction" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "RoofCovering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoofFlangeBrace" (
    "id" TEXT NOT NULL,
    "roofId" TEXT NOT NULL,
    "roofFlangeBraceAverageLength" DECIMAL(10,3) NOT NULL,
    "claddingFlangeBraceAverageLength" DECIMAL(10,3) NOT NULL,
    "endFrameFlangeBraceAverageLength" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "RoofFlangeBrace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoofPolycarbonate" (
    "id" TEXT NOT NULL,
    "roofId" TEXT NOT NULL,
    "polycarbonateRoofLength" DECIMAL(10,3) NOT NULL,
    "polycarbonateRoofWidth" DECIMAL(10,3) NOT NULL,
    "polycarbonateRoofCount" INTEGER NOT NULL,

    CONSTRAINT "RoofPolycarbonate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoofWindBracing" (
    "id" TEXT NOT NULL,
    "roofId" TEXT NOT NULL,
    "roofWindBracingSegmentsInOneHalf" INTEGER NOT NULL,
    "columnWindBracingSegments" INTEGER NOT NULL,
    "roofWindBracingProvidedBays" INTEGER NOT NULL,
    "columnWindBracingProvidedBays" INTEGER NOT NULL,
    "windBracingColumnHeight" DECIMAL(10,3) NOT NULL,
    "windBracingUnitWeight" DECIMAL(10,3) NOT NULL,
    "roofWindBracingBaySpacing" DECIMAL(10,3) NOT NULL,
    "columnWindBracingBaySpacing" DECIMAL(10,3) NOT NULL,
    "roofWindBracingLength" DECIMAL(10,3) NOT NULL,
    "columnWindBracingLength" DECIMAL(10,3) NOT NULL,
    "windBracingType" "TypeOfWindBracing" NOT NULL,

    CONSTRAINT "RoofWindBracing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoofCladdingOpening" (
    "id" TEXT NOT NULL,
    "roofId" TEXT NOT NULL,
    "frontCladdingOpeningArea" DECIMAL(10,3) NOT NULL,
    "backCladdingOpeningArea" DECIMAL(10,3) NOT NULL,
    "rightCladdingOpeningArea" DECIMAL(10,3) NOT NULL,
    "leftCladdingOpeningArea" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "RoofCladdingOpening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoofFasciaBoard" (
    "id" TEXT NOT NULL,
    "roofId" TEXT NOT NULL,
    "fasciaBoardArea" DECIMAL(10,3) NOT NULL,
    "fasciaMaterialWeightPerSqft" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "RoofFasciaBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoofSideExtension" (
    "id" TEXT NOT NULL,
    "roofId" TEXT NOT NULL,
    "roofExtensionWidthHeight" DECIMAL(10,3) NOT NULL,
    "roofExtensionMidFrameCount" INTEGER NOT NULL,
    "roofExtensionEndFrameCount" INTEGER NOT NULL,
    "claddingExtensionWidthHeight" DECIMAL(10,3) NOT NULL,
    "claddingExtensionMidFrameCount" INTEGER NOT NULL,
    "claddingExtensionEndFrameCount" INTEGER NOT NULL,
    "sideColumnsWidthHeight" DECIMAL(10,3) NOT NULL,
    "sideColumnsMidFrameCount" INTEGER NOT NULL,
    "sideColumnsEndFrameCount" INTEGER NOT NULL,

    CONSTRAINT "RoofSideExtension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoofMaterialStrengthOrGuide" (
    "id" TEXT NOT NULL,
    "roofId" TEXT NOT NULL,
    "gradeOfPlateMaterial" "PlateMaterialGrade" NOT NULL,

    CONSTRAINT "RoofMaterialStrengthOrGuide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roof_jobId_key" ON "Roof"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "RoofMember_roofId_key" ON "RoofMember"("roofId");

-- CreateIndex
CREATE UNIQUE INDEX "RoofPurlin_roofId_key" ON "RoofPurlin"("roofId");

-- CreateIndex
CREATE UNIQUE INDEX "Sidewall_roofId_side_key" ON "Sidewall"("roofId", "side");

-- CreateIndex
CREATE UNIQUE INDEX "RoofCovering_roofId_key" ON "RoofCovering"("roofId");

-- CreateIndex
CREATE UNIQUE INDEX "RoofFlangeBrace_roofId_key" ON "RoofFlangeBrace"("roofId");

-- CreateIndex
CREATE UNIQUE INDEX "RoofPolycarbonate_roofId_key" ON "RoofPolycarbonate"("roofId");

-- CreateIndex
CREATE UNIQUE INDEX "RoofWindBracing_roofId_key" ON "RoofWindBracing"("roofId");

-- CreateIndex
CREATE UNIQUE INDEX "RoofCladdingOpening_roofId_key" ON "RoofCladdingOpening"("roofId");

-- CreateIndex
CREATE UNIQUE INDEX "RoofFasciaBoard_roofId_key" ON "RoofFasciaBoard"("roofId");

-- CreateIndex
CREATE UNIQUE INDEX "RoofSideExtension_roofId_key" ON "RoofSideExtension"("roofId");

-- CreateIndex
CREATE UNIQUE INDEX "RoofMaterialStrengthOrGuide_roofId_key" ON "RoofMaterialStrengthOrGuide"("roofId");

-- AddForeignKey
ALTER TABLE "Roof" ADD CONSTRAINT "Roof_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoofMember" ADD CONSTRAINT "RoofMember_roofId_fkey" FOREIGN KEY ("roofId") REFERENCES "Roof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoofPurlin" ADD CONSTRAINT "RoofPurlin_roofId_fkey" FOREIGN KEY ("roofId") REFERENCES "Roof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sidewall" ADD CONSTRAINT "Sidewall_roofId_fkey" FOREIGN KEY ("roofId") REFERENCES "Roof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoofCovering" ADD CONSTRAINT "RoofCovering_roofId_fkey" FOREIGN KEY ("roofId") REFERENCES "Roof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoofFlangeBrace" ADD CONSTRAINT "RoofFlangeBrace_roofId_fkey" FOREIGN KEY ("roofId") REFERENCES "Roof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoofPolycarbonate" ADD CONSTRAINT "RoofPolycarbonate_roofId_fkey" FOREIGN KEY ("roofId") REFERENCES "Roof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoofWindBracing" ADD CONSTRAINT "RoofWindBracing_roofId_fkey" FOREIGN KEY ("roofId") REFERENCES "Roof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoofCladdingOpening" ADD CONSTRAINT "RoofCladdingOpening_roofId_fkey" FOREIGN KEY ("roofId") REFERENCES "Roof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoofFasciaBoard" ADD CONSTRAINT "RoofFasciaBoard_roofId_fkey" FOREIGN KEY ("roofId") REFERENCES "Roof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoofSideExtension" ADD CONSTRAINT "RoofSideExtension_roofId_fkey" FOREIGN KEY ("roofId") REFERENCES "Roof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoofMaterialStrengthOrGuide" ADD CONSTRAINT "RoofMaterialStrengthOrGuide_roofId_fkey" FOREIGN KEY ("roofId") REFERENCES "Roof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
