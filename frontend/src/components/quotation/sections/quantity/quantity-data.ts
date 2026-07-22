import type { RowDef } from './QuantityTableTypes';

export const PEB_ROOF_ROWS: RowDef[] = [
  {
    "sl": "1",
    "labelPrefix": "TRUE",
    "label": "PEB ROOF",
    "spec": "MATERIAL WITH PURLIN",
    "unit": "KG/SQFT",
    "qtyField": "",
    "unitField": "",
    "subRows": []
  },
  {
    "sl": "1.1",
    "label": "Rafters & columns",
    "spec": "_",
    "unit": "KG",
    "qtyField": "_",
    "unitField": "_",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF BUILDING",
        "spec": "_",
        "unit": "M",
        "addlSpec": "ADDITIONAL =",
        "addlUnit": "KG",
        "addlField": "raftersAndColumnsAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "INCLINED LENGTH IN ONE HALF",
        "spec": "_",
        "unit": "M"
      },
      {
        "sl": "c",
        "desc": "ROOF AREA",
        "spec": "_",
        "unit": "SQFT"
      },
      {
        "sl": "d",
        "desc": "MATERIAL CONSUMPTION",
        "spec": "_",
        "unit": "KG/SQFT"
      }
    ]
  },
  {
    "sl": "1.2",
    "label": "Roof purlins",
    "labelSuffix": "89",
    "spec": "((ROOF!AU19+ROOF!AR19)-1)",
    "unit": "",
    "qtyField": "roofPurlinsQuantity",
    "unitField": "roofPurlinsUnit",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF ONE PURLIN",
        "spec": "((ROOF!I5/(ROOF!J9+ROOF!J10-1))+0.4)",
        "unit": "M",
        "addlSpec": "ADDITIONAL =",
        "addlUnit": "KG",
        "addlField": "roofPurlinsAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "NO.OF.PURLINS IN ONE FRAME",
        "spec": "((((((ROOF!I6/(COS(ROOF!J8*PI()/180)))/2)+0.14)/ROOF!J11)+1)*2)",
        "unit": "NOS"
      },
      {
        "sl": "c",
        "desc": "TOTAL NO.OF PURLIN BAY",
        "spec": "(ROOF!J9+ROOF!J10-1)",
        "unit": "NOS"
      },
      {
        "sl": "d",
        "desc": "UNIT WEIGHT OF PURLIN",
        "spec": "ROOF!W13",
        "unit": "KG/M"
      },
      {
        "sl": "e",
        "desc": "NO.OF.PURLINS IN EXTENDED FRAME",
        "spec": "(((ROOF!AQ19/COS(ROOF!J8*PI()/180))/ROOF!J11))",
        "unit": "NOS"
      },
      {
        "sl": "f",
        "desc": "NO.OF EXTENDED PURLIN BAY",
        "spec": "IF(((ROOF!AU19+ROOF!AR19)-1)&lt;1,0,((ROOF!AU19+ROOF!AR19)-1))",
        "unit": "NOS"
      }
    ]
  },
  {
    "sl": "1.3",
    "label": "Roof sheet",
    "spec": "(CONCATENATE(ROOF!AV5,\"MM THICK \",ROOF!AS5)))",
    "unit": "SQM",
    "qtyField": "roofSheetQuantity",
    "unitField": "roofSheetUnit",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "roofSheetPurchaseQuantity"
      },
      {
        "sl": "a",
        "desc": "EXTENDED ROOF WIDTH",
        "spec": "(ROOF!AQ19/COS(ROOF!J8*PI()/180))",
        "unit": "M",
        "addlSpec": "ADDITIONAL =",
        "addlUnit": "SQM",
        "addlField": "roofSheetAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "EXTENDED ROOF LENGTH",
        "spec": "((ROOF!I5/(ROOF!J9+ROOF!J10-1))*IF(((ROOF!AU19+ROOF!AR19)-1)&lt;1,0,((ROOF!AU19+ROOF!AR19)-1)))",
        "unit": "M"
      },
      {
        "sl": "c",
        "desc": "ROOF AREA DEDUCTIONS",
        "spec": "ROOF!AS9",
        "unit": "SQM"
      },
      {
        "sl": "d",
        "desc": "POLY CARBONATE AREA DEDUCTION",
        "spec": "ROOF!AX12 × ROOF!AX13 × ROOF!AX14",
        "unit": "SQM"
      }
    ]
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
        "purchField": "polycarbonateSheetPurchaseQuantity"
      },
      {
        "sl": "a",
        "desc": "LENGTH OF POLYCARBONATE SHEET",
        "spec": "ROOF!AX12",
        "unit": "M",
        "addlSpec": "ADDITIONAL =",
        "addlUnit": "SQM",
        "addlField": "polycarbonateSheetAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "WIDTH OF POLYCARBONATE SHEET",
        "spec": "ROOF!AX13",
        "unit": "M"
      },
      {
        "sl": "c",
        "desc": "NOS OF POLYCARBONATE SHEET",
        "spec": "ROOF!AX14",
        "unit": "NOS"
      }
    ]
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
        "spec": "SQRT(((((ROOF!I6 / 2) / (COS(ROOF!J8 × PI() / 180))) / ROOF!AA17)^2) + ((ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1)) × (ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1))))",
        "unit": "M",
        "addlSpec": "ADDITIONAL =",
        "addlUnit": "KG",
        "addlField": "roofWindBracingsAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "TOTAL NUMBER OF ROOF WIND BRACING",
        "spec": "ROOF!AA17 × 2 × 2 × ROOF!AA19",
        "unit": "NOS"
      },
      {
        "sl": "c",
        "desc": "UNIT WEIGHT OF ROOF WIND BRACING",
        "spec": "ROOF!AA22",
        "unit": "KG/M"
      }
    ]
  },
  {
    "sl": "1.6",
    "label": "Roof sag rod",
    "labelSuffix": "8.95456465",
    "spec": "(((ROOF!AQ19/COS(ROOF!J8*PI()/180))/ROOF!J11)-1))",
    "unit": "",
    "qtyField": "roofSagRodQuantity",
    "unitField": "roofSagRodUnit",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF SINGLE SAG ROD",
        "spec": "ROOF!J11 + 0.2",
        "unit": "M",
        "addlSpec": "ADDITIONAL =",
        "addlUnit": "KG",
        "addlField": "roofSagRodAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "NO.OF SAG ROD IN A SINGLE FRAME",
        "spec": "(() / ROOF!J11) × 2",
        "unit": ""
      },
      {
        "sl": "c",
        "desc": "NO.OF BAY IN SAG ROD PROVIDED",
        "spec": "ROOF!J9 + ROOF!J10 − 1",
        "unit": ""
      },
      {
        "sl": "d",
        "desc": "NO.OF.SAG ROD IN EXTENDED FRAME",
        "spec": "IF((((ROOF!AQ19/COS(ROOF!J8*PI()/180))/ROOF!J11)-1))&lt;1,0,(((ROOF!AQ19/COS(ROOF!J8*PI()/180))/ROOF!J11)-1)))",
        "unit": ""
      },
      {
        "sl": "e",
        "desc": "NO.OF EXTENDED SAG ROD BAY",
        "spec": "(((ROOF!AU19+ROOF!AR19)-1)&lt;1,0,((ROOF!AU19+ROOF!AR19)-1))",
        "unit": ""
      },
      {
        "sl": "f",
        "desc": "UNIT WEIGHT OF SAG ROD",
        "spec": "(ROOF!J22 × ROOF!J22) / 162",
        "unit": "KG/M"
      }
    ]
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
        "spec": "ROOF!AN12",
        "unit": "M",
        "addlSpec": "ADDITIONAL =",
        "addlUnit": "KG",
        "addlField": "roofFlangeBraceAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "NO.OF FLANGE BRACE IN MID FRAME",
        "spec": "((() / ROOF!J11) + 1) × 4",
        "unit": ""
      },
      {
        "sl": "c",
        "desc": "NO.OF FLANGE BRACE IN END FRAME",
        "spec": "((() / ROOF!J11) + 1) × 2",
        "unit": ""
      },
      {
        "sl": "d",
        "desc": "NO.OF MID FRAME",
        "spec": "ROOF!J9",
        "unit": ""
      },
      {
        "sl": "e",
        "desc": "NO.OF END FRAME",
        "spec": "ROOF!J10",
        "unit": ""
      },
      {
        "sl": "f",
        "desc": "NO.OF FLNG BRACE IN EXTENDED FRAME",
        "spec": "((0 / COS(ROOF!J8 × PI() / 180)) / ROOF!J11) × 2",
        "unit": ""
      },
      {
        "sl": "g",
        "desc": "NO.OF FLNG BRACE IN EXTENDED FRAME",
        "spec": "((((ROOF!AQ19/COS(ROOF!J8*PI()/180))/ROOF!J11)))",
        "unit": ""
      },
      {
        "sl": "h",
        "desc": "NO.OF EXTENDED MID FRAME",
        "spec": "ROOF!AR19",
        "unit": ""
      },
      {
        "sl": "i",
        "desc": "NO.OF EXTENDED END FRAME",
        "spec": "ROOF!AU19",
        "unit": ""
      },
      {
        "sl": "j",
        "desc": "LENGTH OF END FRAME FLANGE BRACE",
        "spec": "ROOF!AU19",
        "unit": ""
      }
    ]
  },
  {
    "sl": "1.8",
    "label": "Purlin bolts",
    "spec": "(CONCATENATE(JOINTS!AS21,\" MM DIA ORDINARY BOLTS\"))",
    "unit": "NOS",
    "qtyField": "purlinBoltsQuantity",
    "unitField": "purlinBoltsUnit",
    "subRows": [
      {
        "sl": "a",
        "desc": "NO.OF PURLIN JOINT IN SINGLE FRAME",
        "spec": "((() / ROOF!J11) + 1) × 2",
        "unit": ""
      },
      {
        "sl": "b",
        "desc": "TOTAL NO.OF FRAMES",
        "spec": "ROOF!J9 + ROOF!J10",
        "unit": ""
      },
      {
        "sl": "c",
        "desc": "NO.OF PURLIN NODE IN EXTENDED FRAME",
        "spec": "(((ROOF!AQ19/COS(ROOF!J8*PI()/180))/ROOF!J11))",
        "unit": ""
      },
      {
        "sl": "d",
        "desc": "NO.OF EXTENDED FRAMES",
        "spec": "(((ROOF!AR19+ROOF!AU19)))",
        "unit": ""
      },
      {
        "sl": "e",
        "desc": "NO.OF BOLTS IN SINGLE PURLIN JOINT",
        "spec": "JOINTS!AV21",
        "unit": ""
      }
    ]
  },
  {
    "sl": "1.9",
    "label": "NUMBER OF ROOF JOINT BOLTS",
    "spec": "(CONCATENATE(JOINTS!AI6,\" MM DIA HSFG BOLTS\"))",
    "unit": "NOS",
    "qtyField": "roofJointBoltsQuantity",
    "unitField": "roofJointBoltsUnit",
    "subRows": []
  },
  {
    "sl": "1.9.1",
    "label": "NUMBER OF Foundation bolts",
    "spec": "",
    "unit": "",
    "qtyField": "foundationBoltsQuantity",
    "unitField": "foundationBoltsUnit",
    "subRows": []
  },
  {
    "sl": "1.9.2",
    "label": "Anchor bolts",
    "spec": "",
    "unit": "",
    "qtyField": "anchorBoltsQuantity",
    "unitField": "anchorBoltsUnit",
    "subRows": []
  }
];

