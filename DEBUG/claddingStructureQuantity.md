# QUANTITY!T65 / claddingStructureQuantity

**Line item:** CLADDING STRUCTURE  
**Unit:** KG  
**Original Excel formula:** `=IF($D$6=FALSE,"NA",((L76-L78-L79)*10.76*L77))`  
**Computed value:** `326.1490767398134`

---

## 1. `L76`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| EAVE HEIGHT (CLADDING Ht.) | `ROOF!J7` | `5.645` |
| BRICK | `ROOF!AI6` | `2.4` |
| BUILDING O/O WIDTH | `ROOF!I6` | `15` |
| ROOF SLOPE (DEGREE) | `ROOF!J8` | `6` |
| BRICK | `ROOF!AI9` | `2.4` |
| CLADDING | `ROOF!AQ20` | `12` |
| BRICK | `ROOF!AI7` | `2.4` |
| BUILDING O/O LENGTH | `ROOF!I5` | `30` |
| BRICK | `ROOF!AI8` | `2.4` |

```
L76 = (ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5
= 366.61921658913116
```

---

## 2. `L78`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| FRONT SIDE | `ROOF!AH18` | `45` |
| BACK SIDE | `ROOF!AH19` | `42` |
| RIGHT SIDE | `ROOF!AH20` | `78` |
| LEFT SIDE | `ROOF!AH21` | `45` |

```
L78 = ROOF!AH18 + ROOF!AH19 + ROOF!AH20 + ROOF!AH21
= 210
```

---

## 3. `L79`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| FASCIA BOARD AREA | `ROOF!AK24` | `51.72` |

```
L79 = ROOF!AK24
= 51.72
```

---

## 4. `L77`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| BUILDING O/O LENGTH | `ROOF!I5` | `30` |
| NO. OF CLADDING PURLINS NO. OF INTERNAL COLUMNS | `ROOF!J12` | `2` |
| BUILDING O/O WIDTH | `ROOF!I6` | `15` |
| CLADDING | `ROOF!AQ20` | `12` |
| CLADDING PURLINS | `ROOF!W14` | `4.72` |
| EAVE HEIGHT (CLADDING Ht.) | `ROOF!J7` | `5.645` |
| BRICK | `ROOF!AI6` | `2.4` |
| ROOF SLOPE (DEGREE) | `ROOF!J8` | `6` |
| BRICK | `ROOF!AI9` | `2.4` |
| BRICK | `ROOF!AI7` | `2.4` |
| BRICK | `ROOF!AI8` | `2.4` |

