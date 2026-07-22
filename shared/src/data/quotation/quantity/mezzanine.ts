import type { RowDef } from './types.js';

export const MEZZANINE_ROWS: RowDef[] = [
  {
    "sl": "5.1",
    "label": "Structure",
    "spec": "",
    "unit": "KG",
    "qtyField": "structureQuantity",
    "unitField": "structureUnit",
    "subRows": [
      {
        "sl": "a",
        "desc": "TOTAL MEZZANINE AREA",
        "spec": "171",
        "unit": "SQM",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "totalMezzanineAreaAdditionalQuantity",
        "defaultQty": "4756",
        "isCalculated": true
      },
      {
        "sl": "b",
        "desc": "MATERIAL CONSUMPTION",
        "spec": "4",
        "unit": "KG/SQFT",
        "addlField": "totalMezzanineAreaAdditionalQuantity",
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
    "unitField": "deckSheetUnit",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "deckSheetPurchaseQuantity",
        "isCalculated": true
      },
      {
        "sl": "",
        "desc": "",
        "spec": "",
        "unit": "",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "SQM",
        "addlField": "deckSheetAdditionalQuantity",
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
    "unitField": "shearStudsUnit",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "5.4",
    "label": "Concrete flashing",
    "spec": "ADDITIONAL=",
    "specValue": "521",
    "unit": "",
    "qtyField": "concreteFlashingQuantity",
    "unitField": "concreteFlashingUnit",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "5.5",
    "label": "Joint bolts",
    "spec": "16 MM DIA HSFG BOLTS",
    "unit": "",
    "qtyField": "jointBoltsQuantity",
    "unitField": null,
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "5.6",
    "label": "Foundation bolts",
    "spec": "",
    "unit": "",
    "qtyField": "foundationBoltsQuantity",
    "unitField": null,
    "subRows": [],
    "isCalculated": true
  }
];