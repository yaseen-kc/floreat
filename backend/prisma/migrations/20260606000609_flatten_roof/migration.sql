/*
  Warnings:

  - You are about to drop the `RoofCladdingOpening` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoofCovering` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoofFasciaBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoofFlangeBrace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoofMaterialStrengthOrGuide` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoofMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoofPolycarbonate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoofPurlin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoofSideExtension` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoofWindBracing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoofCladdingOpening" DROP CONSTRAINT "RoofCladdingOpening_roofId_fkey";

-- DropForeignKey
ALTER TABLE "RoofCovering" DROP CONSTRAINT "RoofCovering_roofId_fkey";

-- DropForeignKey
ALTER TABLE "RoofFasciaBoard" DROP CONSTRAINT "RoofFasciaBoard_roofId_fkey";

-- DropForeignKey
ALTER TABLE "RoofFlangeBrace" DROP CONSTRAINT "RoofFlangeBrace_roofId_fkey";

-- DropForeignKey
ALTER TABLE "RoofMaterialStrengthOrGuide" DROP CONSTRAINT "RoofMaterialStrengthOrGuide_roofId_fkey";

-- DropForeignKey
ALTER TABLE "RoofMember" DROP CONSTRAINT "RoofMember_roofId_fkey";

-- DropForeignKey
ALTER TABLE "RoofPolycarbonate" DROP CONSTRAINT "RoofPolycarbonate_roofId_fkey";

-- DropForeignKey
ALTER TABLE "RoofPurlin" DROP CONSTRAINT "RoofPurlin_roofId_fkey";

-- DropForeignKey
ALTER TABLE "RoofSideExtension" DROP CONSTRAINT "RoofSideExtension_roofId_fkey";

-- DropForeignKey
ALTER TABLE "RoofWindBracing" DROP CONSTRAINT "RoofWindBracing_roofId_fkey";

-- AlterTable
ALTER TABLE "Roof" ADD COLUMN     "backCladdingOpeningArea" DECIMAL(10,3),
ADD COLUMN     "claddingCoveringThickness" DECIMAL(10,3),
ADD COLUMN     "claddingCoveringType" "CoveringType",
ADD COLUMN     "claddingExtensionEndFrameCount" INTEGER,
ADD COLUMN     "claddingExtensionMidFrameCount" INTEGER,
ADD COLUMN     "claddingExtensionWidthHeight" DECIMAL(10,3),
ADD COLUMN     "claddingFlangeBraceAverageLength" DECIMAL(10,3),
ADD COLUMN     "claddingPurlinDepth" DECIMAL(10,3),
ADD COLUMN     "claddingPurlinType" "PurlinMaterialType",
ADD COLUMN     "claddingPurlinUnitWeight" DECIMAL(10,3),
ADD COLUMN     "columnSegmentsInEndFrame" INTEGER,
ADD COLUMN     "columnSegmentsInMainFrame" INTEGER,
ADD COLUMN     "columnWindBracingBaySpacing" DECIMAL(10,3),
ADD COLUMN     "columnWindBracingLength" DECIMAL(10,3),
ADD COLUMN     "columnWindBracingProvidedBays" INTEGER,
ADD COLUMN     "columnWindBracingSegments" INTEGER,
ADD COLUMN     "endFrameFlangeBraceAverageLength" DECIMAL(10,3),
ADD COLUMN     "endFrameHorizontalTieBeam" INTEGER,
ADD COLUMN     "fasciaBoardArea" DECIMAL(10,3),
ADD COLUMN     "fasciaMaterialWeightPerSqft" DECIMAL(10,3),
ADD COLUMN     "frontCladdingOpeningArea" DECIMAL(10,3),
ADD COLUMN     "gradeOfPlateMaterial" "PlateMaterialGrade",
ADD COLUMN     "leftCladdingOpeningArea" DECIMAL(10,3),
ADD COLUMN     "polycarbonateRoofCount" INTEGER,
ADD COLUMN     "polycarbonateRoofLength" DECIMAL(10,3),
ADD COLUMN     "polycarbonateRoofWidth" DECIMAL(10,3),
ADD COLUMN     "raftersInOneHalfOfEndFrame" INTEGER,
ADD COLUMN     "raftersInOneHalfOfMainFrame" INTEGER,
ADD COLUMN     "rightCladdingOpeningArea" DECIMAL(10,3),
ADD COLUMN     "roofAreaDeduction" DECIMAL(10,3),
ADD COLUMN     "roofCoveringThickness" DECIMAL(10,3),
ADD COLUMN     "roofCoveringType" "CoveringType",
ADD COLUMN     "roofExtensionEndFrameCount" INTEGER,
ADD COLUMN     "roofExtensionMidFrameCount" INTEGER,
ADD COLUMN     "roofExtensionWidthHeight" DECIMAL(10,3),
ADD COLUMN     "roofFlangeBraceAverageLength" DECIMAL(10,3),
ADD COLUMN     "roofPurlinDepth" DECIMAL(10,3),
ADD COLUMN     "roofPurlinType" "PurlinMaterialType",
ADD COLUMN     "roofPurlinUnitWeight" DECIMAL(10,3),
ADD COLUMN     "roofWindBracingBaySpacing" DECIMAL(10,3),
ADD COLUMN     "roofWindBracingLength" DECIMAL(10,3),
ADD COLUMN     "roofWindBracingProvidedBays" INTEGER,
ADD COLUMN     "roofWindBracingSegmentsInOneHalf" INTEGER,
ADD COLUMN     "sideColumnsEndFrameCount" INTEGER,
ADD COLUMN     "sideColumnsMidFrameCount" INTEGER,
ADD COLUMN     "sideColumnsWidthHeight" DECIMAL(10,3),
ADD COLUMN     "windBracingColumnHeight" DECIMAL(10,3),
ADD COLUMN     "windBracingType" "TypeOfWindBracing",
ADD COLUMN     "windBracingUnitWeight" DECIMAL(10,3);

-- DropTable
DROP TABLE "RoofCladdingOpening";

-- DropTable
DROP TABLE "RoofCovering";

-- DropTable
DROP TABLE "RoofFasciaBoard";

-- DropTable
DROP TABLE "RoofFlangeBrace";

-- DropTable
DROP TABLE "RoofMaterialStrengthOrGuide";

-- DropTable
DROP TABLE "RoofMember";

-- DropTable
DROP TABLE "RoofPolycarbonate";

-- DropTable
DROP TABLE "RoofPurlin";

-- DropTable
DROP TABLE "RoofSideExtension";

-- DropTable
DROP TABLE "RoofWindBracing";
