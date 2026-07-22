import type { RowDef } from './types.js';

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
];