```
L77 = (ROOF!I5 × ROOF!J12 × 2 + ROOF!J12 × ROOF!I6 × 2 + ROOF!AQ20 × ROOF!J12 × 2 + 2 × ROOF!I6 × 0.45) × ROOF!W14 / (((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5) × 10.76)
= 0.28895594715293027
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| EAVE HEIGHT (CLADDING Ht.) | `ROOF!J7` | `5.645` |
| BRICK | `ROOF!AI6` | `2.4` |
| BUILDING O/O WIDTH | `ROOF!I6` | `15` |
| ROOF SLOPE (DEGREE) | `ROOF!J8` | `6` |
| BRICK | `ROOF!AI9` | `2.4` |
| CLADDING | `ROOF!AQ20` | `12` |
| BRICK | `ROOF!AI7` | `2.4` |
| BUILDING O/O LENGTH | `ROOF!I5` | `30` |
| BRICK | `ROOF!AI8` | `2.4` |
| FRONT SIDE | `ROOF!AH18` | `45` |
| BACK SIDE | `ROOF!AH19` | `42` |
| RIGHT SIDE | `ROOF!AH20` | `78` |
| LEFT SIDE | `ROOF!AH21` | `45` |
| FASCIA BOARD AREA | `ROOF!AK24` | `51.72` |
| NO. OF CLADDING PURLINS NO. OF INTERNAL COLUMNS | `ROOF!J12` | `2` |
| CLADDING PURLINS | `ROOF!W14` | `4.72` |

```
QUANTITY!T65 = ((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5 − (ROOF!AH18 + ROOF!AH19 + ROOF!AH20 + ROOF!AH21) − ROOF!AK24) × 10.76 × (ROOF!I5 × ROOF!J12 × 2 + ROOF!J12 × ROOF!I6 × 2 + ROOF!AQ20 × ROOF!J12 × 2 + 2 × ROOF!I6 × 0.45) × ROOF!W14 / (((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5) × 10.76)
= 326.1490767398134
```

"claddingStructureQuantity": "((Roof.eaveHeight − enum_SideWallSide:FRONT_Sidewall.height + Roof.buildingOverallWidth / 2 × TAN(Roof.roofSlope × PI() / 180) + Roof.eaveHeight − enum_SideWallSide:FRONT_Sidewall.height) / 2 × Roof.buildingOverallWidth + (Roof.eaveHeight − enum_SideWallSide:LEFT_Sidewall.height + Roof.eaveHeight − Roof.claddingExtensionWidthHeight × TAN(Roof.roofSlope × PI() / 180) − enum_SideWallSide:LEFT_Sidewall.height) / 2 × Roof.claddingExtensionWidthHeight + (Roof.eaveHeight − enum_SideWallSide:BACK_Sidewall.height + Roof.buildingOverallWidth / 2 × TAN(Roof.roofSlope × PI() / 180) + Roof.eaveHeight − enum_SideWallSide:BACK_Sidewall.height) / 2 × Roof.buildingOverallWidth + (Roof.eaveHeight − enum_SideWallSide:LEFT_Sidewall.height + Roof.eaveHeight − Roof.claddingExtensionWidthHeight × TAN(Roof.roofSlope × PI() / 180) − enum_SideWallSide:LEFT_Sidewall.height) / 2 × Roof.claddingExtensionWidthHeight + (Roof.eaveHeight − enum_SideWallSide:LEFT_Sidewall.height) × Roof.buildingOverallLength + (Roof.eaveHeight − enum_SideWallSide:RIGHT_Sidewall.height) × Roof.buildingOverallLength − (Roof.frontCladdingOpeningArea + Roof.backCladdingOpeningArea + Roof.rightCladdingOpeningArea + Roof.leftCladdingOpeningArea) − Roof.fasciaBoardArea) × 10.76 × (Roof.buildingOverallLength × Roof.claddingPurlins × 2 + Roof.claddingPurlins × Roof.buildingOverallWidth × 2 + Roof.claddingExtensionWidthHeight × Roof.claddingPurlins × 2 + 2 × Roof.buildingOverallWidth × 0.45) × Roof.claddingPurlinUnitWeight / (((Roof.eaveHeight − enum_SideWallSide:FRONT_Sidewall.height + Roof.buildingOverallWidth / 2 × TAN(Roof.roofSlope × PI() / 180) + Roof.eaveHeight − enum_SideWallSide:FRONT_Sidewall.height) / 2 × Roof.buildingOverallWidth + (Roof.eaveHeight − enum_SideWallSide:LEFT_Sidewall.height + Roof.eaveHeight − Roof.claddingExtensionWidthHeight × TAN(Roof.roofSlope × PI() / 180) − enum_SideWallSide:LEFT_Sidewall.height) / 2 × Roof.claddingExtensionWidthHeight + (Roof.eaveHeight − enum_SideWallSide:BACK_Sidewall.height + Roof.buildingOverallWidth / 2 × TAN(Roof.roofSlope × PI() / 180) + Roof.eaveHeight − enum_SideWallSide:BACK_Sidewall.height) / 2 × Roof.buildingOverallWidth + (Roof.eaveHeight − enum_SideWallSide:LEFT_Sidewall.height + Roof.eaveHeight − Roof.claddingExtensionWidthHeight × TAN(Roof.roofSlope × PI() / 180) − enum_SideWallSide:LEFT_Sidewall.height) / 2 × Roof.claddingExtensionWidthHeight + (Roof.eaveHeight − enum_SideWallSide:LEFT_Sidewall.height) × Roof.buildingOverallLength + (Roof.eaveHeight − enum_SideWallSide:RIGHT_Sidewall.height) × Roof.buildingOverallLength) × 10.76)"





JOB RESPONSE

{
    "id": "cmrximveu0001mkv08cwnlrkd",
    "userId": "user_3EfmONmZWOmsqVwUa3RgGLeNVbp",
    "projectNo": "20-212",
    "subject": "20-212 Offer for Supply and Installation of Pre Engineered Steel Hypermarket Building at Wandoor",
    "refNo": "FBS/SM/212/17/12/2020",
    "date": "2026-07-23T00:00:00.000Z",
    "designedByName": "ROHITH E",
    "designedByMobile": "9747289249",
    "clientName": "Yaseen K C",
    "estimationEngineerName": "ROHITH E",
    "estimationEngineerMobile": "9747289249",
    "headOfSalesName": "ROHITH E",
    "headOfSalesMobile": "9747289249",
    "firmName": "M/S MOCA ARCHITECTS",
    "buildingUsage": "Commercial Building",
    "numberOfBuilding": 1,
    "frameType": "Portal",
    "configuration": "Clear Span",
    "createdAt": "2026-07-23T12:56:57.222Z",
    "updatedAt": "2026-07-24T16:25:11.952Z",
    "roof": {
        "id": "cmrxipiur0002mkv0k30whn8p",
        "jobId": "cmrximveu0001mkv08cwnlrkd",
        "buildingOverallLength": "30",
        "buildingOverallWidth": "15",
        "eaveHeight": "5.65",
        "roofSlope": "6",
        "mainRoofFrames": 4,
        "endRoofFrames": 2,
        "roofPurlinSpacing": "1.27",
        "claddingPurlins": 2,
        "internalColumnsForMainRoofFrames": 1,
        "internalColumnsForEndRoofFrames": 2,
        "columnSegmentsInMainFrame": 1,
        "raftersInOneHalfOfMainFrame": 2,
        "columnSegmentsInEndFrame": 1,
        "raftersInOneHalfOfEndFrame": 2,
        "endFrameHorizontalTieBeam": 5,
        "roofPurlinType": "Z_C",
        "roofPurlinDepth": "150",
        "roofPurlinUnitWeight": "4.72",
        "claddingPurlinType": "Z_C",
        "claddingPurlinDepth": "150",
        "claddingPurlinUnitWeight": "4.72",
        "roofCoveringType": "PUFF_SHEET",
        "roofCoveringThickness": "30",
        "claddingCoveringType": "PPGL",
        "claddingCoveringThickness": "4.4",
        "roofAreaDeduction": "5",
        "roofFlangeBraceAverageLength": "1.5",
        "claddingFlangeBraceAverageLength": "1",
        "endFrameFlangeBraceAverageLength": "0.5",
        "polycarbonateRoofLength": "6",
        "polycarbonateRoofWidth": "7",
        "polycarbonateRoofCount": 8,
        "roofWindBracingSegmentsInOneHalf": 1,
        "columnWindBracingSegments": 1,
        "roofWindBracingProvidedBays": 2,
        "columnWindBracingProvidedBays": 2,
        "windBracingColumnHeight": "5.6",
        "windBracingUnitWeight": "2.46",
        "roofWindBracingBaySpacing": "6",
        "columnWindBracingBaySpacing": "6",
        "roofWindBracingLength": "9.637",
        "columnWindBracingLength": "8.207",
        "windBracingType": "ROD",
        "frontCladdingOpeningArea": "45",
        "backCladdingOpeningArea": "45",
        "rightCladdingOpeningArea": "45",
        "leftCladdingOpeningArea": "45",
        "fasciaBoardArea": "51.7",
        "fasciaMaterialWeightPerSqft": "1",
        "roofExtensionWidthHeight": "12",
        "roofExtensionMidFrameCount": 45,
        "roofExtensionEndFrameCount": 45,
        "claddingExtensionWidthHeight": "12",
        "claddingExtensionMidFrameCount": 8,
        "claddingExtensionEndFrameCount": 62,
        "sideColumnsWidthHeight": "4.389",
        "sideColumnsMidFrameCount": 8,
        "sideColumnsEndFrameCount": 62,
        "gradeOfPlateMaterial": "FE_345",
        "createdAt": "2026-07-23T12:59:00.915Z",
        "updatedAt": "2026-07-24T16:25:13.609Z",
        "roofFrameBaseFixing": "FOUNDATION_BOLT",
        "materialConsumptionExcludingPurlin": "1.25",
        "diaOfRoofSagRod": "12",
        "diaOfCladdingSagRod": "12",
        "sidewalls": [
            {
                "id": "cmrz5ikcw00001cv02yocmuwr",
                "roofId": "cmrxipiur0002mkv0k30whn8p",
                "side": "FRONT",
                "wallType": "BRICK",
                "thickness": "200",
                "height": "2.4"
            },
            {
                "id": "cmrz5ikcx00011cv0t8boevjl",
                "roofId": "cmrxipiur0002mkv0k30whn8p",
                "side": "BACK",
                "wallType": "BRICK",
                "thickness": "200",
                "height": "2.4"
            },
            {
                "id": "cmrz5ikcx00021cv08khd38oo",
                "roofId": "cmrxipiur0002mkv0k30whn8p",
                "side": "RIGHT",
                "wallType": "BRICK",
                "thickness": "200",
                "height": "2.4"
            },
            {
                "id": "cmrz5ikcx00031cv0blrlydl7",
                "roofId": "cmrxipiur0002mkv0k30whn8p",
                "side": "LEFT",
                "wallType": "BRICK",
                "thickness": "200",
                "height": "2.4"
            }
        ]
    },
    "mezzanine": {
        "id": "cmrxiq9d80007mkv0gynazt7c",
        "jobId": "cmrximveu0001mkv08cwnlrkd",
        "createdAt": "2026-07-23T12:59:35.276Z",
        "updatedAt": "2026-07-23T12:59:35.276Z",
        "floors": [
            {
                "id": "cmrz5ilq100041cv0ygaqi829",
                "mezzanineId": "cmrxiq9d80007mkv0gynazt7c",
                "code": "MEZ_1",
                "floor": "FLOOR_1",
                "type": "DECK_SHEET",
                "heightFrom": "GROUND",
                "thicknessMm": "0.8",
                "lengthM": "15",
                "widthM": "6",
                "heightM": "2.75",
                "materialConsumptionKgPerSqft": "3.5",
                "beamsMidPrimary": 1,
                "beamsEndPrimary": 1,
                "beamsSecondary": 12,
                "jointsMidPrimary": 3,
                "jointsEndPrimary": 3,
                "internalColumnsMidPrimary": 2,
                "internalColumnsEndPrimary": 2
            }
        ],
        "extensions": [
            {
                "id": "cmrz5ilq400051cv0he80672h",
                "mezzanineId": "cmrxiq9d80007mkv0gynazt7c",
                "code": null,
                "type": "DECK_SHEET",
                "heightFrom": "GROUND",
                "typicalTo": "FLOOR_1",
                "thicknessMm": "0.8",
                "lengthM": "15",
                "widthM": "6",
                "heightM": "2.75",
                "beamsMidPrimary": 1,
                "beamsEndPrimary": 1,
                "beamsSecondary": 12,
                "jointsMidPrimary": 3,
                "jointsEndPrimary": 3,
                "extendedColumnsMidPrimary": 2,
                "extendedColumnsEndPrimary": 2
            }
        ]
    },
    "stair": {
        "id": "cmrxiqtj8000amkv01dcnfht6",
        "jobId": "cmrximveu0001mkv08cwnlrkd",
        "createdAt": "2026-07-23T13:00:01.412Z",
        "updatedAt": "2026-07-23T13:00:01.412Z",
        "stairs": [
            {
                "id": "cmrz5imxn00061cv011u7tqv9",
                "stairId": "cmrxiqtj8000amkv01dcnfht6",
                "code": "STAIR-1",
                "typeOfStep": "CHQ_PLATE_6MM",
                "location": "MEZ_1",
                "startingFrom": "GROUND",
                "endingUpTo": "FIRST_FLOOR",
                "length": "4",
                "width": "1.25",
                "height": "2.75",
                "numberOfMidLanding": 1,
                "typeOfStringer": "HR_SECTION",
                "unitWeightOfStringer": "22.3"
            }
        ],
        "areaDeductions": [
            {
                "id": "cmrz5imy000071cv0v9b6970f",
                "stairId": "cmrxiqtj8000amkv01dcnfht6",
                "type": "CUT_OUT",
                "location": "MEZ_1",
                "areaM2": "3.6",
                "numbers": 1,
                "deductionFor": "BOTH"
            }
        ]
    },
    "canopy": {
        "id": "cmrxir73t000dmkv0ydsid5e9",
        "jobId": "cmrximveu0001mkv08cwnlrkd",
        "createdAt": "2026-07-23T13:00:19.001Z",
        "updatedAt": "2026-07-23T13:00:19.001Z",
        "canopies": [
            {
                "id": "cmrz5inze00081cv0f0qnmkij",
                "canopyId": "cmrxir73t000dmkv0ydsid5e9",
                "code": "CANOPY_1",
                "heightFrom": "GROUND",
                "length": "15",
                "width": "2",
                "height": "3.5",
                "materialConsumptionKgPerSqft": "1.25",
                "numberOfBeams": 4,
                "numberOfPurlins": 3,
                "purlinDepth": "150",
                "unitWeightOfPurlin": "4.72",
                "canopySheet": "PPGL",
                "sheetThick": "0.4",
                "canopySideCoveringHeight": "0.5",
                "gutter": true,
                "downTake": true,
                "flashing": true
            }
        ]
    },
    "load": {
        "id": "cmrxjll31000gmkv0ok37hq2b",
        "jobId": "cmrximveu0001mkv08cwnlrkd",
        "deadLoadOnRoofRafters": "0.15",
        "liveLoadOnRoofRafters": "0.6",
        "collateralLoadOnRoofRafters": "50",
        "windLoadOnRoofRaftersUpward": "140",
        "windLoadHorizontal": "140",
        "deadLoadOnRoofFloor": "24",
        "liveLoadOnRoofFloor": "36",
        "floorDeadLoad": "2.25",
        "floorFinishLoad": "0.25",
        "floorLiveLoad": "3",
        "snowLoad": "13",
        "earthquakeLoad": "56",
        "approvalDrawingsTime": 7,
        "approvalDrawingsUnit": "DAYS",
        "supplyOfMaterialsDays": 60,
        "erectionOfStructureDays": 12,
        "createdAt": "2026-07-23T13:23:56.797Z",
        "updatedAt": "2026-07-24T16:25:22.884Z"
    },
    "accessories": {
        "id": "cmrxjlkgx000fmkv0v6ynp2x4",
        "jobId": "cmrximveu0001mkv08cwnlrkd",
        "gutterType": "PPGL",
        "gutterSize": "IN_6",
        "gutterQuantity": "246",
        "gutterQuantityManual": true,
        "downTakeType": "UPVC",
        "downTakeSize": "IN_4",
        "downTakeQuantity": "229",
        "downTakeQuantityManual": true,
        "dripTrimType": "PPGL",
        "dripTrimThickness": "MM_0_45",
        "dripTrimQuantity": "456",
        "dripTrimQuantityManual": true,
        "gableEndFlashingType": "PPGL",
        "gableEndFlashingThickness": "MM_0_45",
        "gableEndFlashingQuantity": "46",
        "gableEndFlashingQuantityManual": true,
        "cornerFlashType": "PPGL",
        "cornerFlashThickness": "MM_0_45",
        "cornerFlashQuantity": "23",
        "cornerFlashQuantityManual": true,
        "ridgeType": "PPGL",
        "ridgeThickness": "MM_0_45",
        "ridgeQuantity": "412",
        "ridgeQuantityManual": true,
        "partitionType": "CEMENT_BOARD",
        "partitionThickness": "MM_8",
        "partitionQuantity": 900,
        "rollingShutterLength": "10",
        "rollingShutterWidth": "10",
        "rollingShutterNos": 1,
        "rollingShutterQuantity": "100",
        "louverLength": "10",
        "louverWidth": "10",
        "louverNos": 1,
        "louverQuantity": "100",
        "skyLightLength": "10",
        "skyLightWidth": "10",
        "skyLightNos": 1,
        "skyLightQuantity": "100",
        "wallLightLength": "10",
        "wallLightWidth": "10",
        "wallLightNos": 1,
        "wallLightQuantity": "100",
        "roofInsulationType": "XLPE",
        "wallInsulationType": "XLPE",
        "turboVentilatorDiameter": "IN_6",
        "turboVentilatorNos": 10,
        "handrailWeightKg": "250",
        "deckSheetFlashingEnabled": true,
        "gantryGirderEnabled": true,
        "liftStructureEnabled": true,
        "framesPrimerCoats": 2,
        "framesPrimerType": "EPOXY_PRIMER",
        "framesPaintCoats": 2,
        "framesPaintType": "EPOXY_PAINT",
        "purlinsGirtsFinish": "PRE_GALVANISED",
        "purlinsGirtsGsm": 120,
        "purlinsGirtsPaint": "UNPAINTED",
        "foundationBoltFinish": "BLACK_UNPAINTED",
        "createdAt": "2026-07-23T13:23:56.001Z",
        "updatedAt": "2026-07-24T16:25:20.839Z",
        "doorHeight": "2.1",
        "doorWidth": "1",
        "doorNos": 10,
        "doorQuantity": "21",
        "windowHeight": "1.8",
        "windowWidth": "1",
        "windowNos": 10,
        "windowQuantity": "18",
        "foldedPlateLength": "7.5",
        "foldedPlateWidth": "1",
        "foldedPlateNos": 16,
        "foldedPlateQuantity": "120"
    },
    "joint": {
        "id": "cmrxjlltz000hmkv0vdlxrhjt",
        "jobId": "cmrximveu0001mkv08cwnlrkd",
        "secondaryBeamsBoltType": "HSFG",
        "secondaryBeamsBoltDiameter": "16",
        "secondaryBeamsNumberOfBolts": 6,
        "purlinFlangeBraceBoltType": "ORD",
        "purlinFlangeBraceBoltDiameter": "12",
        "purlinFlangeBraceNumberOfBolts": 14,
        "claddingPurlinsBoltType": "ORD",
        "claddingPurlinsBoltDiameter": "12",
        "claddingPurlinsNumberOfBolts": 10,
        "canopyBoltType": "ORD",
        "canopyBoltDiameter": "16",
        "canopyNumberOfBolts": 8,
        "createdAt": "2026-07-23T13:23:57.767Z",
        "updatedAt": "2026-07-24T16:25:24.560Z",
        "jointBoltRoof": [
            {
                "id": "cmrz5istc000b1cv00bstdznm",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "A",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000c1cv08vsw2j0x",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "B",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000d1cv0nuy586de",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "C",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000e1cv0ka3ak1i9",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "D",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000f1cv0aquft7qk",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "E",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000g1cv07fcv65cz",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "F",
                "boltDiameter": "16",
                "numberOfBolts": 4
            },
            {
                "id": "cmrz5istc000h1cv012bqgogl",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "G",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000i1cv05nu3o8n9",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "H",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000j1cv0ivw9dsbs",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "I",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000k1cv0vx6o7awb",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "J",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000l1cv0bfl6vnia",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "K",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000m1cv0vo9x9oin",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "L",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000n1cv0mht0uueb",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "A_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000o1cv0brzrpnfv",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "B_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000p1cv0qho7vy9g",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "B_2",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000q1cv0ddrlt8w7",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "C_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000r1cv09vsz5z83",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "D_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000s1cv08v9jrebe",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "G_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000t1cv0zt0151au",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "H_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000u1cv0ydo68o3z",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "I_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000v1cv0mzysprd9",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "K_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istc000w1cv0uap4b0ks",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "roofJointId": "L_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            }
        ],
        "jointBoltMezzanine": [
            {
                "id": "cmrz5istl000x1cv0ijdmaujz",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "mezzanineJointId": "M",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istl000y1cv0vaeufzlf",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "mezzanineJointId": "N",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istl000z1cv09hz5gg3b",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "mezzanineJointId": "O",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istl00101cv0zallbw2q",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "mezzanineJointId": "P",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istl00111cv0gk3mi1wf",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "mezzanineJointId": "Q",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istl00121cv0qrzmudlo",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "mezzanineJointId": "R",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istl00131cv0nv1kajd0",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "mezzanineJointId": "S",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istl00141cv0t4w2ma6h",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "mezzanineJointId": "SEC",
                "boltDiameter": "16",
                "numberOfBolts": 8
            }
        ],
        "foundationBoltRoof": [
            {
                "id": "cmrz5istn00151cv0ewebm88t",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "foundationJointId": "FB4",
                "boltDiameter": "20",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istn00161cv0gqjq7m89",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "foundationJointId": "FB5",
                "boltDiameter": "20",
                "numberOfBolts": 8
            },
            {
                "id": "cmrz5istn00171cv0mjjy406s",
                "jointId": "cmrxjlltz000hmkv0vdlxrhjt",
                "foundationJointId": "FB6",
                "boltDiameter": "20",
                "numberOfBolts": 8
            }
        ]
    },
    "spec": {
        "id": "cmrxjlmii000kmkv027mlaaa0",
        "jobId": "cmrximveu0001mkv08cwnlrkd",
        "createdAt": "2026-07-23T13:23:58.650Z",
        "updatedAt": "2026-07-23T13:23:58.650Z",
        "products": [
            {
                "id": "cmrz5iusz00181cv05l2ocirt",
                "specId": "cmrxjlmii000kmkv027mlaaa0",
                "code": "PRODUCT-1",
                "description": "Fabricated Columns and Beams",
                "specification": "Fabricated from Plates or Stocks by continuous welding process.\nConform to IS2062 Grade E345/ASTM A572-12 Grade 50\nshall be killed/Semi killed\nMin Thickness of plate 4mm",
                "makeOrBrand": "JSW / TATA",
                "yieldStrengthMpa": 345
            },
            {
                "id": "cmrz5iusz00191cv08az2uzhm",
                "specId": "cmrxjlmii000kmkv027mlaaa0",
                "code": "PRODUCT-2",
                "description": "Cold formed Purlins / Girt\t\t\t\t",
                "specification": "\"ASTM A 653 Grade 275\nCoating Z 120 or equivalent\"\t\t\t\t\t\t\t\t\n",
                "makeOrBrand": "JSW",
                "yieldStrengthMpa": 275
            },
            {
                "id": "cmrz5iusz001a1cv0w51kx0qo",
                "specId": "cmrxjlmii000kmkv027mlaaa0",
                "code": "PRODUCT-3",
                "description": "Roofing Sheet \t\t\t\t",
                "specification": "30mm Puff Sheet\t\t\t\t\t\t\n",
                "makeOrBrand": "JSW",
                "yieldStrengthMpa": 550
            },
            {
                "id": "cmrz5iusz001b1cv0j4uf3dj5",
                "specId": "cmrxjlmii000kmkv027mlaaa0",
                "code": "PRODUCT-4",
                "description": "Cladding Sheet\t\t\t\t",
                "specification": "\"Zincalume Steel \nRoof sheet 0.40mm TCT\nGrade 550\"\t\t\t\t\n",
                "makeOrBrand": "JSW",
                "yieldStrengthMpa": 550
            },
            {
                "id": "cmrz5iusz001c1cv0uz6gpn8z",
                "specId": "cmrxjlmii000kmkv027mlaaa0",
                "code": "PRODUCT-5",
                "description": "Decking Sheet\t\t\t\t",
                "specification": "\"Decking Profile 50/230 (Depth/Pitch)\nPanel thickenss 0.8mm \nYield Strength 250 Mpa\nZinc Coating- Z 120 GSM\"",
                "makeOrBrand": "JSW",
                "yieldStrengthMpa": 250
            },
            {
                "id": "cmrz5iusz001d1cv0z3ckalse",
                "specId": "cmrxjlmii000kmkv027mlaaa0",
                "code": "PRODUCT-6",
                "description": "\"Primary  Connection\"\t\t\t\t",
                "specification": "\"Primary bolts- high strength bolts conforming to the physical specifications of ASTM A325  (or equivalent)\nGrade 8.8\"\t",
                "makeOrBrand": "UNBRACO",
                "yieldStrengthMpa": 640
            },
            {
                "id": "cmrz5iusz001e1cv0cins10as",
                "specId": "cmrxjlmii000kmkv027mlaaa0",
                "code": "PRODUCT-7",
                "description": "Secondary Connection\t\t\t\t",
                "specification": "Secondary bolts - machine bolts conform to the physical Specifications of ASTM A307 (or equivalent).\nGrade 4.6 ",
                "makeOrBrand": "SS",
                "yieldStrengthMpa": 240
            }
        ]
    },
    "quantity": null,
    "amount": {
        "id": "cmrxjlpta000lmkv0pefrlhoj",
        "jobId": "cmrximveu0001mkv08cwnlrkd",
        "createdAt": "2026-07-23T13:24:02.926Z",
        "updatedAt": "2026-07-23T13:24:02.926Z",
        "items": [
            {
                "id": "cmrz5ixe3001f1cv01l8rtwk9",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "STEEL STRUCTURES",
                "unit": "KG",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001g1cv06r0lcxml",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "WIND BRACINGS",
                "unit": "RM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001h1cv0v3kgp2tq",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "SAG ROD",
                "unit": "RM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001i1cv0ip1hdhl8",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "FLANGE BRACE",
                "unit": "KG",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001j1cv0t634xfkj",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "Z/C PURLINS",
                "unit": "KG",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001k1cv0872lipz5",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "ROOF SHEET",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001l1cv02w1yhay2",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "CLADDING SHEET",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001m1cv0exjwryl4",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "CANOPY SHEET",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001n1cv070g3putl",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "PURLIN BOLTS",
                "unit": "NOS",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001o1cv05609i5km",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "JOINT BOLTS",
                "unit": "NOS",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001p1cv0yi5hdsw4",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "FOUNDATION BOLTS",
                "unit": "NOS",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001q1cv01sq9yquz",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "ANCHOR BOLTS",
                "unit": "NOS",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001r1cv0xdokdjzv",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "RIDGE",
                "unit": "RM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001s1cv0i6u94ca4",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "GUTTER",
                "unit": "RM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001t1cv0n7ckiaf5",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "DOWNTAKE",
                "unit": "RM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001u1cv0tnm5418b",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "DRIP TRIM",
                "unit": "RM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001v1cv0uh3w7bd7",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "FLASHING",
                "unit": "RM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001w1cv0js04vb2r",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "ROLLING SHUTTER",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001x1cv08p7i7yre",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "LOUVERS",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001y1cv0rtd0apfp",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "SKY LIGHT",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe3001z1cv051rtt4gb",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "WALL LIGHT",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe300201cv00qsfv6z2",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "ROOF INSULATION",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe300211cv0me0wwgoh",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "WALL INSULATION",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe300221cv0ytp25tp1",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "TURBO VENTILATORS",
                "unit": "NOS",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe300231cv0nooj4p9r",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "DECKING SHEET",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe400241cv0i5h88znn",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "SHEAR STUDS",
                "unit": "NOS",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe400251cv004lxhotl",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "POLY CARBONATE SHEET",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe400261cv0cwpj8sap",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "STAIR - HR SECTION",
                "unit": "KG",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe400271cv0bt4fuqq4",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "STAIR 6MM CHQ PLATE STEPS",
                "unit": "KG",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe400281cv0hh82agsb",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "HANDRAIL",
                "unit": "KG",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe400291cv08eh7uxky",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "CANOPY SIDE COVERING",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe4002a1cv04y0uzghr",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "DOORS",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe4002b1cv0jkcpi3de",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "WINDOWS",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe4002c1cv01nbxaxbe",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "FASCIA STRUCTURE",
                "unit": "KG",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe4002d1cv0x1mg8dzh",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "FASCIA COVERING SHEET/ BOARD",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            },
            {
                "id": "cmrz5ixe4002e1cv0ryqtc17w",
                "amountId": "cmrxjlpta000lmkv0pefrlhoj",
                "description": "INTERNAL PARTITIONS",
                "unit": "SQM",
                "quantity": null,
                "rateFabrication": null,
                "rateErection": null,
                "rateLoading": null,
                "amountFabrication": null,
                "amountErection": null,
                "amountLoading": null
            }
        ]
    }
}