export const CLADDING_ROWS: RowDef[] = [
  {
    "sl": "2.1",
    "label": "Cladding structure",
    "spec": "",
    "unit": "KG",
    "qtyField": "claddingStructureQuantity",
    "unitField": "claddingStructureUnit",
    "subRows": [{
      "sl": "a",
      "desc": "CLADDING EAVE HEIGHT FRONT",
      "spec": "ROOF!AN12",
      "unit": "M",
      "addlSpec": "ADDITIONAL =",
      "addlUnit": "KG",
      "addlField": "roofFlangeBraceAdditionalQuantity"
    }, {
      "sl": "b",
      "desc": "CLADDING EAVE HEIGHT BACK",
      "spec": "ROOF!AN12",
      "unit": "M",

    }, {
      "sl": "c",
      "desc": "CLADDING EAVE HEIGHT RIGHT",
      "spec": "ROOF!AN12",
      "unit": "M",

    }, {
      "sl": "d",
      "desc": "CLADDING EAVE HEIGHT LEFT",
      "spec": "ROOF!AN12",
      "unit": "M",

    }, {
      "sl": "e",
      "desc": "EXTENDED COLUMN HEIGHT",
      "spec": "ROOF!AN12",
      "unit": "M",

    }, {
      "sl": "f",
      "desc": "WIDTH OF EXTENDED FRAME",
      "spec": "ROOF!AN12",
      "unit": "M",

    }, {
      "sl": "g",
      "desc": "NO.OF SIDE CLADDING PURLIN",
      "spec": "ROOF!AN12",
      "unit": "M",

    }, {
      "sl": "h",
      "desc": "NO.OF FACE CLADDING PURLIN",
      "spec": "ROOF!AN12",
      "unit": "M",

    }, {
      "sl": "i",
      "desc": "TOTAL LENGTH OF CLADDING PURLIN",
      "spec": "ROOF!AN12",
      "unit": "M",

    }, {
      "sl": "j",
      "desc": "TOTAL WEIGHT OF CLADDING PURLIN",
      "spec": "ROOF!AN12",
      "unit": "M",

    }, {
      "sl": "k",
      "desc": "CLADDING AREA WITHOUT ANY DEDUCTIONS",
      "spec": "ROOF!AN12",
      "unit": "M",

    }, {
      "sl": "l",
      "desc": "AVERAGE MATERIAL CONSUMPTION",
      "spec": "ROOF!AN12",
      "unit": "M",

    },
    {
      "sl": "m",
      "desc": "TOTAL CLADDING OPENINGS",
      "spec": "ROOF!AN12",
      "unit": "M",

    }, {
      "sl": "n",
      "desc": "FASCIA OPENING",
      "spec": "ROOF!AN12",
      "unit": "M",

    },]
  },
  {
    "sl": "2.2",
    "label": "CLADDING SHEET",
    "spec": "ADDITIONAL=",
    "specValue": "_",
    "unit": "SQM",
    "qtyField": "claddingSheetQuantity",
    "unitField": "claddingSheetUnit",
    "subRows": [{
      "sl": "",
      "desc": "",
      "spec": "PURCHASE QUANTITY",
      "unit": "SQM",
      "purchField": ""
    }]
  },
  {
    "sl": "2.3",
    "label": "Column wind bracings",
    "spec": "ADDITIONAL=",
    "specValue": "_",
    "unit": "44",
    "qtyField": "columnWindBracingsQuantity",
    "unitField": "columnWindBracingsUnit",
    "subRows": []
  },
  {
    "sl": "2.4",
    "label": "Cladding sag rod",
    "spec": "ADDITIONAL=",
    "specValue": "_",
    "unit": "54",
    "qtyField": "claddingSagRodQuantity",
    "unitField": "claddingSagRodUnit",
    "subRows": []
  },
  {
    "sl": "2.5",
    "label": "Cladding flange brace",
    "spec": "ADDITIONAL=",
    "specValue": "_",
    "unit": "65",
    "qtyField": "claddingFlangeBraceQuantity",
    "unitField": "claddingFlangeBraceUnit",
    "subRows": []
  },
  {
    "sl": "2.6",
    "label": "Cladding purlin bolts",
    "spec": "ADDITIONAL=",
    "specValue": "_",
    "unit": "75",
    "qtyField": "claddingPurlinBoltsQuantity",
    "unitField": "claddingPurlinBoltsUnit",
    "subRows": []
  }
];

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
    ]
  },
  {
    "sl": "3.2",
    "label": "Canopy Purlin",
    "spec": "",
    "unit": "KG",
    "qtyField": "purlinQuantity",
    "unitField": "purlinUnit",
    "subRows": []
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
        "purchField": "sheetPurchaseQuantity"
      }
    ]
  },
  {
    "sl": "3.4",
    "label": "Canopy Gutter",
    "spec": "",
    "unit": "M",
    "qtyField": "gutterQuantity",
    "unitField": "gutterUnit",
    "subRows": []
  },
  {
    "sl": "3.5",
    "label": "Canopy Down take",
    "spec": "",
    "unit": "M",
    "qtyField": "downTakeQuantity",
    "unitField": "downTakeUnit",
    "subRows": []
  },
  {
    "sl": "3.6",
    "label": "Canopy Side covering",
    "spec": "",
    "unit": "SQM",
    "qtyField": "sideCoveringQuantity",
    "unitField": "sideCoveringUnit",
    "subRows": []
  },
  {
    "sl": "3.7",
    "label": "Canopy Flashing",
    "spec": "",
    "unit": "M",
    "qtyField": "flashingQuantity",
    "unitField": "flashingUnit",
    "subRows": []
  },
  {
    "sl": "3.8",
    "label": "Canopy Purlin bolts",
    "spec": "",
    "unit": "NOS",
    "qtyField": "purlinBoltsQuantity",
    "unitField": "purlinBoltsUnit",
    "subRows": []
  },
  {
    "sl": "3.9",
    "label": "Canopy Joint bolts",
    "spec": "",
    "unit": "NOS",
    "qtyField": "jointBoltsQuantity",
    "unitField": "jointBoltsUnit",
    "subRows": []
  }
];

