import type { RowDef } from './QuantityTableTypes';

export const PEB_ROOF_ROWS: RowDef[] = [
  {
    "label": "Material with purlin",
    "spec": "",
    "unit": "KG/SQFT",
    "qtyField": "materialWithPurlinQuantity",
    "unitField": "materialWithPurlinUnit",
    "subRows": []
  },
  {
    "label": "Rafters & columns",
    "spec": "Roof.gradeOfPlateMaterial",
    "unit": "KG",
    "qtyField": "raftersAndColumnsQuantity",
    "unitField": "raftersAndColumnsUnit",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF BUILDING",
        "spec": "Roof.buildingOverallLength",
        "unit": "M",
        "addlSpec": "ADDITIONAL =",
        "addlUnit": "KG",
        "addlField": "raftersAndColumnsAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "INCLINED LENGTH IN ONE HALF",
        "spec": "((ROOF!I6 / (COS(ROOF!J8 × PI() / 180))) / 2) + 0.14",
        "unit": "M"
      },
      {
        "sl": "c",
        "desc": "ROOF AREA",
        "spec": "ROOF!I5 × (((ROOF!I6 / (COS(ROOF!J8 × PI() / 180))) / 2) + 0.14) × 2 × 10.76",
        "unit": "SQFT"
      },
      {
        "sl": "d",
        "desc": "MATERIAL CONSUMPTION",
        "spec": "Roof.materialConsumptionExcludingPurlin",
        "unit": "KG/SQFT"
      }
    ]
  },
  {
    "label": "Roof purlins",
    "spec": "((ROOF!AU19+ROOF!AR19)-1)",
    "unit": "ROOF!S13 &amp; &quot;PURLIN &quot; &amp; ROOF!U13 &amp; &quot; MM DEPTH&quot;",
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
    "label": "Roof sag rod",
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
        "spec": "((((ROOF!I6 / (COS(ROOF!J8 × PI() / 180))) / 2) + 0.14) / ROOF!J11) × 2",
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
    "label": "Roof flange brace",
    "spec": "",
    "unit": "KG",
    "qtyField": "roofFlangeBraceQuantity",
    "unitField": "roofFlangeBraceUnit",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF MID FRAME FLANGE BRACE",
        "spec": "ROOF!AN12",
        "unit": "M",
        "addlSpec": "ADDITIONAL =",
        "addlUnit": "KG",
        "addlField": "roofFlangeBraceAdditionalQuantity"
      },
      {
        "sl": "b",
        "desc": "NO.OF FLANGE BRACE IN MID FRAME",
        "spec": "(((((ROOF!I6 / (COS(ROOF!J8 × PI() / 180))) / 2) + 0.14) / ROOF!J11) + 1) × 4",
        "unit": ""
      },
      {
        "sl": "c",
        "desc": "NO.OF FLANGE BRACE IN END FRAME",
        "spec": "(((((ROOF!I6 / (COS(ROOF!J8 × PI() / 180))) / 2) + 0.14) / ROOF!J11) + 1) × 2",
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
      }
    ]
  },
  {
    "label": "Purlin bolts",
    "spec": "(CONCATENATE(JOINTS!AS21,\" MM DIA ORDINARY BOLTS\"))",
    "unit": "NOS",
    "qtyField": "purlinBoltsQuantity",
    "unitField": "purlinBoltsUnit",
    "subRows": [
      {
        "sl": "a",
        "desc": "NO.OF PURLIN JOINT IN SINGLE FRAME",
        "spec": "(((((ROOF!I6 / (COS(ROOF!J8 × PI() / 180))) / 2) + 0.14) / ROOF!J11) + 1) × 2",
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
    "label": "Roof joint bolts",
    "spec": "(CONCATENATE(JOINTS!AI6,\" MM DIA HSFG BOLTS\"))",
    "unit": "NOS",
    "qtyField": "roofJointBoltsQuantity",
    "unitField": "roofJointBoltsUnit",
    "subRows": []
  },
  {
    "label": "Foundation bolts",
    "spec": "",
    "unit": "",
    "qtyField": "foundationBoltsQuantity",
    "unitField": "foundationBoltsUnit",
    "subRows": []
  },
  {
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
    "label": "Cladding structure",
    "spec": "",
    "unit": "KG",
    "qtyField": "claddingStructureQuantity",
    "unitField": "claddingStructureUnit",
    "subRows": []
  },
  {
    "label": "Cladding sheet",
    "spec": "ADDITIONAL=",
    "unit": "53",
    "qtyField": "claddingSheetQuantity",
    "unitField": "claddingSheetUnit",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "claddingSheetPurchaseQuantity"
      }
    ]
  },
  {
    "label": "Column wind bracings",
    "spec": "ADDITIONAL=",
    "unit": "44",
    "qtyField": "columnWindBracingsQuantity",
    "unitField": "columnWindBracingsUnit",
    "subRows": []
  },
  {
    "label": "Cladding sag rod",
    "spec": "ADDITIONAL=",
    "unit": "54",
    "qtyField": "claddingSagRodQuantity",
    "unitField": "claddingSagRodUnit",
    "subRows": []
  },
  {
    "label": "Cladding flange brace",
    "spec": "ADDITIONAL=",
    "unit": "65",
    "qtyField": "claddingFlangeBraceQuantity",
    "unitField": "claddingFlangeBraceUnit",
    "subRows": []
  },
  {
    "label": "Cladding purlin bolts",
    "spec": "ADDITIONAL=",
    "unit": "75",
    "qtyField": "claddingPurlinBoltsQuantity",
    "unitField": "claddingPurlinBoltsUnit",
    "subRows": []
  }
];

