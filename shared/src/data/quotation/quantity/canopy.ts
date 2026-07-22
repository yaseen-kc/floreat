import type { RowDef } from './types.js';

export const CANOPY_ROWS: RowDef[] = [
  {
    "sl": "3.1",
    "label": "Canopy Structure",
    "spec": "",
    "unit": "KG",
    "qtyField": "canopyStructureQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "CANOPY AREA",
        "spec": "322.80",
        "unit": "SQFT",
        "addlField": "canopyArea"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "3.2",
    "label": "Canopy Purlin",
    "spec": "",
    "unit": "KG",
    "qtyField": "canopyPurlinQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.3",
    "label": "Canopy Sheet",
    "spec": "",
    "unit": "SQM",
    "qtyField": "canopySheetQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "canopySheetPurchaseQuantity",
        "isCalculated": true
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "3.4",
    "label": "Canopy Gutter",
    "spec": "",
    "unit": "M",
    "qtyField": "canopyGutterQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.5",
    "label": "Canopy Down take",
    "spec": "",
    "unit": "M",
    "qtyField": "canopyDownTakeQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.6",
    "label": "Canopy Side covering",
    "spec": "",
    "unit": "SQM",
    "qtyField": "canopySideCoveringQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.7",
    "label": "Canopy Flashing",
    "spec": "",
    "unit": "M",
    "qtyField": "canopyFlashingQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.8",
    "label": "Canopy Purlin bolts",
    "spec": "",
    "unit": "NOS",
    "qtyField": "canopyPurlinBoltsQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.9",
    "label": "Canopy Joint bolts",
    "spec": "",
    "unit": "NOS",
    "qtyField": "canopyJointBoltsQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  }
];