export const ACCESSORIES_ROWS: RowDef[] = [
  {
    "sl": "4.1",
    "label": "DOORS",
    "spec": "10",
    "specValue": "NOS",
    "unit": "SQM",
    "qtyField": "doorsCount",
    "unitField": "doorsCountUnit",
    "defaultQty": "21",
    "subRows": []
  },
  {
    "sl": "4.2",
    "label": "Windows",
    "spec": "10",
    "specValue": "NOS",
    "unit": "SQM",
    "qtyField": "doorsCount",
    "unitField": "doorsCountUnit",
    "defaultQty": "21",
    "subRows": []
  },
  {
    "sl": "4.3",
    "label": "Fascia structure",
    "spec": "",
    "unit": "",
    "qtyField": "fasciaStructureQuantity",
    "unitField": "fasciaStructureUnit",
    "subRows": []
  },
  {
    "sl": "4.4",
    "label": "Fascia covering sheet",
    "spec": "",
    "unit": "",
    "qtyField": "fasciaCoveringSheetQuantity",
    "unitField": "fasciaCoveringSheetUnit",
    "subRows": []
  },
  {
    "sl": "4.5",
    "label": "Internal partitions",
    "spec": "",
    "unit": "",
    "qtyField": "internalPartitionsQuantity",
    "unitField": "internalPartitionsUnit",
    "subRows": []
  },
  {
    "sl": "4.6",
    "label": "Ridge",
    "spec": "",
    "unit": "",
    "qtyField": "ridgeQuantity",
    "unitField": "ridgeUnit",
    "subRows": []
  },
  {
    "sl": "4.7",
    "label": "Gutter",
    "spec": "",
    "unit": "",
    "qtyField": "gutterQuantity",
    "unitField": "gutterUnit",
    "subRows": []
  },
  {
    "sl": "4.8",
    "label": "Down take",
    "spec": "",
    "unit": "",
    "qtyField": "downTakeQuantity",
    "unitField": "downTakeUnit",
    "subRows": []
  },
  {
    "sl": "4.9",
    "label": "Drip trim",
    "spec": "",
    "unit": "",
    "qtyField": "dripTrimQuantity",
    "unitField": "dripTrimUnit",
    "subRows": []
  },
  {
    "sl": "4.10",
    "label": "Gable end flashing",
    "spec": "",
    "unit": "",
    "qtyField": "gableEndFlashingQuantity",
    "unitField": "gableEndFlashingUnit",
    "subRows": []
  },
  {
    "sl": "4.11",
    "label": "Corner flash",
    "spec": "",
    "unit": "SQM",
    "qtyField": "cornerFlashCount",
    "unitField": "cornerFlashCountUnit",
    "subRows": []
  },
  {
    "sl": "4.12",
    "label": "Rolling shutter",
    "spec": "10",
    "specValue": "NOS",
    "unit": "SQM",
    "qtyField": "rollingShutterCount",
    "unitField": "rollingShutterCountUnit",
    "defaultQty": "21",
    "subRows": []
  },
  {
    "sl": "4.13",
    "label": "Louvers",
    "spec": "10",
    "specValue": "NOS",
    "unit": "SQM",
    "qtyField": "louversCount",
    "unitField": "louversCountUnit",
    "defaultQty": "21",
    "subRows": []
  },
  {
    "sl": "4.14",
    "label": "Sky light",
    "spec": "10",
    "specValue": "NOS",
    "unit": "SQM",
    "qtyField": "skyLightCount",
    "unitField": "skyLightCountUnit",
    "defaultQty": "21",
    "subRows": []
  },
  {
    "sl": "4.15",
    "label": "Wall light",
    "spec": "10",
    "specValue": "NOS",
    "unit": "SQM",
    "qtyField": "wallLightCount",
    "unitField": "wallLightCountUnit",
    "defaultQty": "21",
    "subRows": []
  },
  {
    "sl": "4.16",
    "label": "Roof insulation",
    "spec": "XLPE",
    "unit": "",
    "qtyField": "roofInsulationQuantity",
    "unitField": "roofInsulationUnit",
    "subRows": []
  },
  {
    "sl": "4.17",
    "label": "Wall insulation",
    "spec": "",
    "unit": "",
    "qtyField": "wallInsulationQuantity",
    "unitField": "wallInsulationUnit",
    "subRows": []
  },
  {
    "sl": "4.18",
    "label": "Turbo ventilators",
    "spec": "",
    "unit": "",
    "qtyField": "turboVentilatorsQuantity",
    "unitField": "turboVentilatorsUnit",
    "subRows": []
  },
  {
    "sl": "4.19",
    "label": "Handrail",
    "spec": "",
    "unit": "",
    "qtyField": "handrailQuantity",
    "unitField": "handrailUnit",
    "subRows": []
  }
];

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
        "addlSpec": "ADDITIONAL =",
        "addlUnit": "KG",
        "addlField": "totalMezzanineAreaAdditionalQuantity",
        "defaultQty": "4756"
      },
      {
        "sl": "b",
        "desc": "MATERIAL CONSUMPTION",
        "spec": "4",
        "unit": "KG/SQFT",
        "addlField": "totalMezzanineAreaAdditionalQuantity",
        "defaultQty": "4756"
      }
    ]
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
        "purchField": "deckSheetPurchaseQuantity"
      },
      {
        "sl": "",
        "desc": "",
        "spec": "",
        "unit": "",
        "addlSpec": "ADDITIONAL =",
        "addlUnit": "SQM",
        "addlField": "deckSheetAdditionalQuantity",
        "defaultQty": "46"
      },
    ]
  },
  {
    "sl": "5.3",
    "label": "Shear studs",
    "spec": "ADDITIONAL=",
    "specValue": "521",
    "unit": "",
    "qtyField": "shearStudsQuantity",
    "unitField": "shearStudsUnit",
    "subRows": []
  },
  {
    "sl": "5.4",
    "label": "Concrete flashing",
    "spec": "ADDITIONAL=",
    "specValue": "521",
    "unit": "",
    "qtyField": "concreteFlashingQuantity",
    "unitField": "concreteFlashingUnit",
    "subRows": []
  },
  {
    "sl": "5.5",
    "label": "Joint bolts",
    "spec": "16 MM DIA HSFG BOLTS",
    "unit": "",
    "qtyField": "jointBoltsQuantity",
    "unitField": null,
    "subRows": []
  },
  {
    "sl": "5.6",
    "label": "Foundation bolts",
    "spec": "",
    "unit": "",
    "qtyField": "foundationBoltsQuantity",
    "unitField": null,
    "subRows": []
  }
];

