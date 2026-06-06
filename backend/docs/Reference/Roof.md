# Roof

**PEB Roof**

```json
{  
"buildingOverallLength": 30,  
"buildingOverallWidth": 15,  
"eaveHeight": 5.645,  
"roofSlope": 6,  
"mainRoofFrames": 4,  
"endRoofFrames": 2,  
"roofPurlinSpacing": 1.27,  
"claddingPurlins": 2,  
"internalColumnsForMainRoofFrames": 2,  
"internalColumnsForEndRoofFrames": 2  
}
```

**Members**

```json
{  
"columnSegmentsInMainFrame": 1,  
"raftersInOneHalfOfMainFrame": 2,  
"columnSegmentsInEndFrame": 1,  
"raftersInOneHalfOfEndFrame": 2,  
"endFrameHorizontalTieBeam": 0  
}
```

**Purlins**

```json
{  
"roofPurlinType": "Z/C",  
"roofPurlinDepth": 150,  
"roofPurlinUnitWeight": 4.72,  
"claddingPurlinType": "Z/C",  
"claddingPurlinDepth": 150,  
"claddingPurlinUnitWeight": 4.72  
}
```

**Sidewall**

```json
{  
"frontSideWallType": "BRICK",  
"frontSideWallThickness": 200,  
"frontSideWallHeight": 2.4,  
  
"backSideWallType": "BRICK",  
"backSideWallThickness": 200,  
"backSideWallHeight": 2.4,  
  
"rightSideWallType": "BRICK",  
"rightSideWallThickness": 200,  
"rightSideWallHeight": 2.4,  
  
"leftSideWallType": "BRICK",  
"leftSideWallThickness": 200,  
"leftSideWallHeight": 2.4  
}
```

**Covering**

```json
{  
"roofCoveringType": "PPGL",  
"roofCoveringThickness": 30,  
  
"claddingCoveringType": "PPGL",  
"claddingCoveringThickness": 0.4,  
  
"roofAreaDeduction": 0  
}
```

**Flange Brace**

```json
{  
"roofFlangeBraceAverageLength": 1.5,  
"claddingFlangeBraceAverageLength": 1,  
"endFrameFlangeBraceAverageLength": 0.5  
}
```

**Polycarbonate in Roof**

```json
{  
"polycarbonateRoofLength": 0,  
"polycarbonateRoofWidth": 0,  
"polycarbonateRoofCount": 0  
}
```

**Wind Bracings**

```json
{
  "roofWindBracingSegmentsInOneHalf": 1,
  "columnWindBracingSegments": 1,
  "roofWindBracingProvidedBays": 2,
  "columnWindBracingProvidedBays": 2,
  "windBracingColumnHeight": 5.6,
  "windBracingUnitWeight": 2.46,
  "roofWindBracingBaySpacing": 6,
  "columnWindBracingBaySpacing": 6,
  "roofWindBracingLength": 9.63698024,
  "columnWindBracingLength": 8.207313811,
  "windBracingType": "ROD"
}
```

**Cladding Openings**

```json
{
  "frontCladdingOpeningArea": 45,
  "backCladdingOpeningArea": 0,
  "rightCladdingOpeningArea": 0,
  "leftCladdingOpeningArea": 0
}
```

**Fascia Board**

```json
{
  "fasciaBoardArea": 51.72,
  "fasciaMaterialWeightPerSqft": 1
}
```

**Side Extension**

```json
{
  "roofExtensionWidthHeight": 0,
  "roofExtensionMidFrameCount": 0,
  "roofExtensionEndFrameCount": 0,

  "claddingExtensionWidthHeight": 0,
  "claddingExtensionMidFrameCount": 0,
  "claddingExtensionEndFrameCount": 0,

  "sideColumnsWidthHeight": 0,
  "sideColumnsMidFrameCount": 0,
  "sideColumnsEndFrameCount": 0
}
```

**Base Fixing**

```json
{
  "roofFrameBaseFixing": "FOUNDATION_BOLT"
}
```
**Material Strength/Grade**
```json
{  
"plateMaterialGrade": "enum"
}
```
enum : "FE 345", "FE 250", "FE 400"


