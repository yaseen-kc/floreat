import type { RowDef } from './types.js';

export const MEZZANINE_ROWS: RowDef[] = [
  {
    "sl": "5.1",
    "label": "Structure",
    "spec": "",
    "unit": "KG",
    "qtyField": "mezzanineStructureQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "a",
        "desc": "TOTAL MEZZANINE AREA",
        "spec": "171",
        "unit": "SQM",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "totalMezzanineAreaQuantity",
        "defaultQty": "4756",
        "isCalculated": true
      },
      {
        "sl": "b",
        "desc": "MATERIAL CONSUMPTION",
        "spec": "4",
        "unit": "KG/SQFT",
        "addlField": "materialConsumption",
        "defaultQty": "4756"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "5.2",
    "label": "Deck sheet",
    "spec": "",
    "unit": "SQM",
    "qtyField": "deckSheetQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "shearStudsPurchaseQuantity", // wait, what about deck sheet purchase? It is absent in JSON! Wait!
        "isCalculated": true
      },
      {
        "sl": "",
        "desc": "",
        "spec": "",
        "unit": "",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "SQM",
        "addlField": "",
        "defaultQty": "46",
        "isCalculated": true
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "5.3",
    "label": "Shear studs",
    "spec": "ADDITIONAL=",
    "specValue": "521",
    "unit": "",
    "qtyField": "shearStudsQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "5.4",
    "label": "Concrete flashing",
    "spec": "ADDITIONAL=",
    "specValue": "521",
    "unit": "",
    "qtyField": "concreteFlashing",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "5.5",
    "label": "Joint bolts",
    "spec": "16 MM DIA HSFG BOLTS",
    "unit": "",
    "qtyField": "jointBoltsQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "5.6",
    "label": "Foundation bolts",
    "spec": "",
    "unit": "",
    "qtyField": "foundationBoltsQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  }
];