export const STAIR_ROWS: RowDef[] = [
  {
    "sl": "6.1",
    "label": "Total area",
    "spec": "",
    "unit": "SQM",
    "qtyField": "totalAreaQuantity",
    "unitField": "totalAreaUnit",
    "subRows": []
  },
  {
    "sl": "6.2",
    "label": "Stringer beams",
    "spec": "HR SECTION",
    "unit": "KG",
    "qtyField": "stringerBeamsQuantity",
    "unitField": "stringerBeamsUnit",
    "subRows": [{
      "sl": "",
      "desc": "",
      "spec": "",
      "unit": "",
      "addlSpec": "ADDITIONAL =",
      "addlUnit": "KG",
      "addlField": "stringerBeamsAdditionalQuantity"
    }]
  },
  {
    "sl": "6.3",
    "label": "Steps",
    "spec": "6MM CHQ PLATE",
    "unit": "KG",
    "qtyField": "stepsQuantity",
    "unitField": "stepsUnit",
    "subRows": [{
      "sl": "",
      "desc": "",
      "spec": "",
      "unit": "",
      "addlSpec": "ADDITIONAL =",
      "addlUnit": "KG",
      "addlField": "stringerBeamsAdditionalQuantity"
    }]
  }
];

export const ADDITIONAL_BOLTS_ROWS: RowDef[] = [
  {
    "sl": "7.1",
    "label": "Joint bolt 24mm HSFG",
    "spec": "24 MM DIA HSFG BOLTS",
    "unit": "NOS",
    "qtyField": "jointBolt24mmHsfgQuantity",
    "unitField": "jointBolt24mmHsfgUnit",
    "subRows": []
  },
  {
    "sl": "7.2",
    "label": "Joint bolt 20mm HSFG",
    "spec": "20 MM DIA HSFG BOLTS",
    "unit": "NOS",
    "qtyField": "jointBolt20mmHsfgQuantity",
    "unitField": "jointBolt20mmHsfgUnit",
    "subRows": []
  },
  {
    "sl": "7.3",
    "label": "Joint bolt 16mm HSFG",
    "spec": "16 MM DIA HSFG BOLTS",
    "unit": "NOS",
    "qtyField": "jointBolt16mmHsfgQuantity",
    "unitField": "jointBolt16mmHsfgUnit",
    "subRows": []
  },
  {
    "sl": "7.4",
    "label": "Purlin bolt 12mm ordinary",
    "spec": "12 MM DIA ORDINARY BOLTS",
    "unit": "NOS",
    "qtyField": "purlinBolt12mmOrdinaryQuantity",
    "unitField": "purlinBolt12mmOrdinaryUnit",
    "subRows": []
  },
  {
    "sl": "7.5",
    "label": "Anchor bolt",
    "spec": "",
    "unit": "NOS",
    "qtyField": "anchorBoltQuantity",
    "unitField": "anchorBoltUnit",
    "subRows": []
  },
  {
    "sl": "7.6",
    "label": "Foundation bolt",
    "spec": "",
    "unit": "NOS",
    "qtyField": "foundationBoltQuantity",
    "unitField": "foundationBoltUnit",
    "subRows": []
  }
];

