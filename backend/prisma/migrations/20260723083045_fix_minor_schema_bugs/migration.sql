/*
  Warnings:

  - The `code` column on the `CanopyItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `code` column on the `MezzanineFloor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `cornerFlashCount` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `cornerFlashCountUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `cornerFlashLength` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `cornerFlashLengthUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `doorsArea` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `doorsAreaUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `doorsCount` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `doorsCountUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `downTakeQuantity` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `downTakeUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `dripTrimUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `fasciaCoveringSheetQuantity` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `fasciaCoveringSheetUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `fasciaStructureUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `gableEndFlashingUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `gutterUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `handrailUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `internalPartitionsUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `louversArea` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `louversAreaUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `louversCount` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `louversCountUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `ridgeUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `rollingShutterArea` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `rollingShutterAreaUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `rollingShutterCount` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `rollingShutterCountUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `roofInsulationType` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `roofInsulationUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `skyLightArea` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `skyLightAreaUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `skyLightCount` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `skyLightCountUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `turboVentilatorsUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `wallInsulationType` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `wallInsulationUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `wallLightArea` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `wallLightAreaUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `wallLightCount` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `wallLightCountUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `windowsArea` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `windowsAreaUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `windowsCount` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `windowsCountUnit` on the `QuantityAccessories` table. All the data in the column will be lost.
  - You are about to drop the column `anchorBoltUnit` on the `QuantityAdditionalBolts` table. All the data in the column will be lost.
  - You are about to drop the column `foundationBoltUnit` on the `QuantityAdditionalBolts` table. All the data in the column will be lost.
  - You are about to drop the column `jointBolt16mmHsfgQuantity` on the `QuantityAdditionalBolts` table. All the data in the column will be lost.
  - You are about to drop the column `jointBolt16mmHsfgUnit` on the `QuantityAdditionalBolts` table. All the data in the column will be lost.
  - You are about to drop the column `jointBolt20mmHsfgQuantity` on the `QuantityAdditionalBolts` table. All the data in the column will be lost.
  - You are about to drop the column `jointBolt20mmHsfgUnit` on the `QuantityAdditionalBolts` table. All the data in the column will be lost.
  - You are about to drop the column `jointBolt24mmHsfgQuantity` on the `QuantityAdditionalBolts` table. All the data in the column will be lost.
  - You are about to drop the column `jointBolt24mmHsfgUnit` on the `QuantityAdditionalBolts` table. All the data in the column will be lost.
  - You are about to drop the column `purlinBolt12mmOrdinaryQuantity` on the `QuantityAdditionalBolts` table. All the data in the column will be lost.
  - You are about to drop the column `purlinBolt12mmOrdinaryUnit` on the `QuantityAdditionalBolts` table. All the data in the column will be lost.
  - You are about to drop the column `downTakeQuantity` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `downTakeUnit` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `flashingQuantity` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `flashingUnit` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `gutterQuantity` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `gutterUnit` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `jointBoltsQuantity` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `jointBoltsUnit` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `purlinBoltsQuantity` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `purlinBoltsUnit` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `purlinQuantity` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `purlinUnit` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `sheetPurchaseQuantity` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `sheetQuantity` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `sheetUnit` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `sideCoveringQuantity` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `sideCoveringUnit` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `structureCanopyArea` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `structureCanopyAreaUnit` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `structureQuantity` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `structureUnit` on the `QuantityCanopy` table. All the data in the column will be lost.
  - You are about to drop the column `claddingFlangeBraceQuantity` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingFlangeBraceUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingPurlinBoltsQuantity` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingPurlinBoltsUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingSagRodQuantity` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingSagRodUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingSheetPurchaseQuantity` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingSheetUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureAdditionalQuantity` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureAverageMaterialConsumption` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureAverageMaterialConsumptionUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureBackEaveHeight` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureCladdingArea` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureCladdingAreaUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureEaveHeightUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureExtendedColumnHeight` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureExtendedColumnHeightUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureExtendedFrameWidth` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureExtendedFrameWidthUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureFaceCladdingPurlins` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureFasciaOpening` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureFasciaOpeningUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureFrontEaveHeight` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureLeftEaveHeight` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureRightEaveHeight` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureSideCladdingPurlins` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureTotalCladdingPurlinLength` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureTotalCladdingPurlinLengthUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureTotalCladdingPurlinWeight` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureTotalCladdingPurlinWeightUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureTotalOpenings` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureTotalOpeningsUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `claddingStructureUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `columnWindBracingsQuantity` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `columnWindBracingsUnit` on the `QuantityCladding` table. All the data in the column will be lost.
  - You are about to drop the column `concreteFlashingQuantity` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `concreteFlashingUnit` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `deckSheetAdditionalQuantity` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `deckSheetUnit` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `jointBoltsSpecification` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `shearStudsUnit` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `structureAdditionalQuantity` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `structureMaterialConsumption` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `structureMaterialConsumptionUnit` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `structureQuantity` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `structureTotalArea` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `structureTotalAreaUnit` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `structureUnit` on the `QuantityMezzanine` table. All the data in the column will be lost.
  - You are about to drop the column `anchorBoltsQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `anchorBoltsSpecification` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `anchorBoltsUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `foundationBoltsQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `foundationBoltsSpecification` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `foundationBoltsUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `materialWithPurlinQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `materialWithPurlinUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `polycarbonateSheetAdditionalQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `polycarbonateSheetNumberOfSheets` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `polycarbonateSheetPurchaseQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `polycarbonateSheetQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `polycarbonateSheetSheetLength` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `polycarbonateSheetSheetLengthUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `polycarbonateSheetSheetWidth` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `polycarbonateSheetSheetWidthUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `polycarbonateSheetUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `purlinBoltsBoltsPerPurlinJoint` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `purlinBoltsExtendedFramePurlinNodes` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `purlinBoltsExtendedFrames` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `purlinBoltsPurlinJointsPerFrame` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `purlinBoltsQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `purlinBoltsSpecification` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `purlinBoltsTotalFrames` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `purlinBoltsUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `quantityPebRoofValue` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `raftersAndColumnsAdditionalQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `raftersAndColumnsBuildingLength` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `raftersAndColumnsBuildingLengthUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `raftersAndColumnsInclinedLengthOneHalf` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `raftersAndColumnsInclinedLengthUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `raftersAndColumnsMaterialConsumption` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `raftersAndColumnsMaterialConsumptionUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `raftersAndColumnsRoofArea` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `raftersAndColumnsRoofAreaUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `raftersAndColumnsSpecification` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `raftersAndColumnsUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceAdditionalQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceEndFrameBraceLength` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceEndFrameBraceLengthUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceEndFrameBraces` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceEndFrames` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceExtendedEndFrames` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceExtendedFrameEndBraces` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceExtendedFrameMidBraces` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceExtendedMidFrames` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceMidFrameBraceLength` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceMidFrameBraceLengthUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceMidFrameBraces` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceMidFrames` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofFlangeBraceUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofJointBoltsQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofJointBoltsSpecification` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofJointBoltsUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofPurlinesValue` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofPurlinsAdditionalQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofPurlinsExtendedFramePurlins` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofPurlinsExtendedPurlinBays` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofPurlinsPurlinUnitWeight` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofPurlinsPurlinUnitWeightUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofPurlinsPurlinsPerFrame` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofPurlinsSinglePurlinLength` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofPurlinsSinglePurlinLengthUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofPurlinsSpecification` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofPurlinsTotalPurlinBays` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofPurlinsUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSagRodAdditionalQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSagRodExtendedFrameSagRods` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSagRodExtendedSagRodBays` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSagRodQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSagRodSagRodBays` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSagRodSagRodsPerFrame` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSagRodSingleSagRodLength` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSagRodSingleSagRodLengthUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSagRodUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSagRodUnitWeight` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSagRodUnitWeightUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSagRodValue` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSheetAdditionalQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSheetExtendedRoofLength` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSheetExtendedRoofLengthUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSheetExtendedRoofWidth` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSheetExtendedRoofWidthUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSheetPolycarbonateAreaDeduction` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSheetPolycarbonateAreaDeductionUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSheetRoofAreaDeductions` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSheetRoofAreaDeductionsUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSheetSpecification` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofSheetUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofWindBracingsAdditionalQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofWindBracingsQuantity` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofWindBracingsSingleBracingLength` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofWindBracingsSingleBracingLengthUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofWindBracingsTotalBracings` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofWindBracingsUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofWindBracingsUnitWeight` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `roofWindBracingsUnitWeightUnit` on the `QuantityPebRoof` table. All the data in the column will be lost.
  - You are about to drop the column `stepsAdditionalQuantity` on the `QuantityStair` table. All the data in the column will be lost.
  - You are about to drop the column `stepsQuantity` on the `QuantityStair` table. All the data in the column will be lost.
  - You are about to drop the column `stepsSpecification` on the `QuantityStair` table. All the data in the column will be lost.
  - You are about to drop the column `stepsUnit` on the `QuantityStair` table. All the data in the column will be lost.
  - You are about to drop the column `stringerBeamsAdditionalQuantity` on the `QuantityStair` table. All the data in the column will be lost.
  - You are about to drop the column `stringerBeamsQuantity` on the `QuantityStair` table. All the data in the column will be lost.
  - You are about to drop the column `stringerBeamsSection` on the `QuantityStair` table. All the data in the column will be lost.
  - You are about to drop the column `stringerBeamsUnit` on the `QuantityStair` table. All the data in the column will be lost.
  - You are about to drop the column `totalAreaQuantity` on the `QuantityStair` table. All the data in the column will be lost.
  - You are about to drop the column `totalAreaUnit` on the `QuantityStair` table. All the data in the column will be lost.
  - You are about to drop the `AccessoryOpening` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CanopyCode" AS ENUM ('CANOPY-1', 'CANOPY-2', 'CANOPY-3', 'CANOPY-4', 'CANOPY-5', 'CANOPY-6', 'CANOPY-7', 'CANOPY-8', 'CANOPY-9', 'CANOPY-10');

-- CreateEnum
CREATE TYPE "MezzanineFloorCode" AS ENUM ('MEZ-1', 'MEZ-2', 'MEZ-3', 'MEZ-4', 'MEZ-5', 'MEZ-6', 'MEZ-7', 'MEZ-8', 'MEZ-9', 'MEZ-10', 'MEZ-11', 'MEZ-12');

-- DropForeignKey
ALTER TABLE "AccessoryOpening" DROP CONSTRAINT "AccessoryOpening_accessoriesId_fkey";

-- AlterTable
ALTER TABLE "Accessories" ADD COLUMN     "louverLength" DECIMAL(10,3),
ADD COLUMN     "louverNos" INTEGER,
ADD COLUMN     "louverQuantity" DECIMAL(10,3),
ADD COLUMN     "louverWidth" DECIMAL(10,3),
ADD COLUMN     "rollingShutterLength" DECIMAL(10,3),
ADD COLUMN     "rollingShutterNos" INTEGER,
ADD COLUMN     "rollingShutterQuantity" DECIMAL(10,3),
ADD COLUMN     "rollingShutterWidth" DECIMAL(10,3),
ADD COLUMN     "skyLightLength" DECIMAL(10,3),
ADD COLUMN     "skyLightNos" INTEGER,
ADD COLUMN     "skyLightQuantity" DECIMAL(10,3),
ADD COLUMN     "skyLightWidth" DECIMAL(10,3),
ADD COLUMN     "wallLightLength" DECIMAL(10,3),
ADD COLUMN     "wallLightNos" INTEGER,
ADD COLUMN     "wallLightQuantity" DECIMAL(10,3),
ADD COLUMN     "wallLightWidth" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "CanopyItem" DROP COLUMN "code",
ADD COLUMN     "code" "CanopyCode";

-- AlterTable
ALTER TABLE "MezzanineFloor" DROP COLUMN "code",
ADD COLUMN     "code" "MezzanineFloorCode";

-- AlterTable
ALTER TABLE "QuantityAccessories" DROP COLUMN "cornerFlashCount",
DROP COLUMN "cornerFlashCountUnit",
DROP COLUMN "cornerFlashLength",
DROP COLUMN "cornerFlashLengthUnit",
DROP COLUMN "doorsArea",
DROP COLUMN "doorsAreaUnit",
DROP COLUMN "doorsCount",
DROP COLUMN "doorsCountUnit",
DROP COLUMN "downTakeQuantity",
DROP COLUMN "downTakeUnit",
DROP COLUMN "dripTrimUnit",
DROP COLUMN "fasciaCoveringSheetQuantity",
DROP COLUMN "fasciaCoveringSheetUnit",
DROP COLUMN "fasciaStructureUnit",
DROP COLUMN "gableEndFlashingUnit",
DROP COLUMN "gutterUnit",
DROP COLUMN "handrailUnit",
DROP COLUMN "internalPartitionsUnit",
DROP COLUMN "louversArea",
DROP COLUMN "louversAreaUnit",
DROP COLUMN "louversCount",
DROP COLUMN "louversCountUnit",
DROP COLUMN "ridgeUnit",
DROP COLUMN "rollingShutterArea",
DROP COLUMN "rollingShutterAreaUnit",
DROP COLUMN "rollingShutterCount",
DROP COLUMN "rollingShutterCountUnit",
DROP COLUMN "roofInsulationType",
DROP COLUMN "roofInsulationUnit",
DROP COLUMN "skyLightArea",
DROP COLUMN "skyLightAreaUnit",
DROP COLUMN "skyLightCount",
DROP COLUMN "skyLightCountUnit",
DROP COLUMN "turboVentilatorsUnit",
DROP COLUMN "wallInsulationType",
DROP COLUMN "wallInsulationUnit",
DROP COLUMN "wallLightArea",
DROP COLUMN "wallLightAreaUnit",
DROP COLUMN "wallLightCount",
DROP COLUMN "wallLightCountUnit",
DROP COLUMN "windowsArea",
DROP COLUMN "windowsAreaUnit",
DROP COLUMN "windowsCount",
DROP COLUMN "windowsCountUnit",
ADD COLUMN     "cornerFlashQuantity" DECIMAL(10,3),
ADD COLUMN     "doors" DECIMAL(10,3),
ADD COLUMN     "doorsQuantity" DECIMAL(10,3),
ADD COLUMN     "downtakeQuantity" DECIMAL(10,3),
ADD COLUMN     "fasciaCoveringSheetBoardQuantity" DECIMAL(10,3),
ADD COLUMN     "louvers" DECIMAL(10,3),
ADD COLUMN     "louversQuantity" DECIMAL(10,3),
ADD COLUMN     "rollingShutter" DECIMAL(10,3),
ADD COLUMN     "rollingShutterQuantity" DECIMAL(10,3),
ADD COLUMN     "roofInsulation" DECIMAL(10,3),
ADD COLUMN     "skyLight" DECIMAL(10,3),
ADD COLUMN     "skyLightQuantity" DECIMAL(10,3),
ADD COLUMN     "wallInsulation" DECIMAL(10,3),
ADD COLUMN     "wallLight" DECIMAL(10,3),
ADD COLUMN     "wallLightQuantity" DECIMAL(10,3),
ADD COLUMN     "windows" DECIMAL(10,3),
ADD COLUMN     "windowsQuantity" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "QuantityAdditionalBolts" DROP COLUMN "anchorBoltUnit",
DROP COLUMN "foundationBoltUnit",
DROP COLUMN "jointBolt16mmHsfgQuantity",
DROP COLUMN "jointBolt16mmHsfgUnit",
DROP COLUMN "jointBolt20mmHsfgQuantity",
DROP COLUMN "jointBolt20mmHsfgUnit",
DROP COLUMN "jointBolt24mmHsfgQuantity",
DROP COLUMN "jointBolt24mmHsfgUnit",
DROP COLUMN "purlinBolt12mmOrdinaryQuantity",
DROP COLUMN "purlinBolt12mmOrdinaryUnit",
ADD COLUMN     "jointBolt1Quantity" DECIMAL(10,3),
ADD COLUMN     "jointBolt2Quantity" DECIMAL(10,3),
ADD COLUMN     "jointBolt3Quantity" DECIMAL(10,3),
ADD COLUMN     "purlinBoltQuantity" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "QuantityCanopy" DROP COLUMN "downTakeQuantity",
DROP COLUMN "downTakeUnit",
DROP COLUMN "flashingQuantity",
DROP COLUMN "flashingUnit",
DROP COLUMN "gutterQuantity",
DROP COLUMN "gutterUnit",
DROP COLUMN "jointBoltsQuantity",
DROP COLUMN "jointBoltsUnit",
DROP COLUMN "purlinBoltsQuantity",
DROP COLUMN "purlinBoltsUnit",
DROP COLUMN "purlinQuantity",
DROP COLUMN "purlinUnit",
DROP COLUMN "sheetPurchaseQuantity",
DROP COLUMN "sheetQuantity",
DROP COLUMN "sheetUnit",
DROP COLUMN "sideCoveringQuantity",
DROP COLUMN "sideCoveringUnit",
DROP COLUMN "structureCanopyArea",
DROP COLUMN "structureCanopyAreaUnit",
DROP COLUMN "structureQuantity",
DROP COLUMN "structureUnit",
ADD COLUMN     "canopyArea" DECIMAL(10,3),
ADD COLUMN     "canopyDownTakeQuantity" DECIMAL(10,3),
ADD COLUMN     "canopyFlashingQuantity" DECIMAL(10,3),
ADD COLUMN     "canopyGutterQuantity" DECIMAL(10,3),
ADD COLUMN     "canopyJointBoltsQuantity" DECIMAL(10,3),
ADD COLUMN     "canopyPurlinBoltsQuantity" DECIMAL(10,3),
ADD COLUMN     "canopyPurlinQuantity" DECIMAL(10,3),
ADD COLUMN     "canopySheetPurchaseQuantity" DECIMAL(10,3),
ADD COLUMN     "canopySheetQuantity" DECIMAL(10,3),
ADD COLUMN     "canopySideCoveringQuantity" DECIMAL(10,3),
ADD COLUMN     "canopyStructureQuantity" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "QuantityCladding" DROP COLUMN "claddingFlangeBraceQuantity",
DROP COLUMN "claddingFlangeBraceUnit",
DROP COLUMN "claddingPurlinBoltsQuantity",
DROP COLUMN "claddingPurlinBoltsUnit",
DROP COLUMN "claddingSagRodQuantity",
DROP COLUMN "claddingSagRodUnit",
DROP COLUMN "claddingSheetPurchaseQuantity",
DROP COLUMN "claddingSheetUnit",
DROP COLUMN "claddingStructureAdditionalQuantity",
DROP COLUMN "claddingStructureAverageMaterialConsumption",
DROP COLUMN "claddingStructureAverageMaterialConsumptionUnit",
DROP COLUMN "claddingStructureBackEaveHeight",
DROP COLUMN "claddingStructureCladdingArea",
DROP COLUMN "claddingStructureCladdingAreaUnit",
DROP COLUMN "claddingStructureEaveHeightUnit",
DROP COLUMN "claddingStructureExtendedColumnHeight",
DROP COLUMN "claddingStructureExtendedColumnHeightUnit",
DROP COLUMN "claddingStructureExtendedFrameWidth",
DROP COLUMN "claddingStructureExtendedFrameWidthUnit",
DROP COLUMN "claddingStructureFaceCladdingPurlins",
DROP COLUMN "claddingStructureFasciaOpening",
DROP COLUMN "claddingStructureFasciaOpeningUnit",
DROP COLUMN "claddingStructureFrontEaveHeight",
DROP COLUMN "claddingStructureLeftEaveHeight",
DROP COLUMN "claddingStructureRightEaveHeight",
DROP COLUMN "claddingStructureSideCladdingPurlins",
DROP COLUMN "claddingStructureTotalCladdingPurlinLength",
DROP COLUMN "claddingStructureTotalCladdingPurlinLengthUnit",
DROP COLUMN "claddingStructureTotalCladdingPurlinWeight",
DROP COLUMN "claddingStructureTotalCladdingPurlinWeightUnit",
DROP COLUMN "claddingStructureTotalOpenings",
DROP COLUMN "claddingStructureTotalOpeningsUnit",
DROP COLUMN "claddingStructureUnit",
DROP COLUMN "columnWindBracingsQuantity",
DROP COLUMN "columnWindBracingsUnit",
ADD COLUMN     "averageMaterialConsumption" DECIMAL(10,3),
ADD COLUMN     "claddingAreaWithoutAnyDeductions" DECIMAL(10,3),
ADD COLUMN     "claddingEaveHeightBack" DECIMAL(10,3),
ADD COLUMN     "claddingEaveHeightFront" DECIMAL(10,3),
ADD COLUMN     "claddingEaveHeightFrontAdditional" DECIMAL(10,3),
ADD COLUMN     "claddingEaveHeightLeft" DECIMAL(10,3),
ADD COLUMN     "claddingEaveHeightRight" DECIMAL(10,3),
ADD COLUMN     "claddingFlangeBrace" DECIMAL(10,3),
ADD COLUMN     "claddingFlangeBraceAdditional" DECIMAL(10,3),
ADD COLUMN     "claddingSagRod" DECIMAL(10,3),
ADD COLUMN     "claddingSagRodAdditional" DECIMAL(10,3),
ADD COLUMN     "claddingSheetAdditional" DECIMAL(10,3),
ADD COLUMN     "claddingSheetPurchase" DECIMAL(10,3),
ADD COLUMN     "columnWindBracings" DECIMAL(10,3),
ADD COLUMN     "columnWindBracingsAdditional" DECIMAL(10,3),
ADD COLUMN     "extendedColumnHeight" DECIMAL(10,3),
ADD COLUMN     "fasciaOpening" DECIMAL(10,3),
ADD COLUMN     "noOfFaceCladdingPurlin" INTEGER,
ADD COLUMN     "noOfSideCladdingPurlin" INTEGER,
ADD COLUMN     "numberOfCladdingPurlinBolts" DECIMAL(10,3),
ADD COLUMN     "numberOfCladdingPurlinBoltsAdditional" DECIMAL(10,3),
ADD COLUMN     "totalCladdingOpenings" DECIMAL(10,3),
ADD COLUMN     "totalLengthOfCladdingPurlin" DECIMAL(10,3),
ADD COLUMN     "totalWeightofCladdingPurlin" DECIMAL(10,3),
ADD COLUMN     "widthOfExtendedFrame" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "QuantityMezzanine" DROP COLUMN "concreteFlashingQuantity",
DROP COLUMN "concreteFlashingUnit",
DROP COLUMN "deckSheetAdditionalQuantity",
DROP COLUMN "deckSheetUnit",
DROP COLUMN "jointBoltsSpecification",
DROP COLUMN "shearStudsUnit",
DROP COLUMN "structureAdditionalQuantity",
DROP COLUMN "structureMaterialConsumption",
DROP COLUMN "structureMaterialConsumptionUnit",
DROP COLUMN "structureQuantity",
DROP COLUMN "structureTotalArea",
DROP COLUMN "structureTotalAreaUnit",
DROP COLUMN "structureUnit",
ADD COLUMN     "concreteFlashing" DECIMAL(10,3),
ADD COLUMN     "deckSheetQuantityAdditional" DECIMAL(10,3),
ADD COLUMN     "jointBolts" DECIMAL(10,3),
ADD COLUMN     "materialConsumption" DECIMAL(10,3),
ADD COLUMN     "mezzanineStructureQuantity" DECIMAL(10,3),
ADD COLUMN     "shearStudsQuantityAdditional" DECIMAL(10,3),
ADD COLUMN     "totalMezzanineArea" DECIMAL(10,3),
ADD COLUMN     "totalMezzanineAreaQuantity" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "QuantityPebRoof" DROP COLUMN "anchorBoltsQuantity",
DROP COLUMN "anchorBoltsSpecification",
DROP COLUMN "anchorBoltsUnit",
DROP COLUMN "foundationBoltsQuantity",
DROP COLUMN "foundationBoltsSpecification",
DROP COLUMN "foundationBoltsUnit",
DROP COLUMN "materialWithPurlinQuantity",
DROP COLUMN "materialWithPurlinUnit",
DROP COLUMN "polycarbonateSheetAdditionalQuantity",
DROP COLUMN "polycarbonateSheetNumberOfSheets",
DROP COLUMN "polycarbonateSheetPurchaseQuantity",
DROP COLUMN "polycarbonateSheetQuantity",
DROP COLUMN "polycarbonateSheetSheetLength",
DROP COLUMN "polycarbonateSheetSheetLengthUnit",
DROP COLUMN "polycarbonateSheetSheetWidth",
DROP COLUMN "polycarbonateSheetSheetWidthUnit",
DROP COLUMN "polycarbonateSheetUnit",
DROP COLUMN "purlinBoltsBoltsPerPurlinJoint",
DROP COLUMN "purlinBoltsExtendedFramePurlinNodes",
DROP COLUMN "purlinBoltsExtendedFrames",
DROP COLUMN "purlinBoltsPurlinJointsPerFrame",
DROP COLUMN "purlinBoltsQuantity",
DROP COLUMN "purlinBoltsSpecification",
DROP COLUMN "purlinBoltsTotalFrames",
DROP COLUMN "purlinBoltsUnit",
DROP COLUMN "quantityPebRoofValue",
DROP COLUMN "raftersAndColumnsAdditionalQuantity",
DROP COLUMN "raftersAndColumnsBuildingLength",
DROP COLUMN "raftersAndColumnsBuildingLengthUnit",
DROP COLUMN "raftersAndColumnsInclinedLengthOneHalf",
DROP COLUMN "raftersAndColumnsInclinedLengthUnit",
DROP COLUMN "raftersAndColumnsMaterialConsumption",
DROP COLUMN "raftersAndColumnsMaterialConsumptionUnit",
DROP COLUMN "raftersAndColumnsRoofArea",
DROP COLUMN "raftersAndColumnsRoofAreaUnit",
DROP COLUMN "raftersAndColumnsSpecification",
DROP COLUMN "raftersAndColumnsUnit",
DROP COLUMN "roofFlangeBraceAdditionalQuantity",
DROP COLUMN "roofFlangeBraceEndFrameBraceLength",
DROP COLUMN "roofFlangeBraceEndFrameBraceLengthUnit",
DROP COLUMN "roofFlangeBraceEndFrameBraces",
DROP COLUMN "roofFlangeBraceEndFrames",
DROP COLUMN "roofFlangeBraceExtendedEndFrames",
DROP COLUMN "roofFlangeBraceExtendedFrameEndBraces",
DROP COLUMN "roofFlangeBraceExtendedFrameMidBraces",
DROP COLUMN "roofFlangeBraceExtendedMidFrames",
DROP COLUMN "roofFlangeBraceMidFrameBraceLength",
DROP COLUMN "roofFlangeBraceMidFrameBraceLengthUnit",
DROP COLUMN "roofFlangeBraceMidFrameBraces",
DROP COLUMN "roofFlangeBraceMidFrames",
DROP COLUMN "roofFlangeBraceUnit",
DROP COLUMN "roofJointBoltsQuantity",
DROP COLUMN "roofJointBoltsSpecification",
DROP COLUMN "roofJointBoltsUnit",
DROP COLUMN "roofPurlinesValue",
DROP COLUMN "roofPurlinsAdditionalQuantity",
DROP COLUMN "roofPurlinsExtendedFramePurlins",
DROP COLUMN "roofPurlinsExtendedPurlinBays",
DROP COLUMN "roofPurlinsPurlinUnitWeight",
DROP COLUMN "roofPurlinsPurlinUnitWeightUnit",
DROP COLUMN "roofPurlinsPurlinsPerFrame",
DROP COLUMN "roofPurlinsSinglePurlinLength",
DROP COLUMN "roofPurlinsSinglePurlinLengthUnit",
DROP COLUMN "roofPurlinsSpecification",
DROP COLUMN "roofPurlinsTotalPurlinBays",
DROP COLUMN "roofPurlinsUnit",
DROP COLUMN "roofSagRodAdditionalQuantity",
DROP COLUMN "roofSagRodExtendedFrameSagRods",
DROP COLUMN "roofSagRodExtendedSagRodBays",
DROP COLUMN "roofSagRodQuantity",
DROP COLUMN "roofSagRodSagRodBays",
DROP COLUMN "roofSagRodSagRodsPerFrame",
DROP COLUMN "roofSagRodSingleSagRodLength",
DROP COLUMN "roofSagRodSingleSagRodLengthUnit",
DROP COLUMN "roofSagRodUnit",
DROP COLUMN "roofSagRodUnitWeight",
DROP COLUMN "roofSagRodUnitWeightUnit",
DROP COLUMN "roofSagRodValue",
DROP COLUMN "roofSheetAdditionalQuantity",
DROP COLUMN "roofSheetExtendedRoofLength",
DROP COLUMN "roofSheetExtendedRoofLengthUnit",
DROP COLUMN "roofSheetExtendedRoofWidth",
DROP COLUMN "roofSheetExtendedRoofWidthUnit",
DROP COLUMN "roofSheetPolycarbonateAreaDeduction",
DROP COLUMN "roofSheetPolycarbonateAreaDeductionUnit",
DROP COLUMN "roofSheetRoofAreaDeductions",
DROP COLUMN "roofSheetRoofAreaDeductionsUnit",
DROP COLUMN "roofSheetSpecification",
DROP COLUMN "roofSheetUnit",
DROP COLUMN "roofWindBracingsAdditionalQuantity",
DROP COLUMN "roofWindBracingsQuantity",
DROP COLUMN "roofWindBracingsSingleBracingLength",
DROP COLUMN "roofWindBracingsSingleBracingLengthUnit",
DROP COLUMN "roofWindBracingsTotalBracings",
DROP COLUMN "roofWindBracingsUnit",
DROP COLUMN "roofWindBracingsUnitWeight",
DROP COLUMN "roofWindBracingsUnitWeightUnit",
ADD COLUMN     "NosOfpolyCarbonateSheet" INTEGER,
ADD COLUMN     "extendedRoofLength" DECIMAL(10,3),
ADD COLUMN     "extendedRoofWidth" DECIMAL(10,3),
ADD COLUMN     "extendedRoofWidthAdditonal" DECIMAL(10,3),
ADD COLUMN     "inclinedLengthInOneHalf" DECIMAL(10,3),
ADD COLUMN     "lengthOfBuilding" DECIMAL(10,3),
ADD COLUMN     "lengthOfBuildingQuantity" DECIMAL(10,3),
ADD COLUMN     "lengthOfEndFrameFlangeBrace" DECIMAL(10,3),
ADD COLUMN     "lengthOfMidFrameFlangeBrace" DECIMAL(10,3),
ADD COLUMN     "lengthOfMidFrameFlangeBraceAdditional" DECIMAL(10,3),
ADD COLUMN     "lengthOfOnePurlin" DECIMAL(10,3),
ADD COLUMN     "lengthOfOnePurlinQuantity" DECIMAL(10,3),
ADD COLUMN     "lengthOfSingleSagRoad" DECIMAL(10,3),
ADD COLUMN     "lengthOfSingleSagRoadAdditional" DECIMAL(10,3),
ADD COLUMN     "lengthOfSinlgeWindBracing" DECIMAL(10,3),
ADD COLUMN     "lengthOfSinlgeWindBracingAdditional" DECIMAL(10,3),
ADD COLUMN     "lengthOfpolyCarbonateSheet" DECIMAL(10,3),
ADD COLUMN     "lengthOfpolyCarbonateSheetAdditional" DECIMAL(10,3),
ADD COLUMN     "materialConsumption" DECIMAL(10,3),
ADD COLUMN     "noOfBayInSagRodProvided" INTEGER,
ADD COLUMN     "noOfBoltsInSinglePurlinJoint" INTEGER,
ADD COLUMN     "noOfEndFrame" INTEGER,
ADD COLUMN     "noOfExtendedEndFrame" INTEGER,
ADD COLUMN     "noOfExtendedFrame" INTEGER,
ADD COLUMN     "noOfExtendedFrames" INTEGER,
ADD COLUMN     "noOfExtendedMidFrame" INTEGER,
ADD COLUMN     "noOfExtendedPurlinBay" INTEGER,
ADD COLUMN     "noOfExtendedSagRodBay" INTEGER,
ADD COLUMN     "noOfFlangeBraceInEndFrame" INTEGER,
ADD COLUMN     "noOfFlangeBraceInMidFrame" INTEGER,
ADD COLUMN     "noOfFlngBraceInExtendedFrame" INTEGER,
ADD COLUMN     "noOfFlngBraceInExtendedFrame2" INTEGER,
ADD COLUMN     "noOfMidFrame" INTEGER,
ADD COLUMN     "noOfPurlinJointInSingleFrame" INTEGER,
ADD COLUMN     "noOfPurlinnodeInExtendedFrame" INTEGER,
ADD COLUMN     "noOfPurlinsInOneFrame" INTEGER,
ADD COLUMN     "noOfSagRodInASingleFrame" INTEGER,
ADD COLUMN     "noOfSagRodInExtendedFrame" INTEGER,
ADD COLUMN     "numberOfAnchorBolts" DECIMAL(10,3),
ADD COLUMN     "numberOfFoundationBolts" DECIMAL(10,3),
ADD COLUMN     "numberOfPurlinBolts" DECIMAL(10,3),
ADD COLUMN     "numberOfPurlinBoltsQuantity" DECIMAL(10,3),
ADD COLUMN     "numberOfRoofJointBolts" DECIMAL(10,3),
ADD COLUMN     "pebRoofQuantity" DECIMAL(10,3),
ADD COLUMN     "pebRoofValue" DECIMAL(10,3),
ADD COLUMN     "polyCarbonateAreaDeductions" DECIMAL(10,3),
ADD COLUMN     "polyCarbonateSheetPurchaseQuantity" DECIMAL(10,3),
ADD COLUMN     "polyCarbonateSheetQuantity" DECIMAL(10,3),
ADD COLUMN     "raftersAndColumns" DECIMAL(10,3),
ADD COLUMN     "roofArea" DECIMAL(10,3),
ADD COLUMN     "roofAreaDeductions" DECIMAL(10,3),
ADD COLUMN     "roofPurlins" DECIMAL(10,3),
ADD COLUMN     "roofPurlinsValue" DECIMAL(10,3),
ADD COLUMN     "roofSagRoadQuantity" DECIMAL(10,3),
ADD COLUMN     "roofSagRoadValue" DECIMAL(10,3),
ADD COLUMN     "roofSheet" DECIMAL(10,3),
ADD COLUMN     "roofWindBracing" DECIMAL(10,3),
ADD COLUMN     "totalNoOfPurlinBay" INTEGER,
ADD COLUMN     "totalNumberOfWindBracing" INTEGER,
ADD COLUMN     "totalnoOfFrames" INTEGER,
ADD COLUMN     "unitWeightOfPurlin" DECIMAL(10,3),
ADD COLUMN     "unitWeightOfRoofWindBracing" DECIMAL(10,3),
ADD COLUMN     "unitWeightOfSagRod" DECIMAL(10,3),
ADD COLUMN     "widthOfpolyCarbonateSheet" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "QuantityStair" DROP COLUMN "stepsAdditionalQuantity",
DROP COLUMN "stepsQuantity",
DROP COLUMN "stepsSpecification",
DROP COLUMN "stepsUnit",
DROP COLUMN "stringerBeamsAdditionalQuantity",
DROP COLUMN "stringerBeamsQuantity",
DROP COLUMN "stringerBeamsSection",
DROP COLUMN "stringerBeamsUnit",
DROP COLUMN "totalAreaQuantity",
DROP COLUMN "totalAreaUnit",
ADD COLUMN     "totalAreaOfStairQuantity" DECIMAL(10,3),
ADD COLUMN     "totalWeightofSteps" DECIMAL(10,3),
ADD COLUMN     "totalWeightofStepsAdditional" DECIMAL(10,3),
ADD COLUMN     "totalWeightofStepsQuantity" DECIMAL(10,3),
ADD COLUMN     "totalWeightofStringerBeams" DECIMAL(10,3),
ADD COLUMN     "totalWeightofStringerBeamsAdditional" DECIMAL(10,3),
ADD COLUMN     "totalWeightofStringerBeamsQuantity" DECIMAL(10,3);

-- DropTable
DROP TABLE "AccessoryOpening";

-- DropEnum
DROP TYPE "AccessoryOpeningKind";

-- DropEnum
DROP TYPE "QuantityUnit";

-- CreateIndex
CREATE UNIQUE INDEX "CanopyItem_canopyId_code_key" ON "CanopyItem"("canopyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "MezzanineFloor_mezzanineId_code_key" ON "MezzanineFloor"("mezzanineId", "code");
