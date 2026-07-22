import type { RowDef } from './types.js';

export const CANOPY_ROWS: RowDef[] = [
  {
    "sl": "3.1",
    "label": "Canopy Structure",
    "spec": "",
    "unit": "KG",
    "qtyField": "structureQuantity",
    "unitField": "structureUnit",
    "subRows": [
      {
        "sl": "",
        "desc": "CANOPY AREA",
        "spec": "322.80",
        "unit": "SQFT"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "3.2",
    "label": "Canopy Purlin",
    "spec": "",
    "unit": "KG",
    "qtyField": "purlinQuantity",
    "unitField": "purlinUnit",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.3",
    "label": "Canopy Sheet",
    "spec": "",
    "unit": "SQM",
    "qtyField": "sheetQuantity",
    "unitField": "sheetUnit",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "sheetPurchaseQuantity",
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
    "qtyField": "gutterQuantity",
    "unitField": "gutterUnit",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.5",
    "label": "Canopy Down take",
    "spec": "",
    "unit": "M",
    "qtyField": "downTakeQuantity",
    "unitField": "downTakeUnit",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.6",
    "label": "Canopy Side covering",
    "spec": "",
    "unit": "SQM",
    "qtyField": "sideCoveringQuantity",
    "unitField": "sideCoveringUnit",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.7",
    "label": "Canopy Flashing",
    "spec": "",
    "unit": "M",
    "qtyField": "flashingQuantity",
    "unitField": "flashingUnit",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.8",
    "label": "Canopy Purlin bolts",
    "spec": "",
    "unit": "NOS",
    "qtyField": "purlinBoltsQuantity",
    "unitField": "purlinBoltsUnit",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.9",
    "label": "Canopy Joint bolts",
    "spec": "",
    "unit": "NOS",
    "qtyField": "jointBoltsQuantity",
    "unitField": "jointBoltsUnit",
    "subRows": [],
    "isCalculated": true
  }
];