export const CANOPY_ROWS: RowDef[] = [
  {
    "label": "Structure",
    "spec": "",
    "unit": "KG",
    "qtyField": "structureQuantity",
    "unitField": "structureUnit",
    "subRows": []
  },
  {
    "label": "Purlin",
    "spec": "",
    "unit": "KG",
    "qtyField": "purlinQuantity",
    "unitField": "purlinUnit",
    "subRows": []
  },
  {
    "label": "Sheet",
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
    "label": "Gutter",
    "spec": "",
    "unit": "M",
    "qtyField": "gutterQuantity",
    "unitField": "gutterUnit",
    "subRows": []
  },
  {
    "label": "Down take",
    "spec": "",
    "unit": "M",
    "qtyField": "downTakeQuantity",
    "unitField": "downTakeUnit",
    "subRows": []
  },
  {
    "label": "Side covering",
    "spec": "",
    "unit": "SQM",
    "qtyField": "sideCoveringQuantity",
    "unitField": "sideCoveringUnit",
    "subRows": []
  },
  {
    "label": "Flashing",
    "spec": "",
    "unit": "M",
    "qtyField": "flashingQuantity",
    "unitField": "flashingUnit",
    "subRows": []
  },
  {
    "label": "Purlin bolts",
    "spec": "",
    "unit": "NOS",
    "qtyField": "purlinBoltsQuantity",
    "unitField": "purlinBoltsUnit",
    "subRows": []
  },
  {
    "label": "Joint bolts",
    "spec": "",
    "unit": "NOS",
    "qtyField": "jointBoltsQuantity",
    "unitField": "jointBoltsUnit",
    "subRows": []
  }
];

