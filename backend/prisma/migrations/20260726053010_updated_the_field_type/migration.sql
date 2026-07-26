/*
  Warnings:

  - You are about to alter the column `noOfFaceCladdingPurlin` on the `QuantityCladding` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfSideCladdingPurlin` on the `QuantityCladding` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `NosOfpolyCarbonateSheet` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfBayInSagRodProvided` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfBoltsInSinglePurlinJoint` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfEndFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfExtendedEndFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfExtendedFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfExtendedFrames` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfExtendedMidFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfExtendedPurlinBay` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfExtendedSagRodBay` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfFlangeBraceInEndFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfFlangeBraceInMidFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfFlngBraceInExtendedFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfFlngBraceInExtendedFrame2` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfMidFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfPurlinJointInSingleFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfPurlinnodeInExtendedFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfPurlinsInOneFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfSagRodInASingleFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `noOfSagRodInExtendedFrame` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `totalNoOfPurlinBay` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `totalNumberOfWindBracing` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - You are about to alter the column `totalnoOfFrames` on the `QuantityPebRoof` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.

*/
-- AlterTable
ALTER TABLE "QuantityAccessories" ADD COLUMN     "handrail" TEXT,
ADD COLUMN     "turboVentilators" TEXT,
ALTER COLUMN "doors" SET DATA TYPE TEXT,
ALTER COLUMN "louvers" SET DATA TYPE TEXT,
ALTER COLUMN "rollingShutter" SET DATA TYPE TEXT,
ALTER COLUMN "roofInsulation" SET DATA TYPE TEXT,
ALTER COLUMN "skyLight" SET DATA TYPE TEXT,
ALTER COLUMN "wallInsulation" SET DATA TYPE TEXT,
ALTER COLUMN "wallLight" SET DATA TYPE TEXT,
ALTER COLUMN "windows" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "QuantityAdditionalBolts" ADD COLUMN     "jointBolt1" TEXT,
ADD COLUMN     "jointBolt2" TEXT,
ADD COLUMN     "jointBolt3" TEXT,
ADD COLUMN     "purlinBolt" TEXT,
ALTER COLUMN "anchorBoltQuantity" SET DATA TYPE TEXT,
ALTER COLUMN "foundationBoltQuantity" SET DATA TYPE TEXT,
ALTER COLUMN "jointBolt1Quantity" SET DATA TYPE TEXT,
ALTER COLUMN "jointBolt2Quantity" SET DATA TYPE TEXT,
ALTER COLUMN "jointBolt3Quantity" SET DATA TYPE TEXT,
ALTER COLUMN "purlinBoltQuantity" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "QuantityCladding" ALTER COLUMN "claddingEaveHeightFrontAdditional" SET DATA TYPE TEXT,
ALTER COLUMN "claddingFlangeBraceAdditional" SET DATA TYPE TEXT,
ALTER COLUMN "claddingSagRodAdditional" SET DATA TYPE TEXT,
ALTER COLUMN "claddingSheetAdditional" SET DATA TYPE TEXT,
ALTER COLUMN "columnWindBracingsAdditional" SET DATA TYPE TEXT,
ALTER COLUMN "noOfFaceCladdingPurlin" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfSideCladdingPurlin" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "numberOfCladdingPurlinBoltsAdditional" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "QuantityMezzanine" ADD COLUMN     "mezzanineStructure" TEXT,
ADD COLUMN     "shearStudsPurchaseQuantity" DECIMAL(10,3),
ALTER COLUMN "foundationBoltsQuantity" SET DATA TYPE TEXT,
ALTER COLUMN "deckSheetQuantityAdditional" SET DATA TYPE TEXT,
ALTER COLUMN "jointBolts" SET DATA TYPE TEXT,
ALTER COLUMN "shearStudsQuantityAdditional" SET DATA TYPE TEXT,
ALTER COLUMN "totalMezzanineAreaQuantity" SET DATA TYPE TEXT,
ALTER COLUMN "concreteFlashingAdditional" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "QuantityPebRoof" ALTER COLUMN "NosOfpolyCarbonateSheet" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "lengthOfBuildingQuantity" SET DATA TYPE TEXT,
ALTER COLUMN "lengthOfMidFrameFlangeBraceAdditional" SET DATA TYPE TEXT,
ALTER COLUMN "lengthOfOnePurlinQuantity" SET DATA TYPE TEXT,
ALTER COLUMN "lengthOfSingleSagRoadAdditional" SET DATA TYPE TEXT,
ALTER COLUMN "lengthOfSinlgeWindBracingAdditional" SET DATA TYPE TEXT,
ALTER COLUMN "lengthOfpolyCarbonateSheetAdditional" SET DATA TYPE TEXT,
ALTER COLUMN "noOfBayInSagRodProvided" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfBoltsInSinglePurlinJoint" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfEndFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfExtendedEndFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfExtendedFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfExtendedFrames" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfExtendedMidFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfExtendedPurlinBay" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfExtendedSagRodBay" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfFlangeBraceInEndFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfFlangeBraceInMidFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfFlngBraceInExtendedFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfFlngBraceInExtendedFrame2" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfMidFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfPurlinJointInSingleFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfPurlinnodeInExtendedFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfPurlinsInOneFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfSagRodInASingleFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "noOfSagRodInExtendedFrame" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "numberOfAnchorBolts" SET DATA TYPE TEXT,
ALTER COLUMN "numberOfFoundationBolts" SET DATA TYPE TEXT,
ALTER COLUMN "numberOfPurlinBolts" SET DATA TYPE TEXT,
ALTER COLUMN "numberOfRoofJointBolts" SET DATA TYPE TEXT,
ALTER COLUMN "pebRoofValue" SET DATA TYPE TEXT,
ALTER COLUMN "raftersAndColumns" SET DATA TYPE TEXT,
ALTER COLUMN "roofPurlins" SET DATA TYPE TEXT,
ALTER COLUMN "roofSheet" SET DATA TYPE TEXT,
ALTER COLUMN "totalNoOfPurlinBay" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "totalNumberOfWindBracing" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "totalnoOfFrames" SET DATA TYPE DECIMAL(10,3);

-- AlterTable
ALTER TABLE "QuantityStair" ALTER COLUMN "totalWeightofSteps" SET DATA TYPE TEXT,
ALTER COLUMN "totalWeightofStepsAdditional" SET DATA TYPE TEXT,
ALTER COLUMN "totalWeightofStringerBeams" SET DATA TYPE TEXT,
ALTER COLUMN "totalWeightofStringerBeamsAdditional" SET DATA TYPE TEXT;
