import type { RowDef } from '@/components/quotation/shared/SectionTable'

import type {
  calculatePebQuantities,
  calculateCladdingQuantities,
  calculateCanopyQuantities,
  calculateAccessoriesQuantities,
  calculateMezzanineQuantities,
  calculateStairQuantities,
  calculateAdditionalBoltsQuantities
} from '@floreat/shared/calc'

type PebCalc = ReturnType<typeof calculatePebQuantities>
type CladdingCalc = ReturnType<typeof calculateCladdingQuantities>
type CanopyCalc = ReturnType<typeof calculateCanopyQuantities>
type AccessoriesCalc = ReturnType<typeof calculateAccessoriesQuantities>
type MezzanineCalc = ReturnType<typeof calculateMezzanineQuantities>
type StairCalc = ReturnType<typeof calculateStairQuantities>
type AdditionalBoltsCalc = ReturnType<typeof calculateAdditionalBoltsQuantities>

export const getPebRoofRows = (calc: PebCalc): RowDef[] => [
  { "sl": "1", "labelPrefix": calc.pebRoof?.pebRoofValue, "label": "PEB ROOF", "spec": "MATERIAL WITH PURLIN", "unit": "KG/SQFT", "qtyField": "pebRoofQuantity", "unitField": "materialWithPurlinUnit", "subRows": [], "isCalculated": true, "calcValue": calc.pebRoof?.pebRoofQuantity },
  {
    "sl": "1.1", "label": "Rafters & columns", "spec": calc.raftersAndColumns?.raftersAndColumns || "", "unit": "KG", "qtyField": "raftersAndColumnsQuantity", "unitField": "raftersAndColumnsUnit", "calcValue": calc.raftersAndColumns?.raftersAndColumnsQuantity,
    "subRows": [
      { "sl": "a", "desc": "LENGTH OF BUILDING", "spec": String(calc.raftersAndColumns?.lengthOfBuilding || ""), "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "lengthOfBuildingQuantity" },
      { "sl": "b", "desc": "INCLINED LENGTH IN ONE HALF", "spec": String(calc.raftersAndColumns?.inclinedLengthInOneHalf || ""), "unit": "M" },
      { "sl": "c", "desc": "ROOF AREA", "spec": String(calc.raftersAndColumns?.roofArea || ""), "unit": "SQFT" },
      { "sl": "d", "desc": "MATERIAL CONSUMPTION", "spec": String(calc.raftersAndColumns?.materialConsumption || ""), "unit": "KG/SQFT" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.2", "label": "Roof purlins", "labelSuffix": String(calc.roofPurlins?.roofPurlinsValue || ""), "spec": calc.roofPurlins?.roofPurlins || "", "unit": "KG", "qtyField": "roofPurlinsQuantity", "unitField": "roofPurlinsUnit", "calcValue": calc.roofPurlins?.roofPurlinsQuantity,
    "subRows": [
      { "sl": "a", "desc": "LENGTH OF ONE PURLIN", "spec": String(calc.roofPurlins?.lengthOfOnePurlin || ""), "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "lengthOfOnePurlinQuantity" },
      { "sl": "b", "desc": "NO.OF.PURLINS IN ONE FRAME", "spec": String(calc.roofPurlins?.noOfPurlinsInOneFrame || ""), "unit": "NOS" },
      { "sl": "c", "desc": "TOTAL NO.OF PURLIN BAY", "spec": String(calc.roofPurlins?.totalNoOfPurlinBay || ""), "unit": "NOS" },
      { "sl": "d", "desc": "UNIT WEIGHT OF PURLIN", "spec": String(calc.roofPurlins?.unitWeightOfPurlin || ""), "unit": "KG/M" },
      { "sl": "e", "desc": "NO.OF.PURLINS IN EXTENDED FRAME", "spec": String(calc.roofPurlins?.noOfExtendedFrame || ""), "unit": "NOS" },
      { "sl": "f", "desc": "NO.OF EXTENDED PURLIN BAY", "spec": String(calc.roofPurlins?.noOfExtendedPurlinBay || ""), "unit": "NOS" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.3", "label": "Roof sheet", "spec": calc.roofSheet?.roofSheet || "", "unit": "SQM", "qtyField": "roofSheetQuantity", "unitField": "roofSheetUnit", "calcValue": calc.roofSheet?.roofSheetQuantity,
    "subRows": [
      { "sl": "", "desc": "", "spec": "PURCHASE QUANTITY", "unit": "SQM", "purchField": "roofSheetPurchaseQuantity", "isCalculated": true, "calcPurchValue": calc.roofSheet?.roofSheetPurchaseQuantity },
      { "sl": "a", "desc": "EXTENDED ROOF WIDTH", "spec": String(calc.roofSheet?.extendedRoofWidth || ""), "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "SQM", "addlField": "extendedRoofWidthAdditonal" },
      { "sl": "b", "desc": "EXTENDED ROOF LENGTH", "spec": String(calc.roofSheet?.extendedRoofLength || ""), "unit": "M" },
      { "sl": "c", "desc": "ROOF AREA DEDUCTIONS", "spec": String(calc.roofSheet?.roofAreaDeductions || ""), "unit": "SQM" },
      { "sl": "d", "desc": "POLY CARBONATE AREA DEDUCTION", "spec": String(calc.roofSheet?.polyCarbonateAreaDeductions || ""), "unit": "SQM" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.4", "label": "Polycarbonate sheet", "spec": "", "unit": "SQM", "qtyField": "polyCarbonateSheetQuantity", "unitField": "polycarbonateSheetUnit", "calcValue": calc.polyCarbonateSheet?.polyCarbonateSheetQuantity,
    "subRows": [
      { "sl": "", "desc": "", "spec": "PURCHASE QUANTITY", "unit": "SQM", "purchField": "polyCarbonateSheetPurchaseQuantity", "isCalculated": true, "calcPurchValue": calc.polyCarbonateSheet?.polyCarbonateSheetPurchaseQuantity },
      { "sl": "a", "desc": "LENGTH OF POLYCARBONATE SHEET", "spec": String(calc.polyCarbonateSheet?.lengthOfpolyCarbonateSheet || ""), "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "SQM", "addlField": "lengthOfpolyCarbonateSheetAdditional" },
      { "sl": "b", "desc": "WIDTH OF POLYCARBONATE SHEET", "spec": String(calc.polyCarbonateSheet?.widthOfpolyCarbonateSheet || ""), "unit": "M" },
      { "sl": "c", "desc": "NOS OF POLYCARBONATE SHEET", "spec": String(calc.polyCarbonateSheet?.NosOfpolyCarbonateSheet || ""), "unit": "NOS" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.5", "label": "Roof wind bracings", "spec": "", "unit": "KG", "qtyField": "roofWindBracing", "unitField": "roofWindBracingsUnit", "calcValue": calc.roofWindBracing?.roofWindBracing,
    "subRows": [
      { "sl": "a", "desc": "LENGTH OF ROOF SINGLE WIND BRACING", "spec": String(calc.roofWindBracing?.lengthOfSinlgeWindBracing || ""), "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "lengthOfSinlgeWindBracingAdditional" },
      { "sl": "b", "desc": "TOTAL NUMBER OF ROOF WIND BRACING", "spec": String(calc.roofWindBracing?.totalNumberOfWindBracing || ""), "unit": "NOS" },
      { "sl": "c", "desc": "UNIT WEIGHT OF ROOF WIND BRACING", "spec": String(calc.roofWindBracing?.unitWeightOfRoofWindBracing || ""), "unit": "KG/M" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.6", "label": "Roof sag rod", "labelSuffix": String(calc.roofSagRoad?.roofSagRoadValue || ""), "spec": "", "unit": "KG", "qtyField": "roofSagRoadQuantity", "unitField": "roofSagRodUnit", "calcValue": calc.roofSagRoad?.roofSagRoadQuantity,
    "subRows": [
      { "sl": "a", "desc": "LENGTH OF SINGLE SAG ROD", "spec": String(calc.roofSagRoad?.lengthOfSingleSagRoad || ""), "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "lengthOfSingleSagRoadAdditional" },
      { "sl": "b", "desc": "NO.OF SAG ROD IN A SINGLE FRAME", "spec": String(calc.roofSagRoad?.noOfSagRodInASingleFrame || ""), "unit": "" },
      { "sl": "c", "desc": "NO.OF BAY IN SAG ROD PROVIDED", "spec": String(calc.roofSagRoad?.noOfBayInSagRodProvided || ""), "unit": "" },
      { "sl": "d", "desc": "NO.OF.SAG ROD IN EXTENDED FRAME", "spec": String(calc.roofSagRoad?.noOfSagRodInExtendedFrame || ""), "unit": "" },
      { "sl": "e", "desc": "NO.OF EXTENDED SAG ROD BAY", "spec": String(calc.roofSagRoad?.noOfExtendedSagRodBay || ""), "unit": "" },
      { "sl": "f", "desc": "UNIT WEIGHT OF SAG ROD", "spec": String(calc.roofSagRoad?.unitWeightOfSagRod || ""), "unit": "KG/M" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.7", "label": "Roof flange brace", "spec": "", "unit": "KG", "qtyField": "roofFlangeBraceQuantity", "unitField": "roofFlangeBraceUnit", "calcValue": calc.roofFlangeBrace?.roofFlangeBraceQuantity,
    "subRows": [
      { "sl": "a", "desc": "LENGTH OF MID FRAME FLANGE BRACE ", "spec": String(calc.roofFlangeBrace?.lengthOfMidFrameFlangeBrace || ""), "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "lengthOfMidFrameFlangeBraceAdditional" },
      { "sl": "b", "desc": "NO.OF FLANGE BRACE IN MID FRAME", "spec": String(calc.roofFlangeBrace?.noOfFlangeBraceInMidFrame || ""), "unit": "" },
      { "sl": "c", "desc": "NO.OF FLANGE BRACE IN END FRAME", "spec": String(calc.roofFlangeBrace?.noOfFlangeBraceInEndFrame || ""), "unit": "" },
      { "sl": "d", "desc": "NO.OF MID FRAME", "spec": String(calc.roofFlangeBrace?.noOfMidFrame || ""), "unit": "" },
      { "sl": "e", "desc": "NO.OF END FRAME", "spec": String(calc.roofFlangeBrace?.noOfEndFrame || ""), "unit": "" },
      { "sl": "f", "desc": "NO.OF FLNG BRACE IN EXTENDED FRAME", "spec": String(calc.roofFlangeBrace?.noOfFlngBraceInExtendedFrame || ""), "unit": "" },
      { "sl": "g", "desc": "NO.OF FLNG BRACE IN EXTENDED FRAME", "spec": String(calc.roofFlangeBrace?.noOfFlngBraceInExtendedFrame2 || ""), "unit": "" },
      { "sl": "h", "desc": "NO.OF EXTENDED MID FRAME", "spec": String(calc.roofFlangeBrace?.noOfExtendedMidFrame || ""), "unit": "" },
      { "sl": "i", "desc": "NO.OF EXTENDED END FRAME", "spec": String(calc.roofFlangeBrace?.noOfExtendedEndFrame || ""), "unit": "" },
      { "sl": "j", "desc": "LENGTH OF END FRAME FLANGE BRACE", "spec": String(calc.roofFlangeBrace?.lengthOfEndFrameFlangeBrace || ""), "unit": "M" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.8", "label": "Purlin bolts", "spec": calc.bolts?.numberOfPurlinBolts || "", "unit": "NOS", "qtyField": "numberOfPurlinBoltsQuantity", "unitField": "purlinBoltsUnit", "calcValue": calc.bolts?.numberOfPurlinBoltsQuantity,
    "subRows": [
      { "sl": "a", "desc": "NO.OF PURLIN JOINT IN SINGLE FRAME", "spec": String(calc.bolts?.noOfPurlinJointInSingleFrame || ""), "unit": "" },
      { "sl": "b", "desc": "TOTAL NO.OF FRAMES", "spec": String(calc.bolts?.totalnoOfFrames || ""), "unit": "" },
      { "sl": "c", "desc": "NO.OF PURLIN NODE IN EXTENDED FRAME", "spec": String(calc.bolts?.noOfPurlinnodeInExtendedFrame || ""), "unit": "" },
      { "sl": "d", "desc": "NO.OF EXTENDED FRAMES", "spec": String(calc.bolts?.noOfExtendedFrames || ""), "unit": "" },
      { "sl": "e", "desc": "NO.OF BOLTS IN SINGLE PURLIN JOINT", "spec": String(calc.bolts?.noOfBoltsInSinglePurlinJoint || ""), "unit": "" }
    ],
    "isCalculated": true
  },
  { "sl": "1.9", "label": "NUMBER OF ROOF JOINT BOLTS", "spec": calc.bolts?.numberOfRoofJointBolts || "", "unit": "NOS", "qtyField": "numberOfRoofJointBoltsQuantity", "unitField": "roofJointBoltsUnit", "subRows": [], "isCalculated": true, "calcValue": calc.bolts?.numberOfRoofJointBoltsQuantity },
  { "sl": "1.9.1", "label": "NUMBER OF Foundation bolts", "spec": calc.bolts?.numberOfFoundationBolts || "", "unit": "NOS", "qtyField": "numberOfFoundationBoltsQuantity", "unitField": "foundationBoltsUnit", "subRows": [], "isCalculated": true, "calcValue": calc.bolts?.numberOfFoundationBoltsQuantity },
  { "sl": "1.9.2", "label": "Anchor bolts", "spec": calc.bolts?.numberOfAnchorBolts || "", "unit": "NOS", "qtyField": "numberOfAnchorBoltsQuantity", "unitField": "anchorBoltsUnit", "subRows": [], "isCalculated": true, "calcValue": calc.bolts?.numberOfAnchorBoltsQuantity }
]

export const getCladdingRows = (calc: CladdingCalc): RowDef[] => [
  {
    "sl": "2.1", "label": "Cladding structure", "spec": "", "unit": "KG", "qtyField": "claddingStructureQuantity", "unitField": "", "calcValue": calc.claddingStructure?.claddingStructureQuantity,
    "subRows": [
      { "sl": "a", "desc": "CLADDING EAVE HEIGHT FRONT", "spec": String(calc.claddingStructure?.claddingEaveHeightFront || ""), "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "claddingEaveHeightFrontAdditional" },
      { "sl": "b", "desc": "CLADDING EAVE HEIGHT BACK", "spec": String(calc.claddingStructure?.claddingEaveHeightBack || ""), "unit": "M" },
      { "sl": "c", "desc": "CLADDING EAVE HEIGHT RIGHT", "spec": String(calc.claddingStructure?.claddingEaveHeightRight || ""), "unit": "M" },
      { "sl": "d", "desc": "CLADDING EAVE HEIGHT LEFT", "spec": String(calc.claddingStructure?.claddingEaveHeightLeft || ""), "unit": "M" },
      { "sl": "e", "desc": "EXTENDED COLUMN HEIGHT", "spec": String(calc.claddingStructure?.extendedColumnHeight || ""), "unit": "M" },
      { "sl": "f", "desc": "WIDTH OF EXTENDED FRAME", "spec": String(calc.claddingStructure?.widthOfExtendedFrame || ""), "unit": "M" },
      { "sl": "g", "desc": "NO.OF SIDE CLADDING PURLIN", "spec": String(calc.claddingStructure?.noOfSideCladdingPurlin || ""), "unit": "" },
      { "sl": "h", "desc": "NO.OF FACE CLADDING PURLIN", "spec": String(calc.claddingStructure?.noOfFaceCladdingPurlin || ""), "unit": "" },
      { "sl": "i", "desc": "TOTAL LENGTH OF CLADDING PURLIN", "spec": String(calc.claddingStructure?.totalLengthOfCladdingPurlin || ""), "unit": "M" },
      { "sl": "j", "desc": "TOTAL WEIGHT OF CLADDING PURLIN", "spec": String(calc.claddingStructure?.totalWeightofCladdingPurlin || ""), "unit": "KG" },
      { "sl": "k", "desc": "CLADDING AREA WITHOUT ANY DEDUCTIONS", "spec": String(calc.claddingStructure?.claddingAreaWithoutAnyDeductions || ""), "unit": "SQM" },
      { "sl": "l", "desc": "AVERAGE MATERIAL CONSUMPTION", "spec": String(calc.claddingStructure?.averageMaterialConsumption || ""), "unit": "KG/SQM" },
      { "sl": "m", "desc": "TOTAL CLADDING OPENINGS", "spec": String(calc.claddingStructure?.totalCladdingOpenings || ""), "unit": "SQM" },
      { "sl": "n", "desc": "FASCIA OPENING", "spec": String(calc.claddingStructure?.fasciaOpening || ""), "unit": "SQM" }
    ],
    "isCalculated": true
  },
  {
    "sl": "2.2", "label": "CLADDING SHEET", "spec": "ADDITIONAL=", "specValue": "claddingSheetAdditional", "isSpecValueInput": true, "unit": "SQM", "qtyField": "claddingSheetQuantity", "unitField": "", "calcValue": calc.claddingSheet?.claddingSheetQuantity,
    "subRows": [{ "sl": "", "desc": "", "spec": "PURCHASE QUANTITY", "unit": "SQM", "purchField": "claddingSheetPurchase", "calcPurchValue": calc.claddingSheet?.claddingSheetPurchase, "isCalculated": true }],
    "isCalculated": true
  },
  { "sl": "2.3", "label": "Column wind bracings", "spec": "ADDITIONAL=", "specValue": "columnWindBracingsAdditional", "isSpecValueInput": true, "unit": "KG", "qtyField": "columnWindBracings", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.claddingSheet?.columnWindBracings },
  { "sl": "2.4", "label": "Cladding sag rod", "spec": "ADDITIONAL=", "specValue": "claddingSagRodAdditional", "isSpecValueInput": true, "unit": "KG", "qtyField": "claddingSagRod", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.claddingSheet?.claddingSagRod },
  { "sl": "2.5", "label": "Cladding flange brace", "spec": "ADDITIONAL=", "specValue": "claddingFlangeBraceAdditional", "isSpecValueInput": true, "unit": "KG", "qtyField": "claddingFlangeBrace", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.claddingSheet?.claddingFlangeBrace },
  { "sl": "2.6", "label": "Cladding purlin bolts", "spec": "ADDITIONAL=", "specValue": "numberOfCladdingPurlinBoltsAdditional", "isSpecValueInput": true, "unit": "NOS", "qtyField": "numberOfCladdingPurlinBolts", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.claddingSheet?.numberOfCladdingPurlinBolts }
]

export const getCanopyRows = (calc: CanopyCalc): RowDef[] => [
  {
    "sl": "3.1", "label": "Canopy Structure", "spec": "", "unit": "KG", "qtyField": "canopyStructureQuantity", "unitField": "", "calcValue": calc.canopyStructureQuantity,
    "subRows": [{ "sl": "", "desc": "CANOPY AREA", "spec": String(calc.canopyArea || ""), "unit": "SQFT", "addlField": "canopyArea" }],
    "isCalculated": true
  },
  { "sl": "3.2", "label": "Canopy Purlin", "spec": "", "unit": "KG", "qtyField": "canopyPurlinQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.canopyPurlinQuantity },
  {
    "sl": "3.3", "label": "Canopy Sheet", "spec": "", "unit": "SQM", "qtyField": "canopySheetQuantity", "unitField": "", "calcValue": calc.canopySheetQuantity,
    "subRows": [{ "sl": "", "desc": "", "spec": "PURCHASE QUANTITY", "unit": "SQM", "purchField": "canopySheetPurchaseQuantity", "isCalculated": true, "calcPurchValue": calc.canopySheetPurchaseQuantity }],
    "isCalculated": true
  },
  { "sl": "3.4", "label": "Canopy Gutter", "spec": "", "unit": "M", "qtyField": "canopyGutterQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.canopyGutterQuantity },
  { "sl": "3.5", "label": "Canopy Down take", "spec": "", "unit": "M", "qtyField": "canopyDownTakeQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.canopyDownTakeQuantity },
  { "sl": "3.6", "label": "Canopy Side covering", "spec": "", "unit": "SQM", "qtyField": "canopySideCoveringQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.canopySideCoveringQuantity },
  { "sl": "3.7", "label": "Canopy Flashing", "spec": "", "unit": "M", "qtyField": "canopyFlashingQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.canopyFlashingQuantity },
  { "sl": "3.8", "label": "Canopy Purlin bolts", "spec": "", "unit": "NOS", "qtyField": "canopyPurlinBoltsQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.canopyPurlinBoltsQuantity },
  { "sl": "3.9", "label": "Canopy Joint bolts", "spec": "", "unit": "NOS", "qtyField": "canopyJointBoltsQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.canopyJointBoltsQuantity }
]

export const getAccessoriesRows = (calc: AccessoriesCalc): RowDef[] => [
  { "sl": "4.1", "label": "DOORS", "spec": String(calc.doors || ""), "specValue": "NOS", "unit": "SQM", "qtyField": "doorsQuantity", "unitField": "", "defaultQty": "", "subRows": [], "isCalculated": true, "calcValue": calc.doorsQuantity },
  { "sl": "4.2", "label": "Windows", "spec": String(calc.windows || ""), "specValue": "NOS", "unit": "SQM", "qtyField": "windowsQuantity", "unitField": "", "defaultQty": "", "subRows": [], "isCalculated": true, "calcValue": calc.windowsQuantity },
  { "sl": "4.3", "label": "Fascia structure", "spec": "", "unit": "KG", "qtyField": "fasciaStructureQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.fasciaStructureQuantity },
  { "sl": "4.4", "label": "Fascia covering sheet", "spec": "", "unit": "SQM", "qtyField": "fasciaCoveringSheetBoardQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.fasciaCoveringSheetBoardQuantity },
  { "sl": "4.5", "label": "Internal partitions", "spec": "", "unit": "SQM", "qtyField": "internalPartitionsQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.internalPartitionsQuantity },
  { "sl": "4.6", "label": "Ridge", "spec": "", "unit": "M", "qtyField": "ridgeQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.ridgeQuantity },
  { "sl": "4.7", "label": "Gutter", "spec": "", "unit": "M", "qtyField": "gutterQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.gutterQuantity },
  { "sl": "4.8", "label": "Down take", "spec": "", "unit": "M", "qtyField": "downtakeQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.downtakeQuantity },
  { "sl": "4.9", "label": "Drip trim", "spec": "", "unit": "M", "qtyField": "dripTrimQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.dripTrimQuantity },
  { "sl": "4.10", "label": "Gable end flashing", "spec": "", "unit": "M", "qtyField": "gableEndFlashingQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.gableEndFlashingQuantity },
  { "sl": "4.11", "label": "Corner flash", "spec": "", "unit": "SQM", "qtyField": "cornerFlashQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.cornerFlashQuantity },
  { "sl": "4.12", "label": "Rolling shutter", "spec": String(calc.rollingShutter || ""), "specValue": "NOS", "unit": "SQM", "qtyField": "rollingShutterQuantity", "unitField": "", "defaultQty": "", "subRows": [], "isCalculated": true, "calcValue": calc.rollingShutterQuantity },
  { "sl": "4.13", "label": "Louvers", "spec": String(calc.louvers || ""), "specValue": "NOS", "unit": "SQM", "qtyField": "louversQuantity", "unitField": "", "defaultQty": "", "subRows": [], "isCalculated": true, "calcValue": calc.louversQuantity },
  { "sl": "4.14", "label": "Sky light", "spec": String(calc.skyLight || ""), "specValue": "NOS", "unit": "SQM", "qtyField": "skyLightQuantity", "unitField": "", "defaultQty": "", "subRows": [], "isCalculated": true, "calcValue": calc.skyLightQuantity },
  { "sl": "4.15", "label": "Wall light", "spec": String(calc.wallLight || ""), "specValue": "NOS", "unit": "SQM", "qtyField": "wallLightQuantity", "unitField": "", "defaultQty": "", "subRows": [], "isCalculated": true, "calcValue": calc.wallLightQuantity },
  { "sl": "4.16", "label": "Roof insulation", "spec": String(calc.roofInsulation || ""), "unit": "SQM", "qtyField": "roofInsulationQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.roofInsulationQuantity },
  { "sl": "4.17", "label": "Wall insulation", "spec": String(calc.wallInsulation || ""), "unit": "SQM", "qtyField": "wallInsulationQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.wallInsulationQuantity },
  { "sl": "4.18", "label": "Turbo ventilators", "spec": "", "unit": "NOS", "qtyField": "turboVentilatorsQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.turboVentilatorsQuantity },
  { "sl": "4.19", "label": "Handrail", "spec": "", "unit": "KG", "qtyField": "handrailQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.handrailQuantity }
]

export const getMezzanineRows = (calc: MezzanineCalc): RowDef[] => [
  {
    "sl": "5.1", "label": "Structure", "spec": "", "unit": "KG", "qtyField": "mezzanineStructureQuantity", "unitField": "", "calcValue": calc.mezzanineStructureQuantity,
    "subRows": [
      { "sl": "a", "desc": "TOTAL MEZZANINE AREA", "spec": String(calc.totalMezzanineArea || ""), "unit": "SQM", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "totalMezzanineAreaQuantity", "defaultQty": "" },
      { "sl": "b", "desc": "MATERIAL CONSUMPTION", "spec": String(calc.materialConsumption || ""), "unit": "KG/SQFT", "addlField": "materialConsumption", "defaultQty": "" }
    ],
    "isCalculated": true
  },
  {
    "sl": "5.2", "label": "Deck sheet", "spec": "", "unit": "SQM", "qtyField": "deckSheetQuantity", "unitField": "", "calcValue": calc.deckSheetQuantity,
    "subRows": [
      { "sl": "", "desc": "", "spec": "PURCHASE QUANTITY", "unit": "SQM", "purchField": "deckSheetPurchaseQuantity", "calcPurchValue": calc.deckSheetPurchaseQuantity, "isCalculated": true },
      { "sl": "", "desc": "", "spec": "", "unit": "", "addlSpec": "ADDITIONAL=", "addlUnit": "SQM", "addlField": "deckSheetQuantityAdditional", "defaultQty": "" }
    ],
    "isCalculated": true
  },
  { "sl": "5.3", "label": "Shear studs", "spec": "ADDITIONAL=", "specValue": "shearStudsQuantityAdditional", "isSpecValueInput": true, "unit": "NOS", "qtyField": "shearStudsQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.shearStudsQuantity },
  { "sl": "5.4", "label": "Concrete flashing", "spec": "ADDITIONAL=", "specValue": "concreteFlashingAdditional", "isSpecValueInput": true, "unit": "M", "qtyField": "concreteFlashing", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.concreteFlashing },
  { "sl": "5.5", "label": "Joint bolts", "spec": String(calc.jointBolts || ""), "unit": "", "qtyField": "jointBoltsQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.jointBoltsQuantity },
  { "sl": "5.6", "label": "Foundation bolts", "spec": "", "unit": "", "qtyField": "foundationBoltsQuantity", "unitField": "", "subRows": [], "isCalculated": true, "calcValue": calc.foundationBoltsQuantity }
]

export const getStairRows = (calc: StairCalc): RowDef[] => [
  {
    "sl": "6.1",
    "label": "Total area",
    "spec": "",
    "unit": "SQM",
    "qtyField": "totalAreaOfStairQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true,
    "calcValue": calc.totalAreaOfStairQuantity
  },
  {
    "sl": "6.2",
    "label": "Stringer beams",
    "spec": String(calc.totalWeightofStringerBeams || ""),
    "unit": "KG",
    "qtyField": "totalWeightofStringerBeamsQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "",
        "unit": "",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "totalWeightofStringerBeamsAdditional"
      }
    ],
    "isCalculated": true,
    "calcValue": calc.totalWeightofStringerBeamsQuantity
  },
  {
    "sl": "6.3",
    "label": "Steps",
    "spec": String(calc.totalWeightofSteps || ""),
    "unit": "KG",
    "qtyField": "totalWeightofStepsQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "",
        "unit": "",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "totalWeightofStepsAdditional"
      }
    ],
    "isCalculated": true,
    "calcValue": calc.totalWeightofStepsQuantity
  }
]

export const getAdditionalBoltsRows = (calc: AdditionalBoltsCalc): RowDef[] => [
  { "sl": "7.1", "label": "Joint bolt", "spec": "24 MM DIA HSFG BOLTS", "unit": "NOS", "qtyField": "jointBolt1Quantity", "unitField": "", "subRows": [], "calcValue": calc.jointBolt1Quantity },
  { "sl": "7.2", "label": "Joint bolt", "spec": "20 MM DIA HSFG BOLTS", "unit": "NOS", "qtyField": "jointBolt2Quantity", "unitField": "", "subRows": [], "calcValue": calc.jointBolt2Quantity },
  { "sl": "7.3", "label": "Joint bolt", "spec": "16 MM DIA HSFG BOLTS", "unit": "NOS", "qtyField": "jointBolt3Quantity", "unitField": "", "subRows": [], "calcValue": calc.jointBolt3Quantity },
  { "sl": "7.4", "label": "Purlin bolt", "spec": "12 MM DIA ORDINARY BOLTS", "unit": "NOS", "qtyField": "purlinBoltQuantity", "unitField": "", "subRows": [], "calcValue": calc.purlinBoltQuantity },
  { "sl": "7.5", "label": "Anchor bolt", "spec": "", "unit": "NOS", "qtyField": "anchorBoltQuantity", "unitField": "", "subRows": [], "calcValue": calc.anchorBoltQuantity },
  { "sl": "7.6", "label": "Foundation bolt", "spec": "", "unit": "NOS", "qtyField": "foundationBoltQuantity", "unitField": "", "subRows": [], "calcValue": calc.foundationBoltQuantity }
]