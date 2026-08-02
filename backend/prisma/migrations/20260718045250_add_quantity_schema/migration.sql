-- CreateEnum
CREATE TYPE "QuantityUnit" AS ENUM ('KG', 'M', 'NOS', 'SQFT', 'SQM', 'KG/SQFT', 'KG/M', 'KG/SQM');

-- CreateTable
CREATE TABLE "Quantity" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quantity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuantityPebRoof" (
    "id" TEXT NOT NULL,
    "quantityId" TEXT NOT NULL,
    "quantityPebRoofValue" BOOLEAN,
    "materialWithPurlinUnit" "QuantityUnit",
    "materialWithPurlinQuantity" DECIMAL(10,3),
    "raftersAndColumnsSpecification" TEXT,
    "raftersAndColumnsUnit" "QuantityUnit",
    "raftersAndColumnsQuantity" DECIMAL(10,3),
    "raftersAndColumnsAdditionalQuantity" DECIMAL(10,3),
    "raftersAndColumnsBuildingLength" DECIMAL(10,3),
    "raftersAndColumnsBuildingLengthUnit" "QuantityUnit",
    "raftersAndColumnsInclinedLengthOneHalf" DECIMAL(10,3),
    "raftersAndColumnsInclinedLengthUnit" "QuantityUnit",
    "raftersAndColumnsRoofArea" DECIMAL(10,3),
    "raftersAndColumnsRoofAreaUnit" "QuantityUnit",
    "raftersAndColumnsMaterialConsumption" DECIMAL(10,3),
    "raftersAndColumnsMaterialConsumptionUnit" "QuantityUnit",
    "roofPurlinesValue" DECIMAL(65,30),
    "roofPurlinsSpecification" TEXT,
    "roofPurlinsUnit" "QuantityUnit",
    "roofPurlinsQuantity" DECIMAL(10,3),
    "roofPurlinsAdditionalQuantity" DECIMAL(10,3),
    "roofPurlinsSinglePurlinLength" DECIMAL(10,3),
    "roofPurlinsSinglePurlinLengthUnit" "QuantityUnit",
    "roofPurlinsPurlinsPerFrame" INTEGER,
    "roofPurlinsTotalPurlinBays" INTEGER,
    "roofPurlinsPurlinUnitWeight" DECIMAL(10,3),
    "roofPurlinsPurlinUnitWeightUnit" "QuantityUnit",
    "roofPurlinsExtendedFramePurlins" INTEGER,
    "roofPurlinsExtendedPurlinBays" INTEGER,
    "roofSheetSpecification" TEXT,
    "roofSheetUnit" "QuantityUnit",
    "roofSheetQuantity" DECIMAL(10,3),
    "roofSheetPurchaseQuantity" DECIMAL(10,3),
    "roofSheetAdditionalQuantity" DECIMAL(10,3),
    "roofSheetExtendedRoofWidth" DECIMAL(10,3),
    "roofSheetExtendedRoofWidthUnit" "QuantityUnit",
    "roofSheetExtendedRoofLength" DECIMAL(10,3),
    "roofSheetExtendedRoofLengthUnit" "QuantityUnit",
    "roofSheetRoofAreaDeductions" DECIMAL(10,3),
    "roofSheetRoofAreaDeductionsUnit" "QuantityUnit",
    "roofSheetPolycarbonateAreaDeduction" DECIMAL(10,3),
    "roofSheetPolycarbonateAreaDeductionUnit" "QuantityUnit",
    "polycarbonateSheetUnit" "QuantityUnit",
    "polycarbonateSheetQuantity" DECIMAL(10,3),
    "polycarbonateSheetPurchaseQuantity" DECIMAL(10,3),
    "polycarbonateSheetAdditionalQuantity" DECIMAL(10,3),
    "polycarbonateSheetSheetLength" DECIMAL(10,3),
    "polycarbonateSheetSheetLengthUnit" "QuantityUnit",
    "polycarbonateSheetSheetWidth" DECIMAL(10,3),
    "polycarbonateSheetSheetWidthUnit" "QuantityUnit",
    "polycarbonateSheetNumberOfSheets" INTEGER,
    "roofWindBracingsUnit" "QuantityUnit",
    "roofWindBracingsQuantity" DECIMAL(10,3),
    "roofWindBracingsAdditionalQuantity" DECIMAL(10,3),
    "roofWindBracingsSingleBracingLength" DECIMAL(10,3),
    "roofWindBracingsSingleBracingLengthUnit" "QuantityUnit",
    "roofWindBracingsTotalBracings" INTEGER,
    "roofWindBracingsUnitWeight" DECIMAL(10,3),
    "roofWindBracingsUnitWeightUnit" "QuantityUnit",
    "roofSagRodValue" DECIMAL(65,30),
    "roofSagRodUnit" "QuantityUnit",
    "roofSagRodQuantity" DECIMAL(10,3),
    "roofSagRodAdditionalQuantity" DECIMAL(10,3),
    "roofSagRodSingleSagRodLength" DECIMAL(10,3),
    "roofSagRodSingleSagRodLengthUnit" "QuantityUnit",
    "roofSagRodSagRodsPerFrame" INTEGER,
    "roofSagRodSagRodBays" INTEGER,
    "roofSagRodExtendedFrameSagRods" INTEGER,
    "roofSagRodExtendedSagRodBays" INTEGER,
    "roofSagRodUnitWeight" DECIMAL(10,3),
    "roofSagRodUnitWeightUnit" "QuantityUnit",
    "roofFlangeBraceUnit" "QuantityUnit",
    "roofFlangeBraceQuantity" DECIMAL(10,3),
    "roofFlangeBraceAdditionalQuantity" DECIMAL(10,3),
    "roofFlangeBraceMidFrameBraceLength" DECIMAL(10,3),
    "roofFlangeBraceMidFrameBraceLengthUnit" "QuantityUnit",
    "roofFlangeBraceMidFrameBraces" INTEGER,
    "roofFlangeBraceEndFrameBraces" INTEGER,
    "roofFlangeBraceMidFrames" INTEGER,
    "roofFlangeBraceEndFrames" INTEGER,
    "roofFlangeBraceExtendedFrameMidBraces" INTEGER,
    "roofFlangeBraceExtendedFrameEndBraces" INTEGER,
    "roofFlangeBraceExtendedMidFrames" INTEGER,
    "roofFlangeBraceExtendedEndFrames" INTEGER,
    "roofFlangeBraceEndFrameBraceLength" DECIMAL(10,3),
    "roofFlangeBraceEndFrameBraceLengthUnit" "QuantityUnit",
    "purlinBoltsSpecification" TEXT,
    "purlinBoltsUnit" "QuantityUnit",
    "purlinBoltsQuantity" DECIMAL(10,3),
    "purlinBoltsPurlinJointsPerFrame" INTEGER,
    "purlinBoltsTotalFrames" INTEGER,
    "purlinBoltsExtendedFramePurlinNodes" INTEGER,
    "purlinBoltsExtendedFrames" INTEGER,
    "purlinBoltsBoltsPerPurlinJoint" INTEGER,
    "roofJointBoltsSpecification" TEXT,
    "roofJointBoltsUnit" "QuantityUnit",
    "roofJointBoltsQuantity" DECIMAL(10,3),
    "foundationBoltsSpecification" TEXT,
    "foundationBoltsUnit" "QuantityUnit",
    "foundationBoltsQuantity" DECIMAL(10,3),
    "anchorBoltsSpecification" TEXT,
    "anchorBoltsUnit" "QuantityUnit",
    "anchorBoltsQuantity" DECIMAL(10,3),

    CONSTRAINT "QuantityPebRoof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuantityCladding" (
    "id" TEXT NOT NULL,
    "quantityId" TEXT NOT NULL,
    "claddingStructureUnit" "QuantityUnit",
    "claddingStructureQuantity" DECIMAL(10,3),
    "claddingStructureAdditionalQuantity" DECIMAL(10,3),
    "claddingStructureFrontEaveHeight" DECIMAL(10,3),
    "claddingStructureBackEaveHeight" DECIMAL(10,3),
    "claddingStructureRightEaveHeight" DECIMAL(10,3),
    "claddingStructureLeftEaveHeight" DECIMAL(10,3),
    "claddingStructureEaveHeightUnit" "QuantityUnit",
    "claddingStructureExtendedColumnHeight" DECIMAL(10,3),
    "claddingStructureExtendedColumnHeightUnit" "QuantityUnit",
    "claddingStructureExtendedFrameWidth" DECIMAL(10,3),
    "claddingStructureExtendedFrameWidthUnit" "QuantityUnit",
    "claddingStructureSideCladdingPurlins" INTEGER,
    "claddingStructureFaceCladdingPurlins" INTEGER,
    "claddingStructureTotalCladdingPurlinLength" DECIMAL(10,3),
    "claddingStructureTotalCladdingPurlinLengthUnit" "QuantityUnit",
    "claddingStructureTotalCladdingPurlinWeight" DECIMAL(10,3),
    "claddingStructureTotalCladdingPurlinWeightUnit" "QuantityUnit",
    "claddingStructureCladdingArea" DECIMAL(10,3),
    "claddingStructureCladdingAreaUnit" "QuantityUnit",
    "claddingStructureAverageMaterialConsumption" DECIMAL(10,3),
    "claddingStructureAverageMaterialConsumptionUnit" "QuantityUnit",
    "claddingStructureTotalOpenings" DECIMAL(10,3),
    "claddingStructureTotalOpeningsUnit" "QuantityUnit",
    "claddingStructureFasciaOpening" DECIMAL(10,3),
    "claddingStructureFasciaOpeningUnit" "QuantityUnit",
    "claddingSheetUnit" "QuantityUnit",
    "claddingSheetQuantity" DECIMAL(10,3),
    "claddingSheetPurchaseQuantity" DECIMAL(10,3),
    "columnWindBracingsUnit" "QuantityUnit",
    "columnWindBracingsQuantity" DECIMAL(10,3),
    "claddingSagRodUnit" "QuantityUnit",
    "claddingSagRodQuantity" DECIMAL(10,3),
    "claddingFlangeBraceUnit" "QuantityUnit",
    "claddingFlangeBraceQuantity" DECIMAL(10,3),
    "claddingPurlinBoltsUnit" "QuantityUnit",
    "claddingPurlinBoltsQuantity" DECIMAL(10,3),

    CONSTRAINT "QuantityCladding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuantityCanopy" (
    "id" TEXT NOT NULL,
    "quantityId" TEXT NOT NULL,
    "structureUnit" "QuantityUnit",
    "structureQuantity" DECIMAL(10,3),
    "structureCanopyArea" DECIMAL(10,3),
    "structureCanopyAreaUnit" "QuantityUnit",
    "purlinUnit" "QuantityUnit",
    "purlinQuantity" DECIMAL(10,3),
    "sheetUnit" "QuantityUnit",
    "sheetQuantity" DECIMAL(10,3),
    "sheetPurchaseQuantity" DECIMAL(10,3),
    "gutterUnit" "QuantityUnit",
    "gutterQuantity" DECIMAL(10,3),
    "downTakeUnit" "QuantityUnit",
    "downTakeQuantity" DECIMAL(10,3),
    "sideCoveringUnit" "QuantityUnit",
    "sideCoveringQuantity" DECIMAL(10,3),
    "flashingUnit" "QuantityUnit",
    "flashingQuantity" DECIMAL(10,3),
    "purlinBoltsUnit" "QuantityUnit",
    "purlinBoltsQuantity" DECIMAL(10,3),
    "jointBoltsUnit" "QuantityUnit",
    "jointBoltsQuantity" DECIMAL(10,3),

    CONSTRAINT "QuantityCanopy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuantityAccessories" (
    "id" TEXT NOT NULL,
    "quantityId" TEXT NOT NULL,
    "doorsCount" INTEGER,
    "doorsCountUnit" "QuantityUnit",
    "doorsArea" DECIMAL(10,3),
    "doorsAreaUnit" "QuantityUnit",
    "windowsCount" INTEGER,
    "windowsCountUnit" "QuantityUnit",
    "windowsArea" DECIMAL(10,3),
    "windowsAreaUnit" "QuantityUnit",
    "fasciaStructureUnit" "QuantityUnit",
    "fasciaStructureQuantity" DECIMAL(10,3),
    "fasciaCoveringSheetUnit" "QuantityUnit",
    "fasciaCoveringSheetQuantity" DECIMAL(10,3),
    "internalPartitionsUnit" "QuantityUnit",
    "internalPartitionsQuantity" DECIMAL(10,3),
    "ridgeUnit" "QuantityUnit",
    "ridgeQuantity" DECIMAL(10,3),
    "gutterUnit" "QuantityUnit",
    "gutterQuantity" DECIMAL(10,3),
    "downTakeUnit" "QuantityUnit",
    "downTakeQuantity" DECIMAL(10,3),
    "dripTrimUnit" "QuantityUnit",
    "dripTrimQuantity" DECIMAL(10,3),
    "gableEndFlashingUnit" "QuantityUnit",
    "gableEndFlashingQuantity" DECIMAL(10,3),
    "cornerFlashCount" INTEGER,
    "cornerFlashCountUnit" "QuantityUnit",
    "cornerFlashLength" DECIMAL(10,3),
    "cornerFlashLengthUnit" "QuantityUnit",
    "rollingShutterCount" INTEGER,
    "rollingShutterCountUnit" "QuantityUnit",
    "rollingShutterArea" DECIMAL(10,3),
    "rollingShutterAreaUnit" "QuantityUnit",
    "louversCount" INTEGER,
    "louversCountUnit" "QuantityUnit",
    "louversArea" DECIMAL(10,3),
    "louversAreaUnit" "QuantityUnit",
    "skyLightCount" INTEGER,
    "skyLightCountUnit" "QuantityUnit",
    "skyLightArea" DECIMAL(10,3),
    "skyLightAreaUnit" "QuantityUnit",
    "wallLightCount" INTEGER,
    "wallLightCountUnit" "QuantityUnit",
    "wallLightArea" DECIMAL(10,3),
    "wallLightAreaUnit" "QuantityUnit",
    "roofInsulationType" TEXT,
    "roofInsulationUnit" "QuantityUnit",
    "roofInsulationQuantity" DECIMAL(10,3),
    "wallInsulationType" TEXT,
    "wallInsulationUnit" "QuantityUnit",
    "wallInsulationQuantity" DECIMAL(10,3),
    "turboVentilatorsUnit" "QuantityUnit",
    "turboVentilatorsQuantity" DECIMAL(10,3),
    "handrailUnit" "QuantityUnit",
    "handrailQuantity" DECIMAL(10,3),

    CONSTRAINT "QuantityAccessories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuantityMezzanine" (
    "id" TEXT NOT NULL,
    "quantityId" TEXT NOT NULL,
    "structureUnit" "QuantityUnit",
    "structureQuantity" DECIMAL(10,3),
    "structureAdditionalQuantity" DECIMAL(10,3),
    "structureTotalArea" DECIMAL(10,3),
    "structureTotalAreaUnit" "QuantityUnit",
    "structureMaterialConsumption" DECIMAL(10,3),
    "structureMaterialConsumptionUnit" "QuantityUnit",
    "deckSheetUnit" "QuantityUnit",
    "deckSheetQuantity" DECIMAL(10,3),
    "deckSheetPurchaseQuantity" DECIMAL(10,3),
    "deckSheetAdditionalQuantity" DECIMAL(10,3),
    "shearStudsUnit" "QuantityUnit",
    "shearStudsQuantity" DECIMAL(10,3),
    "concreteFlashingUnit" "QuantityUnit",
    "concreteFlashingQuantity" DECIMAL(10,3),
    "jointBoltsSpecification" TEXT,
    "jointBoltsQuantity" DECIMAL(10,3),
    "foundationBoltsQuantity" DECIMAL(10,3),

    CONSTRAINT "QuantityMezzanine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuantityStair" (
    "id" TEXT NOT NULL,
    "quantityId" TEXT NOT NULL,
    "totalAreaUnit" "QuantityUnit",
    "totalAreaQuantity" DECIMAL(10,3),
    "stringerBeamsSection" TEXT,
    "stringerBeamsUnit" "QuantityUnit",
    "stringerBeamsQuantity" DECIMAL(10,3),
    "stringerBeamsAdditionalQuantity" DECIMAL(10,3),
    "stepsSpecification" TEXT,
    "stepsUnit" "QuantityUnit",
    "stepsQuantity" DECIMAL(10,3),
    "stepsAdditionalQuantity" DECIMAL(10,3),

    CONSTRAINT "QuantityStair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuantityAdditionalBolts" (
    "id" TEXT NOT NULL,
    "quantityId" TEXT NOT NULL,
    "jointBolt24mmHsfgUnit" "QuantityUnit",
    "jointBolt24mmHsfgQuantity" DECIMAL(10,3),
    "jointBolt20mmHsfgUnit" "QuantityUnit",
    "jointBolt20mmHsfgQuantity" DECIMAL(10,3),
    "jointBolt16mmHsfgUnit" "QuantityUnit",
    "jointBolt16mmHsfgQuantity" DECIMAL(10,3),
    "purlinBolt12mmOrdinaryUnit" "QuantityUnit",
    "purlinBolt12mmOrdinaryQuantity" DECIMAL(10,3),
    "anchorBoltUnit" "QuantityUnit",
    "anchorBoltQuantity" DECIMAL(10,3),
    "foundationBoltUnit" "QuantityUnit",
    "foundationBoltQuantity" DECIMAL(10,3),

    CONSTRAINT "QuantityAdditionalBolts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quantity_jobId_key" ON "Quantity"("jobId");

-- CreateIndex
CREATE INDEX "Quantity_createdAt_idx" ON "Quantity"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "QuantityPebRoof_quantityId_key" ON "QuantityPebRoof"("quantityId");

-- CreateIndex
CREATE UNIQUE INDEX "QuantityCladding_quantityId_key" ON "QuantityCladding"("quantityId");

-- CreateIndex
CREATE UNIQUE INDEX "QuantityCanopy_quantityId_key" ON "QuantityCanopy"("quantityId");

-- CreateIndex
CREATE UNIQUE INDEX "QuantityAccessories_quantityId_key" ON "QuantityAccessories"("quantityId");

-- CreateIndex
CREATE UNIQUE INDEX "QuantityMezzanine_quantityId_key" ON "QuantityMezzanine"("quantityId");

-- CreateIndex
CREATE UNIQUE INDEX "QuantityStair_quantityId_key" ON "QuantityStair"("quantityId");

-- CreateIndex
CREATE UNIQUE INDEX "QuantityAdditionalBolts_quantityId_key" ON "QuantityAdditionalBolts"("quantityId");

-- AddForeignKey
ALTER TABLE "Quantity" ADD CONSTRAINT "Quantity_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuantityPebRoof" ADD CONSTRAINT "QuantityPebRoof_quantityId_fkey" FOREIGN KEY ("quantityId") REFERENCES "Quantity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuantityCladding" ADD CONSTRAINT "QuantityCladding_quantityId_fkey" FOREIGN KEY ("quantityId") REFERENCES "Quantity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuantityCanopy" ADD CONSTRAINT "QuantityCanopy_quantityId_fkey" FOREIGN KEY ("quantityId") REFERENCES "Quantity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuantityAccessories" ADD CONSTRAINT "QuantityAccessories_quantityId_fkey" FOREIGN KEY ("quantityId") REFERENCES "Quantity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuantityMezzanine" ADD CONSTRAINT "QuantityMezzanine_quantityId_fkey" FOREIGN KEY ("quantityId") REFERENCES "Quantity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuantityStair" ADD CONSTRAINT "QuantityStair_quantityId_fkey" FOREIGN KEY ("quantityId") REFERENCES "Quantity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuantityAdditionalBolts" ADD CONSTRAINT "QuantityAdditionalBolts_quantityId_fkey" FOREIGN KEY ("quantityId") REFERENCES "Quantity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