export const ACCESSORIES_ROWS: RowDef[] = [
  {
    "label": "Doors",
    "spec": "ACCESSORIES!AR5",
    "unit": "NOS",
    "qtyField": "doorsCount",
    "unitField": "doorsCountUnit",
    "subRows": []
  },
  {
    "label": "Windows",
    "spec": "10",
    "unit": "NOS",
    "qtyField": "windowsCount",
    "unitField": "windowsCountUnit",
    "subRows": []
  },
  {
    "label": "Fascia structure",
    "spec": "",
    "unit": "",
    "qtyField": "fasciaStructureQuantity",
    "unitField": "fasciaStructureUnit",
    "subRows": []
  },
  {
    "label": "Fascia covering sheet",
    "spec": "",
    "unit": "",
    "qtyField": "fasciaCoveringSheetQuantity",
    "unitField": "fasciaCoveringSheetUnit",
    "subRows": []
  },
  {
    "label": "Internal partitions",
    "spec": "",
    "unit": "",
    "qtyField": "internalPartitionsQuantity",
    "unitField": "internalPartitionsUnit",
    "subRows": []
  },
  {
    "label": "Ridge",
    "spec": "",
    "unit": "",
    "qtyField": "ridgeQuantity",
    "unitField": "ridgeUnit",
    "subRows": []
  },
  {
    "label": "Gutter",
    "spec": "",
    "unit": "",
    "qtyField": "gutterQuantity",
    "unitField": "gutterUnit",
    "subRows": []
  },
  {
    "label": "Down take",
    "spec": "",
    "unit": "",
    "qtyField": "downTakeQuantity",
    "unitField": "downTakeUnit",
    "subRows": []
  },
  {
    "label": "Drip trim",
    "spec": "",
    "unit": "",
    "qtyField": "dripTrimQuantity",
    "unitField": "dripTrimUnit",
    "subRows": []
  },
  {
    "label": "Gable end flashing",
    "spec": "",
    "unit": "",
    "qtyField": "gableEndFlashingQuantity",
    "unitField": "gableEndFlashingUnit",
    "subRows": []
  },
  {
    "label": "Corner flash",
    "spec": "",
    "unit": "",
    "qtyField": "cornerFlashCount",
    "unitField": "cornerFlashCountUnit",
    "subRows": []
  },
  {
    "label": "Rolling shutter",
    "spec": "",
    "unit": "",
    "qtyField": "rollingShutterCount",
    "unitField": "rollingShutterCountUnit",
    "subRows": []
  },
  {
    "label": "Louvers",
    "spec": "",
    "unit": "",
    "qtyField": "louversCount",
    "unitField": "louversCountUnit",
    "subRows": []
  },
  {
    "label": "Sky light",
    "spec": "",
    "unit": "",
    "qtyField": "skyLightCount",
    "unitField": "skyLightCountUnit",
    "subRows": []
  },
  {
    "label": "Wall light",
    "spec": "",
    "unit": "",
    "qtyField": "wallLightCount",
    "unitField": "wallLightCountUnit",
    "subRows": []
  },
  {
    "label": "Roof insulation",
    "spec": "",
    "unit": "",
    "qtyField": "roofInsulationQuantity",
    "unitField": "roofInsulationUnit",
    "subRows": []
  },
  {
    "label": "Wall insulation",
    "spec": "",
    "unit": "",
    "qtyField": "wallInsulationQuantity",
    "unitField": "wallInsulationUnit",
    "subRows": []
  },
  {
    "label": "Turbo ventilators",
    "spec": "",
    "unit": "",
    "qtyField": "turboVentilatorsQuantity",
    "unitField": "turboVentilatorsUnit",
    "subRows": []
  },
  {
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
    "label": "Structure",
    "spec": "",
    "unit": "KG",
    "qtyField": "structureQuantity",
    "unitField": "structureUnit",
    "subRows": []
  },
  {
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
      }
    ]
  },
  {
    "label": "Shear studs",
    "spec": "ADDITIONAL=",
    "unit": "5580",
    "qtyField": "shearStudsQuantity",
    "unitField": "shearStudsUnit",
    "subRows": []
  },
  {
    "label": "Concrete flashing",
    "spec": "ADDITIONAL=",
    "unit": "6565",
    "qtyField": "concreteFlashingQuantity",
    "unitField": "concreteFlashingUnit",
    "subRows": []
  },
  {
    "label": "Joint bolts",
    "spec": "16 MM DIA HSFG BOLTS",
    "unit": "",
    "qtyField": "jointBoltsQuantity",
    "unitField": null,
    "subRows": []
  },
  {
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
    "label": "Total area",
    "spec": "",
    "unit": "SQM",
    "qtyField": "totalAreaQuantity",
    "unitField": "totalAreaUnit",
    "subRows": []
  },
  {
    "label": "Stringer beams",
    "spec": "HR SECTION",
    "unit": "KG",
    "qtyField": "stringerBeamsQuantity",
    "unitField": "stringerBeamsUnit",
    "subRows": []
  },
  {
    "label": "Steps",
    "spec": "6MM CHQ PLATE",
    "unit": "KG",
    "qtyField": "stepsQuantity",
    "unitField": "stepsUnit",
    "subRows": []
  }
];

export const ADDITIONAL_BOLTS_ROWS: RowDef[] = [
  {
    "label": "Joint bolt 24mm HSFG",
    "spec": "24 MM DIA HSFG BOLTS",
    "unit": "NOS",
    "qtyField": "jointBolt24mmHsfgQuantity",
    "unitField": "jointBolt24mmHsfgUnit",
    "subRows": []
  },
  {
    "label": "Joint bolt 20mm HSFG",
    "spec": "20 MM DIA HSFG BOLTS",
    "unit": "NOS",
    "qtyField": "jointBolt20mmHsfgQuantity",
    "unitField": "jointBolt20mmHsfgUnit",
    "subRows": []
  },
  {
    "label": "Joint bolt 16mm HSFG",
    "spec": "16 MM DIA HSFG BOLTS",
    "unit": "NOS",
    "qtyField": "jointBolt16mmHsfgQuantity",
    "unitField": "jointBolt16mmHsfgUnit",
    "subRows": []
  },
  {
    "label": "Purlin bolt 12mm ordinary",
    "spec": "12 MM DIA ORDINARY BOLTS",
    "unit": "NOS",
    "qtyField": "purlinBolt12mmOrdinaryQuantity",
    "unitField": "purlinBolt12mmOrdinaryUnit",
    "subRows": []
  },
  {
    "label": "Anchor bolt",
    "spec": "",
    "unit": "NOS",
    "qtyField": "anchorBoltQuantity",
    "unitField": "anchorBoltUnit",
    "subRows": []
  },
  {
    "label": "Foundation bolt",
    "spec": "",
    "unit": "NOS",
    "qtyField": "foundationBoltQuantity",
    "unitField": "foundationBoltUnit",
    "subRows": []
  }
];

