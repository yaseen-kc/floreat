/*
  Warnings:

  - The `anchorBoltQuantity` column on the `QuantityAdditionalBolts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `foundationBoltQuantity` column on the `QuantityAdditionalBolts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jointBolt1Quantity` column on the `QuantityAdditionalBolts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jointBolt2Quantity` column on the `QuantityAdditionalBolts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jointBolt3Quantity` column on the `QuantityAdditionalBolts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `purlinBoltQuantity` column on the `QuantityAdditionalBolts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `claddingEaveHeightFrontAdditional` column on the `QuantityCladding` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `claddingFlangeBraceAdditional` column on the `QuantityCladding` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `claddingSagRodAdditional` column on the `QuantityCladding` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `claddingSheetAdditional` column on the `QuantityCladding` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `columnWindBracingsAdditional` column on the `QuantityCladding` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `numberOfCladdingPurlinBoltsAdditional` column on the `QuantityCladding` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `foundationBoltsQuantity` column on the `QuantityMezzanine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deckSheetQuantityAdditional` column on the `QuantityMezzanine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `shearStudsQuantityAdditional` column on the `QuantityMezzanine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `totalMezzanineAreaQuantity` column on the `QuantityMezzanine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `concreteFlashingAdditional` column on the `QuantityMezzanine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lengthOfBuildingQuantity` column on the `QuantityPebRoof` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lengthOfMidFrameFlangeBraceAdditional` column on the `QuantityPebRoof` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lengthOfOnePurlinQuantity` column on the `QuantityPebRoof` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lengthOfSingleSagRoadAdditional` column on the `QuantityPebRoof` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lengthOfSinlgeWindBracingAdditional` column on the `QuantityPebRoof` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lengthOfpolyCarbonateSheetAdditional` column on the `QuantityPebRoof` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `totalWeightofStepsAdditional` column on the `QuantityStair` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `totalWeightofStringerBeamsAdditional` column on the `QuantityStair` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "QuantityAdditionalBolts" DROP COLUMN "anchorBoltQuantity",
ADD COLUMN     "anchorBoltQuantity" DECIMAL(10,3),
DROP COLUMN "foundationBoltQuantity",
ADD COLUMN     "foundationBoltQuantity" DECIMAL(10,3),
DROP COLUMN "jointBolt1Quantity",
ADD COLUMN     "jointBolt1Quantity" DECIMAL(10,3),
DROP COLUMN "jointBolt2Quantity",
ADD COLUMN     "jointBolt2Quantity" DECIMAL(10,3),
DROP COLUMN "jointBolt3Quantity",
ADD COLUMN     "jointBolt3Quantity" DECIMAL(10,3),
DROP COLUMN "purlinBoltQuantity",
ADD COLUMN     "purlinBoltQuantity" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "QuantityCladding" DROP COLUMN "claddingEaveHeightFrontAdditional",
ADD COLUMN     "claddingEaveHeightFrontAdditional" DECIMAL(10,3),
DROP COLUMN "claddingFlangeBraceAdditional",
ADD COLUMN     "claddingFlangeBraceAdditional" DECIMAL(10,3),
DROP COLUMN "claddingSagRodAdditional",
ADD COLUMN     "claddingSagRodAdditional" DECIMAL(10,3),
DROP COLUMN "claddingSheetAdditional",
ADD COLUMN     "claddingSheetAdditional" DECIMAL(10,3),
DROP COLUMN "columnWindBracingsAdditional",
ADD COLUMN     "columnWindBracingsAdditional" DECIMAL(10,3),
DROP COLUMN "numberOfCladdingPurlinBoltsAdditional",
ADD COLUMN     "numberOfCladdingPurlinBoltsAdditional" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "QuantityMezzanine" DROP COLUMN "foundationBoltsQuantity",
ADD COLUMN     "foundationBoltsQuantity" DECIMAL(10,3),
DROP COLUMN "deckSheetQuantityAdditional",
ADD COLUMN     "deckSheetQuantityAdditional" DECIMAL(10,3),
DROP COLUMN "shearStudsQuantityAdditional",
ADD COLUMN     "shearStudsQuantityAdditional" DECIMAL(10,3),
DROP COLUMN "totalMezzanineAreaQuantity",
ADD COLUMN     "totalMezzanineAreaQuantity" DECIMAL(10,3),
DROP COLUMN "concreteFlashingAdditional",
ADD COLUMN     "concreteFlashingAdditional" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "QuantityPebRoof" DROP COLUMN "lengthOfBuildingQuantity",
ADD COLUMN     "lengthOfBuildingQuantity" DECIMAL(10,3),
DROP COLUMN "lengthOfMidFrameFlangeBraceAdditional",
ADD COLUMN     "lengthOfMidFrameFlangeBraceAdditional" DECIMAL(10,3),
DROP COLUMN "lengthOfOnePurlinQuantity",
ADD COLUMN     "lengthOfOnePurlinQuantity" DECIMAL(10,3),
DROP COLUMN "lengthOfSingleSagRoadAdditional",
ADD COLUMN     "lengthOfSingleSagRoadAdditional" DECIMAL(10,3),
DROP COLUMN "lengthOfSinlgeWindBracingAdditional",
ADD COLUMN     "lengthOfSinlgeWindBracingAdditional" DECIMAL(10,3),
DROP COLUMN "lengthOfpolyCarbonateSheetAdditional",
ADD COLUMN     "lengthOfpolyCarbonateSheetAdditional" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "QuantityStair" DROP COLUMN "totalWeightofStepsAdditional",
ADD COLUMN     "totalWeightofStepsAdditional" DECIMAL(10,3),
DROP COLUMN "totalWeightofStringerBeamsAdditional",
ADD COLUMN     "totalWeightofStringerBeamsAdditional" DECIMAL(10,3);
