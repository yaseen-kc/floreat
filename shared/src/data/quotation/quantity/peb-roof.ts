import type { RowDef } from './types.js';

export const PEB_ROOF_ROWS: RowDef[] = [
  {
    "sl": "1",
    "labelPrefix": "_",
    "label": "PEB ROOF",
    "spec": "MATERIAL WITH PURLIN",
    "unit": "KG/SQFT",
    "qtyField": "",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "1.1",
    "label": "Rafters & columns",
    "spec": "",
    "unit": "KG",
    "qtyField": "_",
    "unitField": "_",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF BUILDING",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "raftersAndColumnsAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "INCLINED LENGTH IN ONE HALF",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "c",
        "desc": "ROOF AREA",
        "spec": "",
        "unit": "SQFT"
      },
      {
        "sl": "d",
        "desc": "MATERIAL CONSUMPTION",
        "spec": "",
        "unit": "KG/SQFT"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.2",
    "label": "Roof purlins",
    "labelSuffix": "_",
    "spec": "",
    "unit": "KG",
    "qtyField": "roofPurlinsQuantity",
    "unitField": "roofPurlinsUnit",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF ONE PURLIN",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "roofPurlinsAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "NO.OF.PURLINS IN ONE FRAME",
        "spec": "",
        "unit": "NOS"
      },
      {
        "sl": "c",
        "desc": "TOTAL NO.OF PURLIN BAY",
        "spec": "",
        "unit": "NOS"
      },
      {
        "sl": "d",
        "desc": "UNIT WEIGHT OF PURLIN",
        "spec": "",
        "unit": "KG/M"
      },
      {
        "sl": "e",
        "desc": "NO.OF.PURLINS IN EXTENDED FRAME",
        "spec": "",
        "unit": "NOS"
      },
      {
        "sl": "f",
        "desc": "NO.OF EXTENDED PURLIN BAY",
        "spec": "",
        "unit": "NOS"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.3",
    "label": "Roof sheet",
    "spec": "",
    "unit": "SQM",
    "qtyField": "roofSheetQuantity",
    "unitField": "roofSheetUnit",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "roofSheetPurchaseQuantity",
        "isCalculated": true
      },
      {
        "sl": "a",
        "desc": "EXTENDED ROOF WIDTH",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "SQM",
        "addlField": "roofSheetAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "EXTENDED ROOF LENGTH",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "c",
        "desc": "ROOF AREA DEDUCTIONS",
        "spec": "",
        "unit": "SQM"
      },
      {
        "sl": "d",
        "desc": "POLY CARBONATE AREA DEDUCTION",
        "spec": "",
        "unit": "SQM"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.4",
    "label": "Polycarbonate sheet",
    "spec": "",
    "unit": "SQM",
    "qtyField": "polycarbonateSheetQuantity",
    "unitField": "polycarbonateSheetUnit",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "polycarbonateSheetPurchaseQuantity",
        "isCalculated": true
      },
      {
        "sl": "a",
        "desc": "LENGTH OF POLYCARBONATE SHEET",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "SQM",
        "addlField": "polycarbonateSheetAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "WIDTH OF POLYCARBONATE SHEET",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "c",
        "desc": "NOS OF POLYCARBONATE SHEET",
        "spec": "",
        "unit": "NOS"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.5",
    "label": "Roof wind bracings",
    "spec": "",
    "unit": "KG",
    "qtyField": "roofWindBracingsQuantity",
    "unitField": "roofWindBracingsUnit",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF ROOF SINGLE WIND BRACING",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "roofWindBracingsAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "TOTAL NUMBER OF ROOF WIND BRACING",
        "spec": "",
        "unit": "NOS"
      },
      {
        "sl": "c",
        "desc": "UNIT WEIGHT OF ROOF WIND BRACING",
        "spec": "",
        "unit": "KG/M"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.6",
    "label": "Roof sag rod",
    "labelSuffix": "8.95456465",
    "spec": "",
    "unit": "",
    "qtyField": "roofSagRodQuantity",
    "unitField": "roofSagRodUnit",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF SINGLE SAG ROD",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "roofSagRodAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "NO.OF SAG ROD IN A SINGLE FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "c",
        "desc": "NO.OF BAY IN SAG ROD PROVIDED",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "d",
        "desc": "NO.OF.SAG ROD IN EXTENDED FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "e",
        "desc": "NO.OF EXTENDED SAG ROD BAY",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "f",
        "desc": "UNIT WEIGHT OF SAG ROD",
        "spec": "",
        "unit": "KG/M"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.7",
    "label": "Roof flange brace",
    "spec": "",
    "unit": "KG",
    "qtyField": "roofFlangeBraceQuantity",
    "unitField": "roofFlangeBraceUnit",
    "subRows": [
      {
        "sl": "a",
        "desc": "",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "roofFlangeBraceAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "NO.OF FLANGE BRACE IN MID FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "c",
        "desc": "NO.OF FLANGE BRACE IN END FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "d",
        "desc": "NO.OF MID FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "e",
        "desc": "NO.OF END FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "f",
        "desc": "NO.OF FLNG BRACE IN EXTENDED FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "g",
        "desc": "NO.OF FLNG BRACE IN EXTENDED FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "h",
        "desc": "NO.OF EXTENDED MID FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "i",
        "desc": "NO.OF EXTENDED END FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "j",
        "desc": "LENGTH OF END FRAME FLANGE BRACE",
        "spec": "",
        "unit": ""
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.8",
    "label": "Purlin bolts",
    "spec": "",
    "unit": "NOS",
    "qtyField": "purlinBoltsQuantity",
    "unitField": "purlinBoltsUnit",
    "subRows": [
      {
        "sl": "a",
        "desc": "NO.OF PURLIN JOINT IN SINGLE FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "b",
        "desc": "TOTAL NO.OF FRAMES",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "c",
        "desc": "NO.OF PURLIN NODE IN EXTENDED FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "d",
        "desc": "NO.OF EXTENDED FRAMES",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "e",
        "desc": "NO.OF BOLTS IN SINGLE PURLIN JOINT",
        "spec": "",
        "unit": ""
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.9",
    "label": "NUMBER OF ROOF JOINT BOLTS",
    "spec": "",
    "unit": "NOS",
    "qtyField": "roofJointBoltsQuantity",
    "unitField": "roofJointBoltsUnit",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "1.9.1",
    "label": "NUMBER OF Foundation bolts",
    "spec": "",
    "unit": "",
    "qtyField": "foundationBoltsQuantity",
    "unitField": "foundationBoltsUnit",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "1.9.2",
    "label": "Anchor bolts",
    "spec": "",
    "unit": "",
    "qtyField": "anchorBoltsQuantity",
    "unitField": "anchorBoltsUnit",
    "subRows": [],
    "isCalculated": true
  }
];