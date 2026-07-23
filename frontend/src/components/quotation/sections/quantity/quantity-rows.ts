import type { RowDef } from '@/components/quotation/shared/SectionTable'

export const STAIR_ROWS: RowDef[] = [
  {
    "sl": "6.1",
    "label": "Total area",
    "spec": "",
    "unit": "SQM",
    "qtyField": "totalAreaOfStairQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "6.2",
    "label": "Stringer beams",
    "spec": "HR SECTION",
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
    "isCalculated": true
  },
  {
    "sl": "6.3",
    "label": "Steps",
    "spec": "6MM CHQ PLATE",
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
    "isCalculated": true
  }
]

export const ADDITIONAL_BOLTS_ROWS: RowDef[] = [
  { "sl": "7.1", "label": "Joint bolt", "spec": "24 MM DIA HSFG BOLTS", "unit": "NOS", "qtyField": "jointBolt1Quantity", "unitField": "", "subRows": [] },
  { "sl": "7.2", "label": "Joint bolt", "spec": "20 MM DIA HSFG BOLTS", "unit": "NOS", "qtyField": "jointBolt2Quantity", "unitField": "", "subRows": [] },
  { "sl": "7.3", "label": "Joint bolt", "spec": "16 MM DIA HSFG BOLTS", "unit": "NOS", "qtyField": "jointBolt3Quantity", "unitField": "", "subRows": [] },
  { "sl": "7.4", "label": "Purlin bolt", "spec": "12 MM DIA ORDINARY BOLTS", "unit": "NOS", "qtyField": "purlinBoltQuantity", "unitField": "", "subRows": [] },
  { "sl": "7.5", "label": "Anchor bolt", "spec": "", "unit": "NOS", "qtyField": "anchorBoltQuantity", "unitField": "", "subRows": [] },
  { "sl": "7.6", "label": "Foundation bolt", "spec": "", "unit": "NOS", "qtyField": "foundationBoltQuantity", "unitField": "", "subRows": [] }
]

export const CANOPY_ROWS: RowDef[] = [
  {
    "sl": "3.1", "label": "Canopy Structure", "spec": "", "unit": "KG", "qtyField": "canopyStructureQuantity", "unitField": "",
    "subRows": [{ "sl": "", "desc": "CANOPY AREA", "spec": "322.80", "unit": "SQFT", "addlField": "canopyArea" }],
    "isCalculated": true
  },
  { "sl": "3.2", "label": "Canopy Purlin", "spec": "", "unit": "KG", "qtyField": "canopyPurlinQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  {
    "sl": "3.3", "label": "Canopy Sheet", "spec": "", "unit": "SQM", "qtyField": "canopySheetQuantity", "unitField": "",
    "subRows": [{ "sl": "", "desc": "", "spec": "PURCHASE QUANTITY", "unit": "SQM", "purchField": "canopySheetPurchaseQuantity", "isCalculated": true }],
    "isCalculated": true
  },
  { "sl": "3.4", "label": "Canopy Gutter", "spec": "", "unit": "M", "qtyField": "canopyGutterQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "3.5", "label": "Canopy Down take", "spec": "", "unit": "M", "qtyField": "canopyDownTakeQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "3.6", "label": "Canopy Side covering", "spec": "", "unit": "SQM", "qtyField": "canopySideCoveringQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "3.7", "label": "Canopy Flashing", "spec": "", "unit": "M", "qtyField": "canopyFlashingQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "3.8", "label": "Canopy Purlin bolts", "spec": "", "unit": "NOS", "qtyField": "canopyPurlinBoltsQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "3.9", "label": "Canopy Joint bolts", "spec": "", "unit": "NOS", "qtyField": "canopyJointBoltsQuantity", "unitField": "", "subRows": [], "isCalculated": true }
]

export const MEZZANINE_ROWS: RowDef[] = [
  {
    "sl": "5.1", "label": "Structure", "spec": "", "unit": "KG", "qtyField": "mezzanineStructureQuantity", "unitField": "",
    "subRows": [
      { "sl": "a", "desc": "TOTAL MEZZANINE AREA", "spec": "171", "unit": "SQM", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "totalMezzanineAreaQuantity", "defaultQty": "4756", "isCalculated": true },
      { "sl": "b", "desc": "MATERIAL CONSUMPTION", "spec": "4", "unit": "KG/SQFT", "addlField": "materialConsumption", "defaultQty": "4756" }
    ],
    "isCalculated": true
  },
  {
    "sl": "5.2", "label": "Deck sheet", "spec": "", "unit": "SQM", "qtyField": "deckSheetQuantity", "unitField": "",
    "subRows": [
      { "sl": "", "desc": "", "spec": "PURCHASE QUANTITY", "unit": "SQM", "purchField": "shearStudsPurchaseQuantity", "isCalculated": true },
      { "sl": "", "desc": "", "spec": "", "unit": "", "addlSpec": "ADDITIONAL=", "addlUnit": "SQM", "addlField": "", "defaultQty": "46", "isCalculated": true }
    ],
    "isCalculated": true
  },
  { "sl": "5.3", "label": "Shear studs", "spec": "ADDITIONAL=", "specValue": "521", "unit": "", "qtyField": "shearStudsQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "5.4", "label": "Concrete flashing", "spec": "ADDITIONAL=", "specValue": "521", "unit": "", "qtyField": "concreteFlashing", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "5.5", "label": "Joint bolts", "spec": "16 MM DIA HSFG BOLTS", "unit": "", "qtyField": "jointBoltsQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "5.6", "label": "Foundation bolts", "spec": "", "unit": "", "qtyField": "foundationBoltsQuantity", "unitField": "", "subRows": [], "isCalculated": true }
]

export const ACCESSORIES_ROWS: RowDef[] = [
  { "sl": "4.1", "label": "DOORS", "spec": "10", "specValue": "NOS", "unit": "SQM", "qtyField": "doorsQuantity", "unitField": "", "defaultQty": "21", "subRows": [], "isCalculated": true },
  { "sl": "4.2", "label": "Windows", "spec": "10", "specValue": "NOS", "unit": "SQM", "qtyField": "windowsQuantity", "unitField": "", "defaultQty": "21", "subRows": [], "isCalculated": true },
  { "sl": "4.3", "label": "Fascia structure", "spec": "", "unit": "", "qtyField": "fasciaStructureQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "4.4", "label": "Fascia covering sheet", "spec": "", "unit": "", "qtyField": "fasciaCoveringSheetBoardQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "4.5", "label": "Internal partitions", "spec": "", "unit": "", "qtyField": "internalPartitionsQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "4.6", "label": "Ridge", "spec": "", "unit": "", "qtyField": "ridgeQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "4.7", "label": "Gutter", "spec": "", "unit": "", "qtyField": "gutterQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "4.8", "label": "Down take", "spec": "", "unit": "", "qtyField": "downtakeQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "4.9", "label": "Drip trim", "spec": "", "unit": "", "qtyField": "dripTrimQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "4.10", "label": "Gable end flashing", "spec": "", "unit": "", "qtyField": "gableEndFlashingQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "4.11", "label": "Corner flash", "spec": "", "unit": "SQM", "qtyField": "cornerFlashQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "4.12", "label": "Rolling shutter", "spec": "10", "specValue": "NOS", "unit": "SQM", "qtyField": "rollingShutterQuantity", "unitField": "", "defaultQty": "21", "subRows": [], "isCalculated": true },
  { "sl": "4.13", "label": "Louvers", "spec": "10", "specValue": "NOS", "unit": "SQM", "qtyField": "louversQuantity", "unitField": "", "defaultQty": "21", "subRows": [], "isCalculated": true },
  { "sl": "4.14", "label": "Sky light", "spec": "10", "specValue": "NOS", "unit": "SQM", "qtyField": "skyLightQuantity", "unitField": "", "defaultQty": "21", "subRows": [], "isCalculated": true },
  { "sl": "4.15", "label": "Wall light", "spec": "10", "specValue": "NOS", "unit": "SQM", "qtyField": "wallLightQuantity", "unitField": "", "defaultQty": "21", "subRows": [], "isCalculated": true },
  { "sl": "4.16", "label": "Roof insulation", "spec": "XLPE", "unit": "", "qtyField": "roofInsulationQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "4.17", "label": "Wall insulation", "spec": "", "unit": "", "qtyField": "wallInsulationQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "4.18", "label": "Turbo ventilators", "spec": "", "unit": "", "qtyField": "turboVentilatorsQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "4.19", "label": "Handrail", "spec": "", "unit": "", "qtyField": "handrailQuantity", "unitField": "", "subRows": [], "isCalculated": true }
]

export const CLADDING_ROWS: RowDef[] = [
  {
    "sl": "2.1", "label": "Cladding structure", "spec": "", "unit": "KG", "qtyField": "claddingStructureQuantity", "unitField": "",
    "subRows": [
      { "sl": "a", "desc": "CLADDING EAVE HEIGHT FRONT", "spec": "", "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "claddingEaveHeightFrontAdditional" },
      { "sl": "b", "desc": "CLADDING EAVE HEIGHT BACK", "spec": "", "unit": "M" },
      { "sl": "c", "desc": "CLADDING EAVE HEIGHT RIGHT", "spec": "", "unit": "M" },
      { "sl": "d", "desc": "CLADDING EAVE HEIGHT LEFT", "spec": "", "unit": "M" },
      { "sl": "e", "desc": "EXTENDED COLUMN HEIGHT", "spec": "", "unit": "M" },
      { "sl": "f", "desc": "WIDTH OF EXTENDED FRAME", "spec": "", "unit": "M" },
      { "sl": "g", "desc": "NO.OF SIDE CLADDING PURLIN", "spec": "", "unit": "M" },
      { "sl": "h", "desc": "NO.OF FACE CLADDING PURLIN", "spec": "", "unit": "M" },
      { "sl": "i", "desc": "TOTAL LENGTH OF CLADDING PURLIN", "spec": "", "unit": "M" },
      { "sl": "j", "desc": "TOTAL WEIGHT OF CLADDING PURLIN", "spec": "", "unit": "M" },
      { "sl": "k", "desc": "CLADDING AREA WITHOUT ANY DEDUCTIONS", "spec": "", "unit": "M" },
      { "sl": "l", "desc": "AVERAGE MATERIAL CONSUMPTION", "spec": "", "unit": "M" },
      { "sl": "m", "desc": "TOTAL CLADDING OPENINGS", "spec": "", "unit": "M" },
      { "sl": "n", "desc": "FASCIA OPENING", "spec": "", "unit": "M" }
    ],
    "isCalculated": true
  },
  {
    "sl": "2.2", "label": "CLADDING SHEET", "spec": "ADDITIONAL=", "specValue": "_", "unit": "SQM", "qtyField": "claddingSheetQuantity", "unitField": "",
    "subRows": [{ "sl": "", "desc": "", "spec": "PURCHASE QUANTITY", "unit": "SQM", "purchField": "claddingSheetPurchase" }],
    "isCalculated": true
  },
  { "sl": "2.3", "label": "Column wind bracings", "spec": "ADDITIONAL=", "specValue": "_", "unit": "44", "qtyField": "columnWindBracingsAdditional", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "2.4", "label": "Cladding sag rod", "spec": "ADDITIONAL=", "specValue": "_", "unit": "54", "qtyField": "claddingSagRodAdditional", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "2.5", "label": "Cladding flange brace", "spec": "ADDITIONAL=", "specValue": "_", "unit": "65", "qtyField": "claddingFlangeBraceAdditional", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "2.6", "label": "Cladding purlin bolts", "spec": "ADDITIONAL=", "specValue": "_", "unit": "75", "qtyField": "numberOfCladdingPurlinBoltsAdditional", "unitField": "", "subRows": [], "isCalculated": true }
]

export const PEB_ROOF_ROWS: RowDef[] = [
  { "sl": "1", "labelPrefix": "TRUE", "label": "PEB ROOF", "spec": "MATERIAL WITH PURLIN", "unit": "KG/SQFT", "qtyField": "pebRoofQuantity", "unitField": "", "subRows": [], "isCalculated": true },
  {
    "sl": "1.1", "label": "Rafters & columns", "spec": "", "unit": "KG", "qtyField": "raftersAndColumnsQuantity", "unitField": "",
    "subRows": [
      { "sl": "a", "desc": "LENGTH OF BUILDING", "spec": "", "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "lengthOfBuildingQuantity" },
      { "sl": "b", "desc": "INCLINED LENGTH IN ONE HALF", "spec": "", "unit": "M" },
      { "sl": "c", "desc": "ROOF AREA", "spec": "", "unit": "SQFT" },
      { "sl": "d", "desc": "MATERIAL CONSUMPTION", "spec": "", "unit": "KG/SQFT" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.2", "label": "Roof purlins", "labelSuffix": "_", "spec": "", "unit": "KG", "qtyField": "roofPurlinsQuantity", "unitField": "",
    "subRows": [
      { "sl": "a", "desc": "LENGTH OF ONE PURLIN", "spec": "", "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "lengthOfOnePurlinQuantity" },
      { "sl": "b", "desc": "NO.OF.PURLINS IN ONE FRAME", "spec": "", "unit": "NOS" },
      { "sl": "c", "desc": "TOTAL NO.OF PURLIN BAY", "spec": "", "unit": "NOS" },
      { "sl": "d", "desc": "UNIT WEIGHT OF PURLIN", "spec": "", "unit": "KG/M" },
      { "sl": "e", "desc": "NO.OF.PURLINS IN EXTENDED FRAME", "spec": "", "unit": "NOS" },
      { "sl": "f", "desc": "NO.OF EXTENDED PURLIN BAY", "spec": "", "unit": "NOS" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.3", "label": "Roof sheet", "spec": "", "unit": "SQM", "qtyField": "roofSheetQuantity", "unitField": "",
    "subRows": [
      { "sl": "", "desc": "", "spec": "PURCHASE QUANTITY", "unit": "SQM", "purchField": "roofSheetPurchaseQuantity", "isCalculated": true },
      { "sl": "a", "desc": "EXTENDED ROOF WIDTH", "spec": "", "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "SQM", "addlField": "extendedRoofWidth" },
      { "sl": "b", "desc": "EXTENDED ROOF LENGTH", "spec": "", "unit": "M" },
      { "sl": "c", "desc": "ROOF AREA DEDUCTIONS", "spec": "", "unit": "SQM" },
      { "sl": "d", "desc": "POLY CARBONATE AREA DEDUCTION", "spec": "", "unit": "SQM" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.4", "label": "Polycarbonate sheet", "spec": "", "unit": "SQM", "qtyField": "polyCarbonateSheetQuantity", "unitField": "",
    "subRows": [
      { "sl": "", "desc": "", "spec": "PURCHASE QUANTITY", "unit": "SQM", "purchField": "polyCarbonateSheetPurchaseQuantity", "isCalculated": true },
      { "sl": "a", "desc": "LENGTH OF POLYCARBONATE SHEET", "spec": "", "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "SQM", "addlField": "lengthOfpolyCarbonateSheetAdditional" },
      { "sl": "b", "desc": "WIDTH OF POLYCARBONATE SHEET", "spec": "", "unit": "M" },
      { "sl": "c", "desc": "NOS OF POLYCARBONATE SHEET", "spec": "", "unit": "NOS" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.5", "label": "Roof wind bracings", "spec": "", "unit": "KG", "qtyField": "roofWindBracing", "unitField": "",
    "subRows": [
      { "sl": "a", "desc": "LENGTH OF ROOF SINGLE WIND BRACING", "spec": "", "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "lengthOfSinlgeWindBracingAdditional" },
      { "sl": "b", "desc": "TOTAL NUMBER OF ROOF WIND BRACING", "spec": "", "unit": "NOS" },
      { "sl": "c", "desc": "UNIT WEIGHT OF ROOF WIND BRACING", "spec": "", "unit": "KG/M" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.6", "label": "Roof sag rod", "labelSuffix": "8.95456465", "spec": "", "unit": "", "qtyField": "roofSagRoadQuantity", "unitField": "",
    "subRows": [
      { "sl": "a", "desc": "LENGTH OF SINGLE SAG ROD", "spec": "", "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "roofSagRoadQuantityAdditional" },
      { "sl": "b", "desc": "NO.OF SAG ROD IN A SINGLE FRAME", "spec": "", "unit": "" },
      { "sl": "c", "desc": "NO.OF BAY IN SAG ROD PROVIDED", "spec": "", "unit": "" },
      { "sl": "d", "desc": "NO.OF.SAG ROD IN EXTENDED FRAME", "spec": "", "unit": "" },
      { "sl": "e", "desc": "NO.OF EXTENDED SAG ROD BAY", "spec": "", "unit": "" },
      { "sl": "f", "desc": "UNIT WEIGHT OF SAG ROD", "spec": "", "unit": "KG/M" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.7", "label": "Roof flange brace", "spec": "", "unit": "KG", "qtyField": "roofFlangeBraceQuantity", "unitField": "",
    "subRows": [
      { "sl": "a", "desc": "", "spec": "", "unit": "M", "addlSpec": "ADDITIONAL=", "addlUnit": "KG", "addlField": "lengthOfMidFrameFlangeBraceAdditional" },
      { "sl": "b", "desc": "NO.OF FLANGE BRACE IN MID FRAME", "spec": "", "unit": "" },
      { "sl": "c", "desc": "NO.OF FLANGE BRACE IN END FRAME", "spec": "", "unit": "" },
      { "sl": "d", "desc": "NO.OF MID FRAME", "spec": "", "unit": "" },
      { "sl": "e", "desc": "NO.OF END FRAME", "spec": "", "unit": "" },
      { "sl": "f", "desc": "NO.OF FLNG BRACE IN EXTENDED FRAME", "spec": "", "unit": "" },
      { "sl": "g", "desc": "NO.OF FLNG BRACE IN EXTENDED FRAME", "spec": "", "unit": "" },
      { "sl": "h", "desc": "NO.OF EXTENDED MID FRAME", "spec": "", "unit": "" },
      { "sl": "i", "desc": "NO.OF EXTENDED END FRAME", "spec": "", "unit": "" },
      { "sl": "j", "desc": "LENGTH OF END FRAME FLANGE BRACE", "spec": "", "unit": "" }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.8", "label": "Purlin bolts", "spec": "", "unit": "NOS", "qtyField": "numberOfPurlinBoltsQuantity", "unitField": "",
    "subRows": [
      { "sl": "a", "desc": "NO.OF PURLIN JOINT IN SINGLE FRAME", "spec": "", "unit": "" },
      { "sl": "b", "desc": "TOTAL NO.OF FRAMES", "spec": "", "unit": "" },
      { "sl": "c", "desc": "NO.OF PURLIN NODE IN EXTENDED FRAME", "spec": "", "unit": "" },
      { "sl": "d", "desc": "NO.OF EXTENDED FRAMES", "spec": "", "unit": "" },
      { "sl": "e", "desc": "NO.OF BOLTS IN SINGLE PURLIN JOINT", "spec": "", "unit": "" }
    ],
    "isCalculated": true
  },
  { "sl": "1.9", "label": "NUMBER OF ROOF JOINT BOLTS", "spec": "", "unit": "NOS", "qtyField": "numberOfRoofJointBolts", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "1.9.1", "label": "NUMBER OF Foundation bolts", "spec": "", "unit": "", "qtyField": "numberOfFoundationBolts", "unitField": "", "subRows": [], "isCalculated": true },
  { "sl": "1.9.2", "label": "Anchor bolts", "spec": "", "unit": "", "qtyField": "numberOfAnchorBolts", "unitField": "", "subRows": [], "isCalculated": true }
]