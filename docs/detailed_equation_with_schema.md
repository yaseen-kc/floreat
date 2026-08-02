# FORMAT - AMOUNT - N5

**Line item:** STEEL STRUCTURES  
**Unit:** KG  
**Original Excel formula:** `=QUANTITY!T7+QUANTITY!T8+QUANTITY!T89+QUANTITY!T132+QUANTITY!T133+QUANTITY!T144+QUANTITY!T145+QUANTITY!T146+QUANTITY!T147`  
**Computed value:** `19909.196076`

---

## 1. `QUANTITY!T7`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Length | `ROOF!I5` | `30` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| Roof Unit Weight | `ROOF!J19` | `1.25` |

```
QUANTITY!T7 =
ROOF!I5 × (ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) × 2 × 10.76 × ROOF!J19

= 6198.818862
```

---

## 2. `QUANTITY!T8`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T8 | `QUANTITY!T8` | `456` |

```
QUANTITY!T8 =
QUANTITY!T8

= 456
```

---

## 3. `QUANTITY!T89`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Canopy Length | `CANOPY!G9` | `15` |
| Canopy Width | `CANOPY!J9` | `2` |
| Canopy Unit Weight | `CANOPY!S9` | `1.25` |

```
QUANTITY!T89 =
CANOPY!G9 × CANOPY!J9 × CANOPY!S9 × 10.76

= 403.5
```

---

## 4. `QUANTITY!T132`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Mezz Bay Length | `MEZZ!L7` | `15` |
| Mezz Bay Width | `MEZZ!O7` | `6` |
| STAIR!AS8 | `STAIR!AS8` | `3.6` |
| STAIR!AU8 | `STAIR!AU8` | `1` |
| Stair Run Count | `STAIR!S8` | `4` |
| Stair Width | `STAIR!V8` | `1.25` |
| Mezz2 Bay Length | `MEZZ!L23` | `15` |
| Mezz2 Bay Width | `MEZZ!O23` | `6` |
| Mezz Unit Weight | `MEZZ!X7` | `3.5` |

```
QUANTITY!T132 =
(MEZZ!L7 × MEZZ!O7 − STAIR!AS8 × STAIR!AU8 − STAIR!S8 × STAIR!V8 + MEZZ!L23 × MEZZ!O23) × MEZZ!X7 × 10.76

= 6454.924
```

---

## 5. `QUANTITY!T133`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T133 | `QUANTITY!T133` | `4756` |

```
QUANTITY!T133 =
QUANTITY!T133

= 4756
```

---

## 6. `QUANTITY!T144`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Stair Rise | `STAIR!Y8` | `2.75` |
| Stair Flights | `STAIR!AB8` | `1` |
| Stair Run Count | `STAIR!S8` | `4` |
| Stringer Weight | `STAIR!AH8` | `22.3` |

```
QUANTITY!T144 =
(SQRT(STAIR!Y8 / (STAIR!AB8 + 1) × STAIR!Y8 / (STAIR!AB8 + 1) + (STAIR!S8 − 2) × (STAIR!S8 − 2)) + 2 + STAIR!AB8) × (2 + STAIR!AB8 × 2) × STAIR!AH8

= 484.093839
```

---

## 7. `QUANTITY!T145`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T145 | `QUANTITY!T145` | `456` |

```
QUANTITY!T145 =
QUANTITY!T145

= 456
```

---

## 8. `QUANTITY!T146`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Stair Rise | `STAIR!Y8` | `2.75` |
| Stair Width | `STAIR!V8` | `1.25` |

```
QUANTITY!T146 =
STAIR!Y8 / 0.15 × STAIR!V8 / 2 × 0.006 × 0.45 × 7850

= 242.859375
```

---

## 9. `QUANTITY!T147`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T147 | `QUANTITY!T147` | `457` |

```
QUANTITY!T147 =
QUANTITY!T147

= 457
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Length | `ROOF!I5` | `30` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| Roof Unit Weight | `ROOF!J19` | `1.25` |
| QUANTITY!T8 | `QUANTITY!T8` | `456` |
| Canopy Length | `CANOPY!G9` | `15` |
| Canopy Width | `CANOPY!J9` | `2` |
| Canopy Unit Weight | `CANOPY!S9` | `1.25` |
| Mezz Bay Length | `MEZZ!L7` | `15` |
| Mezz Bay Width | `MEZZ!O7` | `6` |
| STAIR!AS8 | `STAIR!AS8` | `3.6` |
| STAIR!AU8 | `STAIR!AU8` | `1` |
| Stair Run Count | `STAIR!S8` | `4` |
| Stair Width | `STAIR!V8` | `1.25` |
| Mezz2 Bay Length | `MEZZ!L23` | `15` |
| Mezz2 Bay Width | `MEZZ!O23` | `6` |
| Mezz Unit Weight | `MEZZ!X7` | `3.5` |
| QUANTITY!T133 | `QUANTITY!T133` | `4756` |
| Stair Rise | `STAIR!Y8` | `2.75` |
| Stair Flights | `STAIR!AB8` | `1` |
| Stringer Weight | `STAIR!AH8` | `22.3` |
| QUANTITY!T145 | `QUANTITY!T145` | `456` |
| QUANTITY!T147 | `QUANTITY!T147` | `457` |

```
AMOUNT!N5 =
ROOF!I5 × (ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) × 2 × 10.76 × ROOF!J19 + QUANTITY!T8 + CANOPY!G9 × CANOPY!J9 × CANOPY!S9 × 10.76 + (MEZZ!L7 × MEZZ!O7 − STAIR!AS8 × STAIR!AU8 − STAIR!S8 × STAIR!V8 + MEZZ!L23 × MEZZ!O23) × MEZZ!X7 × 10.76 + QUANTITY!T133 + (SQRT(STAIR!Y8 / (STAIR!AB8 + 1) × STAIR!Y8 / (STAIR!AB8 + 1) + (STAIR!S8 − 2) × (STAIR!S8 − 2)) + 2 + STAIR!AB8) × (2 + STAIR!AB8 × 2) × STAIR!AH8 + QUANTITY!T145 + STAIR!Y8 / 0.15 × STAIR!V8 / 2 × 0.006 × 0.45 × 7850 + QUANTITY!T147

= 19909.19607646245
```

**Schema-field form:**

```
AMOUNT!N5 =
roof.buildingOverallLength × (roof.buildingOverallWidth / COS(roof.roofSlope × PI() / 180) / 2 + 0.14) × 2 × 10.76 × roof.materialConsumptionExcludingPurlin + QUANTITY!T8 + canopy.canopies[0].length × canopy.canopies[0].width × canopy.canopies[0].materialConsumptionKgPerSqft × 10.76 + (mezzanine.floors[0].lengthM × mezzanine.floors[0].widthM − stair.areaDeductions[0].areaM2 × stair.areaDeductions[0].numbers − stair.stairs[0].length × stair.stairs[0].width + mezzanine.floors[1].lengthM × mezzanine.floors[1].widthM) × mezzanine.floors[0].materialConsumptionKgPerSqft × 10.76 + QUANTITY!T133 + (SQRT(stair.stairs[0].height / (stair.stairs[0].numberOfMidLanding + 1) × stair.stairs[0].height / (stair.stairs[0].numberOfMidLanding + 1) + (stair.stairs[0].length − 2) × (stair.stairs[0].length − 2)) + 2 + stair.stairs[0].numberOfMidLanding) × (2 + stair.stairs[0].numberOfMidLanding × 2) × stair.stairs[0].unitWeightOfStringer + QUANTITY!T145 + stair.stairs[0].height / 0.15 × stair.stairs[0].width / 2 × 0.006 × 0.45 × 7850 + QUANTITY!T147

= 19909.19607646245
```


# FORMAT - AMOUNT - N6

**Line item:** WIND BRACINGS  
**Unit:** RM  
**Original Excel formula:** `=(QUANTITY!T31+QUANTITY!T30+QUANTITY!P84+QUANTITY!T84)/ROOF!AA22`  
**Computed value:** `2368.770613`

---

## 1. `QUANTITY!T31`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T31 | `QUANTITY!T31` | `5432` |

```
QUANTITY!T31 =
QUANTITY!T31

= 5432
```

---

## 2. `QUANTITY!T30`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AA17 | `ROOF!AA17` | `1` |
| Building Length | `ROOF!I5` | `30` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| ROOF!AA19 | `ROOF!AA19` | `2` |
| ROOF!AA22 | `ROOF!AA22` | `2.46` |

```
QUANTITY!T30 =
SQRT((ROOF!I6 / 2 / COS(ROOF!J8 × PI() / 180) / ROOF!AA17)^2 + ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1) × ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1)) × ROOF!AA17 × 2 × 2 × ROOF!AA19 × ROOF!AA22

= 189.655771
```

---

## 3. `QUANTITY!P84`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!P84 | `QUANTITY!P84` | `44` |

```
QUANTITY!P84 =
QUANTITY!P84

= 44
```

---

## 4. `QUANTITY!T84`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| ROOF!AA18 | `ROOF!AA18` | `1` |
| ROOF!AA20 | `ROOF!AA20` | `2` |
| ROOF!AA21 | `ROOF!AA21` | `5.6` |
| Building Length | `ROOF!I5` | `30` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| ROOF!AA22 | `ROOF!AA22` | `2.46` |

```
QUANTITY!T84 =
ROOF!AA18 × 2 × 2 × ROOF!AA20 × SQRT((ROOF!AA21 / ROOF!AA18)^2 + ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1) × ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1)) × ROOF!AA22

= 161.519936
```

---

## 5. `ROOF!AA22`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| ROOF!AA22 | `ROOF!AA22` | `2.46` |

```
ROOF!AA22 =
ROOF!AA22

= 2.46
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T31 | `QUANTITY!T31` | `5432` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AA17 | `ROOF!AA17` | `1` |
| Building Length | `ROOF!I5` | `30` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| ROOF!AA19 | `ROOF!AA19` | `2` |
| ROOF!AA22 | `ROOF!AA22` | `2.46` |
| QUANTITY!P84 | `QUANTITY!P84` | `44` |
| ROOF!AA18 | `ROOF!AA18` | `1` |
| ROOF!AA20 | `ROOF!AA20` | `2` |
| ROOF!AA21 | `ROOF!AA21` | `5.6` |

```
AMOUNT!N6 =
(QUANTITY!T31 + SQRT((ROOF!I6 / 2 / COS(ROOF!J8 × PI() / 180) / ROOF!AA17)^2 + ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1) × ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1)) × ROOF!AA17 × 2 × 2 × ROOF!AA19 × ROOF!AA22 + QUANTITY!P84 + ROOF!AA18 × 2 × 2 × ROOF!AA20 × SQRT((ROOF!AA21 / ROOF!AA18)^2 + ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1) × ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1)) × ROOF!AA22) / ROOF!AA22

= 2368.770612571931
```

**Schema-field form:**

```
AMOUNT!N6 =
(QUANTITY!T31 + SQRT((roof.buildingOverallWidth / 2 / COS(roof.roofSlope × PI() / 180) / roof.roofWindBracingSegmentsInOneHalf)^2 + roof.buildingOverallLength / (roof.mainRoofFrames + roof.endRoofFrames − 1) × roof.buildingOverallLength / (roof.mainRoofFrames + roof.endRoofFrames − 1)) × roof.roofWindBracingSegmentsInOneHalf × 2 × 2 × roof.roofWindBracingProvidedBays × roof.windBracingUnitWeight + QUANTITY!P84 + roof.columnWindBracingSegments × 2 × 2 × roof.columnWindBracingProvidedBays × SQRT((roof.windBracingColumnHeight / roof.columnWindBracingSegments)^2 + roof.buildingOverallLength / (roof.mainRoofFrames + roof.endRoofFrames − 1) × roof.buildingOverallLength / (roof.mainRoofFrames + roof.endRoofFrames − 1)) × roof.windBracingUnitWeight) / roof.windBracingUnitWeight

= 2368.770612571931
```


# FORMAT - AMOUNT - N7

**Line item:** SAG ROD  
**Unit:** RM  
**Original Excel formula:** `=(QUANTITY!T34+QUANTITY!T35+QUANTITY!P85+QUANTITY!T85)/QUANTITY!L40`  
**Computed value:** `8499.712024`

---

## 1. `QUANTITY!T34`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| Roof Purlin Spacing | `ROOF!J11` | `1.27` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| ROOF!AU19 | `ROOF!AU19` | `45` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| Roof Sag Rod Dia | `ROOF!J22` | `12` |

```
QUANTITY!T34 =
((ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) / ROOF!J11 × 2 × (ROOF!J9 + ROOF!J10 − 1) + (ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) / ROOF!J11 − 1) × (ROOF!AU19 + ROOF!AR19 − 1)) × ROOF!J22 × ROOF!J22 / 162

= 726.27539
```

---

## 2. `QUANTITY!T35`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T35 | `QUANTITY!T35` | `6756` |

```
QUANTITY!T35 =
QUANTITY!T35

= 6756
```

---

## 3. `QUANTITY!P85`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!P85 | `QUANTITY!P85` | `54` |

```
QUANTITY!P85 =
QUANTITY!P85

= 54
```

---

## 4. `QUANTITY!T85`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Eave Height | `ROOF!J7` | `5.645` |
| ROOF!AI6 | `ROOF!AI6` | `2.4` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AI9 | `ROOF!AI9` | `2.4` |
| ROOF!AQ20 | `ROOF!AQ20` | `12` |
| ROOF!AI7 | `ROOF!AI7` | `2.4` |
| Building Length | `ROOF!I5` | `30` |
| ROOF!AI8 | `ROOF!AI8` | `2.4` |
| ROOF!AH18 | `ROOF!AH18` | `45` |
| ROOF!AH19 | `ROOF!AH19` | `42` |
| ROOF!AH20 | `ROOF!AH20` | `78` |
| ROOF!AH21 | `ROOF!AH21` | `45` |
| ROOF!AK24 | `ROOF!AK24` | `51.72` |
| Cladding Purlins | `ROOF!J12` | `2` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| Int Cols End Frame | `ROOF!J16` | `2` |
| Cladding Sag Rod Dia | `ROOF!J23` | `12` |

```
QUANTITY!T85 =
((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5 − ROOF!AH18 − ROOF!AH19 − ROOF!AH20 − ROOF!AH21 − ROOF!AK24) × 10.76 × (ROOF!J12 × (ROOF!J9 + ROOF!J10 − 1) × 2 + (ROOF!J12 + 1) × (ROOF!J16 + 1) × 2 + (ROOF!J12 + 1) × 1 × 2) × 1.7 × ROOF!J23 × ROOF!J23 / 162 / (((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5) × 10.76)

= 19.024187
```

---

## 5. `QUANTITY!L40`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Roof Sag Rod Dia | `ROOF!J22` | `12` |

```
QUANTITY!L40 =
ROOF!J22 × ROOF!J22 / 162

= 0.888889
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| Roof Purlin Spacing | `ROOF!J11` | `1.27` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| ROOF!AU19 | `ROOF!AU19` | `45` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| Roof Sag Rod Dia | `ROOF!J22` | `12` |
| QUANTITY!T35 | `QUANTITY!T35` | `6756` |
| QUANTITY!P85 | `QUANTITY!P85` | `54` |
| Eave Height | `ROOF!J7` | `5.645` |
| ROOF!AI6 | `ROOF!AI6` | `2.4` |
| ROOF!AI9 | `ROOF!AI9` | `2.4` |
| ROOF!AQ20 | `ROOF!AQ20` | `12` |
| ROOF!AI7 | `ROOF!AI7` | `2.4` |
| Building Length | `ROOF!I5` | `30` |
| ROOF!AI8 | `ROOF!AI8` | `2.4` |
| ROOF!AH18 | `ROOF!AH18` | `45` |
| ROOF!AH19 | `ROOF!AH19` | `42` |
| ROOF!AH20 | `ROOF!AH20` | `78` |
| ROOF!AH21 | `ROOF!AH21` | `45` |
| ROOF!AK24 | `ROOF!AK24` | `51.72` |
| Cladding Purlins | `ROOF!J12` | `2` |
| Int Cols End Frame | `ROOF!J16` | `2` |
| Cladding Sag Rod Dia | `ROOF!J23` | `12` |

```
AMOUNT!N7 =
(((ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) / ROOF!J11 × 2 × (ROOF!J9 + ROOF!J10 − 1) + (ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) / ROOF!J11 − 1) × (ROOF!AU19 + ROOF!AR19 − 1)) × ROOF!J22 × ROOF!J22 / 162 + QUANTITY!T35 + QUANTITY!P85 + ((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5 − ROOF!AH18 − ROOF!AH19 − ROOF!AH20 − ROOF!AH21 − ROOF!AK24) × 10.76 × (ROOF!J12 × (ROOF!J9 + ROOF!J10 − 1) × 2 + (ROOF!J12 + 1) × (ROOF!J16 + 1) × 2 + (ROOF!J12 + 1) × 1 × 2) × 1.7 × ROOF!J23 × ROOF!J23 / 162 / (((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5) × 10.76)) / (ROOF!J22 × ROOF!J22 / 162)

= 8499.712023641116
```

**Schema-field form:**

```
AMOUNT!N7 =
(((roof.buildingOverallWidth / COS(roof.roofSlope × PI() / 180) / 2 + 0.14) / roof.roofPurlinSpacing × 2 × (roof.mainRoofFrames + roof.endRoofFrames − 1) + (roof.roofExtensionWidthHeight / COS(roof.roofSlope × PI() / 180) / roof.roofPurlinSpacing − 1) × (roof.roofExtensionEndFrameCount + roof.roofExtensionMidFrameCount − 1)) × roof.diaOfRoofSagRod × roof.diaOfRoofSagRod / 162 + QUANTITY!T35 + QUANTITY!P85 + ((roof.eaveHeight − roof.sidewalls[FRONT].height + roof.buildingOverallWidth / 2 × TAN(roof.roofSlope × PI() / 180) + roof.eaveHeight − roof.sidewalls[FRONT].height) / 2 × roof.buildingOverallWidth + (roof.eaveHeight − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height) / 2 × roof.claddingExtensionWidthHeight + (roof.eaveHeight − roof.sidewalls[BACK].height + roof.buildingOverallWidth / 2 × TAN(roof.roofSlope × PI() / 180) + roof.eaveHeight − roof.sidewalls[BACK].height) / 2 × roof.buildingOverallWidth + (roof.eaveHeight − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height) / 2 × roof.claddingExtensionWidthHeight + (roof.eaveHeight − roof.sidewalls[LEFT].height) × roof.buildingOverallLength + (roof.eaveHeight − roof.sidewalls[RIGHT].height) × roof.buildingOverallLength − roof.frontCladdingOpeningArea − roof.backCladdingOpeningArea − roof.rightCladdingOpeningArea − roof.leftCladdingOpeningArea − roof.fasciaBoardArea) × 10.76 × (roof.claddingPurlins × (roof.mainRoofFrames + roof.endRoofFrames − 1) × 2 + (roof.claddingPurlins + 1) × (roof.internalColumnsForEndRoofFrames + 1) × 2 + (roof.claddingPurlins + 1) × 1 × 2) × 1.7 × roof.diaOfCladdingSagRod × roof.diaOfCladdingSagRod / 162 / (((roof.eaveHeight − roof.sidewalls[FRONT].height + roof.buildingOverallWidth / 2 × TAN(roof.roofSlope × PI() / 180) + roof.eaveHeight − roof.sidewalls[FRONT].height) / 2 × roof.buildingOverallWidth + (roof.eaveHeight − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height) / 2 × roof.claddingExtensionWidthHeight + (roof.eaveHeight − roof.sidewalls[BACK].height + roof.buildingOverallWidth / 2 × TAN(roof.roofSlope × PI() / 180) + roof.eaveHeight − roof.sidewalls[BACK].height) / 2 × roof.buildingOverallWidth + (roof.eaveHeight − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height) / 2 × roof.claddingExtensionWidthHeight + (roof.eaveHeight − roof.sidewalls[LEFT].height) × roof.buildingOverallLength + (roof.eaveHeight − roof.sidewalls[RIGHT].height) × roof.buildingOverallLength) × 10.76)) / (roof.diaOfRoofSagRod × roof.diaOfRoofSagRod / 162)

= 8499.712023641116
```


# FORMAT - AMOUNT - N8

**Line item:** FLANGE BRACE  
**Unit:** KG  
**Original Excel formula:** `=QUANTITY!T41+QUANTITY!T42+QUANTITY!P86+QUANTITY!T86`  
**Computed value:** `4303.553384`

---

## 1. `QUANTITY!T41`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| ROOF!AN12 | `ROOF!AN12` | `1.5` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| Roof Purlin Spacing | `ROOF!J11` | `1.27` |
| Main Roof Frames | `ROOF!J9` | `4` |
| ROOF!AN14 | `ROOF!AN14` | `0.5` |
| End Roof Frames | `ROOF!J10` | `2` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| ROOF!AU19 | `ROOF!AU19` | `45` |

```
QUANTITY!T41 =
(ROOF!AN12 × ((ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) / ROOF!J11 + 1) × 4 × ROOF!J9 + ROOF!AN14 × ((ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) / ROOF!J11 + 1) × 2 × ROOF!J10 + ROOF!AN12 × ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) / ROOF!J11 × 2 × ROOF!AR19 + ROOF!AN12 × ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) / ROOF!J11 × ROOF!AU19) × 1.57

= 3308.273384
```

---

## 2. `QUANTITY!T42`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T42 | `QUANTITY!T42` | `767` |

```
QUANTITY!T42 =
QUANTITY!T42

= 767
```

---

## 3. `QUANTITY!P86`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!P86 | `QUANTITY!P86` | `65` |

```
QUANTITY!P86 =
QUANTITY!P86

= 65
```

---

## 4. `QUANTITY!T86`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| Cladding Purlins | `ROOF!J12` | `2` |
| Int Cols End Frame | `ROOF!J16` | `2` |
| ROOF!AN13 | `ROOF!AN13` | `1` |

```
QUANTITY!T86 =
((ROOF!J9 + ROOF!J10) × ROOF!J12 × 2 + (ROOF!J16 + 2) × (ROOF!J12 + 1) × 2 + ROOF!J12 × 1 × 2) × ROOF!AN13 × 1.57 × 2

= 163.28
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| ROOF!AN12 | `ROOF!AN12` | `1.5` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| Roof Purlin Spacing | `ROOF!J11` | `1.27` |
| Main Roof Frames | `ROOF!J9` | `4` |
| ROOF!AN14 | `ROOF!AN14` | `0.5` |
| End Roof Frames | `ROOF!J10` | `2` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| ROOF!AU19 | `ROOF!AU19` | `45` |
| QUANTITY!T42 | `QUANTITY!T42` | `767` |
| QUANTITY!P86 | `QUANTITY!P86` | `65` |
| Cladding Purlins | `ROOF!J12` | `2` |
| Int Cols End Frame | `ROOF!J16` | `2` |
| ROOF!AN13 | `ROOF!AN13` | `1` |

```
AMOUNT!N8 =
(ROOF!AN12 × ((ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) / ROOF!J11 + 1) × 4 × ROOF!J9 + ROOF!AN14 × ((ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) / ROOF!J11 + 1) × 2 × ROOF!J10 + ROOF!AN12 × ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) / ROOF!J11 × 2 × ROOF!AR19 + ROOF!AN12 × ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) / ROOF!J11 × ROOF!AU19) × 1.57 + QUANTITY!T42 + QUANTITY!P86 + ((ROOF!J9 + ROOF!J10) × ROOF!J12 × 2 + (ROOF!J16 + 2) × (ROOF!J12 + 1) × 2 + ROOF!J12 × 1 × 2) × ROOF!AN13 × 1.57 × 2

= 4303.553383583577
```

**Schema-field form:**

```
AMOUNT!N8 =
(roof.roofFlangeBraceAverageLength × ((roof.buildingOverallWidth / COS(roof.roofSlope × PI() / 180) / 2 + 0.14) / roof.roofPurlinSpacing + 1) × 4 × roof.mainRoofFrames + roof.endFrameFlangeBraceAverageLength × ((roof.buildingOverallWidth / COS(roof.roofSlope × PI() / 180) / 2 + 0.14) / roof.roofPurlinSpacing + 1) × 2 × roof.endRoofFrames + roof.roofFlangeBraceAverageLength × roof.roofExtensionWidthHeight / COS(roof.roofSlope × PI() / 180) / roof.roofPurlinSpacing × 2 × roof.roofExtensionMidFrameCount + roof.roofFlangeBraceAverageLength × roof.roofExtensionWidthHeight / COS(roof.roofSlope × PI() / 180) / roof.roofPurlinSpacing × roof.roofExtensionEndFrameCount) × 1.57 + QUANTITY!T42 + QUANTITY!P86 + ((roof.mainRoofFrames + roof.endRoofFrames) × roof.claddingPurlins × 2 + (roof.internalColumnsForEndRoofFrames + 2) × (roof.claddingPurlins + 1) × 2 + roof.claddingPurlins × 1 × 2) × roof.claddingFlangeBraceAverageLength × 1.57 × 2

= 4303.553383583577
```


# FORMAT - AMOUNT - N9

**Line item:** Z/C PURLINS  
**Unit:** KG  
**Original Excel formula:** `=QUANTITY!T12+QUANTITY!T13+QUANTITY!T65+QUANTITY!T66`  
**Computed value:** `32240.483932`

---

## 1. `QUANTITY!T12`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Length | `ROOF!I5` | `30` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| Roof Purlin Spacing | `ROOF!J11` | `1.27` |
| Roof Purlin Unit Wt | `ROOF!W13` | `4.72` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| ROOF!AU19 | `ROOF!AU19` | `45` |
| ROOF!AR19 | `ROOF!AR19` | `45` |

```
QUANTITY!T12 =
(ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1) + 0.4) × ((ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) / ROOF!J11 + 1) × 2 × (ROOF!J9 + ROOF!J10 − 1) × ROOF!W13 + (ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1) + 0.4) × ROOF!W13 × ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) / ROOF!J11 × (ROOF!AU19 + ROOF!AR19 − 1)

= 27672.334856
```

---

## 2. `QUANTITY!T13`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T13 | `QUANTITY!T13` | `565` |

```
QUANTITY!T13 =
QUANTITY!T13

= 565
```

---

## 3. `QUANTITY!T65`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Eave Height | `ROOF!J7` | `5.645` |
| ROOF!AI6 | `ROOF!AI6` | `2.4` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AI9 | `ROOF!AI9` | `2.4` |
| ROOF!AQ20 | `ROOF!AQ20` | `12` |
| ROOF!AI7 | `ROOF!AI7` | `2.4` |
| Building Length | `ROOF!I5` | `30` |
| ROOF!AI8 | `ROOF!AI8` | `2.4` |
| ROOF!AH18 | `ROOF!AH18` | `45` |
| ROOF!AH19 | `ROOF!AH19` | `42` |
| ROOF!AH20 | `ROOF!AH20` | `78` |
| ROOF!AH21 | `ROOF!AH21` | `45` |
| ROOF!AK24 | `ROOF!AK24` | `51.72` |
| Cladding Purlins | `ROOF!J12` | `2` |
| Cladding Purlin Unit Wt | `ROOF!W14` | `4.72` |

```
QUANTITY!T65 =
((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5 − ROOF!AH18 − ROOF!AH19 − ROOF!AH20 − ROOF!AH21 − ROOF!AK24) × 10.76 × (ROOF!I5 × ROOF!J12 × 2 + ROOF!J12 × ROOF!I6 × 2 + ROOF!AQ20 × ROOF!J12 × 2 + 2 × ROOF!I6 × 0.45) × ROOF!W14 / (((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5) × 10.76)

= 326.149077
```

---

## 4. `QUANTITY!T66`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T66 | `QUANTITY!T66` | `3677` |

```
QUANTITY!T66 =
QUANTITY!T66

= 3677
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Length | `ROOF!I5` | `30` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| Roof Purlin Spacing | `ROOF!J11` | `1.27` |
| Roof Purlin Unit Wt | `ROOF!W13` | `4.72` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| ROOF!AU19 | `ROOF!AU19` | `45` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| QUANTITY!T13 | `QUANTITY!T13` | `565` |
| Eave Height | `ROOF!J7` | `5.645` |
| ROOF!AI6 | `ROOF!AI6` | `2.4` |
| ROOF!AI9 | `ROOF!AI9` | `2.4` |
| ROOF!AQ20 | `ROOF!AQ20` | `12` |
| ROOF!AI7 | `ROOF!AI7` | `2.4` |
| ROOF!AI8 | `ROOF!AI8` | `2.4` |
| ROOF!AH18 | `ROOF!AH18` | `45` |
| ROOF!AH19 | `ROOF!AH19` | `42` |
| ROOF!AH20 | `ROOF!AH20` | `78` |
| ROOF!AH21 | `ROOF!AH21` | `45` |
| ROOF!AK24 | `ROOF!AK24` | `51.72` |
| Cladding Purlins | `ROOF!J12` | `2` |
| Cladding Purlin Unit Wt | `ROOF!W14` | `4.72` |
| QUANTITY!T66 | `QUANTITY!T66` | `3677` |

```
AMOUNT!N9 =
(ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1) + 0.4) × ((ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) / ROOF!J11 + 1) × 2 × (ROOF!J9 + ROOF!J10 − 1) × ROOF!W13 + (ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1) + 0.4) × ROOF!W13 × ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) / ROOF!J11 × (ROOF!AU19 + ROOF!AR19 − 1) + QUANTITY!T13 + ((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5 − ROOF!AH18 − ROOF!AH19 − ROOF!AH20 − ROOF!AH21 − ROOF!AK24) × 10.76 × (ROOF!I5 × ROOF!J12 × 2 + ROOF!J12 × ROOF!I6 × 2 + ROOF!AQ20 × ROOF!J12 × 2 + 2 × ROOF!I6 × 0.45) × ROOF!W14 / (((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5) × 10.76) + QUANTITY!T66

= 32240.483932369363
```

**Schema-field form:**

```
AMOUNT!N9 =
(roof.buildingOverallLength / (roof.mainRoofFrames + roof.endRoofFrames − 1) + 0.4) × ((roof.buildingOverallWidth / COS(roof.roofSlope × PI() / 180) / 2 + 0.14) / roof.roofPurlinSpacing + 1) × 2 × (roof.mainRoofFrames + roof.endRoofFrames − 1) × roof.roofPurlinUnitWeight + (roof.buildingOverallLength / (roof.mainRoofFrames + roof.endRoofFrames − 1) + 0.4) × roof.roofPurlinUnitWeight × roof.roofExtensionWidthHeight / COS(roof.roofSlope × PI() / 180) / roof.roofPurlinSpacing × (roof.roofExtensionEndFrameCount + roof.roofExtensionMidFrameCount − 1) + QUANTITY!T13 + ((roof.eaveHeight − roof.sidewalls[FRONT].height + roof.buildingOverallWidth / 2 × TAN(roof.roofSlope × PI() / 180) + roof.eaveHeight − roof.sidewalls[FRONT].height) / 2 × roof.buildingOverallWidth + (roof.eaveHeight − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height) / 2 × roof.claddingExtensionWidthHeight + (roof.eaveHeight − roof.sidewalls[BACK].height + roof.buildingOverallWidth / 2 × TAN(roof.roofSlope × PI() / 180) + roof.eaveHeight − roof.sidewalls[BACK].height) / 2 × roof.buildingOverallWidth + (roof.eaveHeight − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height) / 2 × roof.claddingExtensionWidthHeight + (roof.eaveHeight − roof.sidewalls[LEFT].height) × roof.buildingOverallLength + (roof.eaveHeight − roof.sidewalls[RIGHT].height) × roof.buildingOverallLength − roof.frontCladdingOpeningArea − roof.backCladdingOpeningArea − roof.rightCladdingOpeningArea − roof.leftCladdingOpeningArea − roof.fasciaBoardArea) × 10.76 × (roof.buildingOverallLength × roof.claddingPurlins × 2 + roof.claddingPurlins × roof.buildingOverallWidth × 2 + roof.claddingExtensionWidthHeight × roof.claddingPurlins × 2 + 2 × roof.buildingOverallWidth × 0.45) × roof.claddingPurlinUnitWeight / (((roof.eaveHeight − roof.sidewalls[FRONT].height + roof.buildingOverallWidth / 2 × TAN(roof.roofSlope × PI() / 180) + roof.eaveHeight − roof.sidewalls[FRONT].height) / 2 × roof.buildingOverallWidth + (roof.eaveHeight − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height) / 2 × roof.claddingExtensionWidthHeight + (roof.eaveHeight − roof.sidewalls[BACK].height + roof.buildingOverallWidth / 2 × TAN(roof.roofSlope × PI() / 180) + roof.eaveHeight − roof.sidewalls[BACK].height) / 2 × roof.buildingOverallWidth + (roof.eaveHeight − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height) / 2 × roof.claddingExtensionWidthHeight + (roof.eaveHeight − roof.sidewalls[LEFT].height) × roof.buildingOverallLength + (roof.eaveHeight − roof.sidewalls[RIGHT].height) × roof.buildingOverallLength) × 10.76) + QUANTITY!T66

= 32240.483932369363
```


# FORMAT - AMOUNT - N10

**Line item:** ROOF SHEET  
**Unit:** SQM  
**Original Excel formula:** `=QUANTITY!T20+QUANTITY!T21`  
**Computed value:** `7675.493359`

---

## 1. `QUANTITY!T20`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Length | `ROOF!I5` | `30` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| ROOF!AU19 | `ROOF!AU19` | `45` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| ROOF!AS9 | `ROOF!AS9` | `5` |
| ROOF!AX12 | `ROOF!AX12` | `6` |
| ROOF!AX13 | `ROOF!AX13` | `7` |
| ROOF!AX14 | `ROOF!AX14` | `8` |

```
QUANTITY!T20 =
(ROOF!I5 × (ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) × 2 + ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) × ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1) × (ROOF!AU19 + ROOF!AR19 − 1) − ROOF!AS9 − ROOF!AX12 × ROOF!AX13 × ROOF!AX14) × 1.1

= 7219.493359
```

---

## 2. `QUANTITY!T21`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T21 | `QUANTITY!T21` | `456` |

```
QUANTITY!T21 =
QUANTITY!T21

= 456
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Length | `ROOF!I5` | `30` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| ROOF!AU19 | `ROOF!AU19` | `45` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| ROOF!AS9 | `ROOF!AS9` | `5` |
| ROOF!AX12 | `ROOF!AX12` | `6` |
| ROOF!AX13 | `ROOF!AX13` | `7` |
| ROOF!AX14 | `ROOF!AX14` | `8` |
| QUANTITY!T21 | `QUANTITY!T21` | `456` |

```
AMOUNT!N10 =
(ROOF!I5 × (ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) × 2 + ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) × ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1) × (ROOF!AU19 + ROOF!AR19 − 1) − ROOF!AS9 − ROOF!AX12 × ROOF!AX13 × ROOF!AX14) × 1.1 + QUANTITY!T21

= 7675.493359371257
```

**Schema-field form:**

```
AMOUNT!N10 =
(roof.buildingOverallLength × (roof.buildingOverallWidth / COS(roof.roofSlope × PI() / 180) / 2 + 0.14) × 2 + roof.roofExtensionWidthHeight / COS(roof.roofSlope × PI() / 180) × roof.buildingOverallLength / (roof.mainRoofFrames + roof.endRoofFrames − 1) × (roof.roofExtensionEndFrameCount + roof.roofExtensionMidFrameCount − 1) − roof.roofAreaDeduction − roof.polycarbonateRoofLength × roof.polycarbonateRoofWidth × roof.polycarbonateRoofCount) × 1.1 + QUANTITY!T21

= 7675.493359371257
```


# FORMAT - AMOUNT - N11

**Line item:** CLADDING SHEET  
**Unit:** SQM  
**Original Excel formula:** `=QUANTITY!T83+QUANTITY!P82`  
**Computed value:** `168.389138`

---

## 1. `QUANTITY!T83`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Eave Height | `ROOF!J7` | `5.645` |
| ROOF!AI6 | `ROOF!AI6` | `2.4` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AI9 | `ROOF!AI9` | `2.4` |
| ROOF!AQ20 | `ROOF!AQ20` | `12` |
| ROOF!AI7 | `ROOF!AI7` | `2.4` |
| Building Length | `ROOF!I5` | `30` |
| ROOF!AI8 | `ROOF!AI8` | `2.4` |
| ROOF!AH18 | `ROOF!AH18` | `45` |
| ROOF!AH19 | `ROOF!AH19` | `42` |
| ROOF!AH20 | `ROOF!AH20` | `78` |
| ROOF!AH21 | `ROOF!AH21` | `45` |
| ROOF!AK24 | `ROOF!AK24` | `51.72` |

```
QUANTITY!T83 =
((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5 − ROOF!AH18 − ROOF!AH19 − ROOF!AH20 − ROOF!AH21 − ROOF!AK24) × 1.1

= 115.389138
```

---

## 2. `QUANTITY!P82`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!P82 | `QUANTITY!P82` | `53` |

```
QUANTITY!P82 =
QUANTITY!P82

= 53
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Eave Height | `ROOF!J7` | `5.645` |
| ROOF!AI6 | `ROOF!AI6` | `2.4` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AI9 | `ROOF!AI9` | `2.4` |
| ROOF!AQ20 | `ROOF!AQ20` | `12` |
| ROOF!AI7 | `ROOF!AI7` | `2.4` |
| Building Length | `ROOF!I5` | `30` |
| ROOF!AI8 | `ROOF!AI8` | `2.4` |
| ROOF!AH18 | `ROOF!AH18` | `45` |
| ROOF!AH19 | `ROOF!AH19` | `42` |
| ROOF!AH20 | `ROOF!AH20` | `78` |
| ROOF!AH21 | `ROOF!AH21` | `45` |
| ROOF!AK24 | `ROOF!AK24` | `51.72` |
| QUANTITY!P82 | `QUANTITY!P82` | `53` |

```
AMOUNT!N11 =
((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5 − ROOF!AH18 − ROOF!AH19 − ROOF!AH20 − ROOF!AH21 − ROOF!AK24) × 1.1 + QUANTITY!P82

= 168.38913824804428
```

**Schema-field form:**

```
AMOUNT!N11 =
((roof.eaveHeight − roof.sidewalls[FRONT].height + roof.buildingOverallWidth / 2 × TAN(roof.roofSlope × PI() / 180) + roof.eaveHeight − roof.sidewalls[FRONT].height) / 2 × roof.buildingOverallWidth + (roof.eaveHeight − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height) / 2 × roof.claddingExtensionWidthHeight + (roof.eaveHeight − roof.sidewalls[BACK].height + roof.buildingOverallWidth / 2 × TAN(roof.roofSlope × PI() / 180) + roof.eaveHeight − roof.sidewalls[BACK].height) / 2 × roof.buildingOverallWidth + (roof.eaveHeight − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height) / 2 × roof.claddingExtensionWidthHeight + (roof.eaveHeight − roof.sidewalls[LEFT].height) × roof.buildingOverallLength + (roof.eaveHeight − roof.sidewalls[RIGHT].height) × roof.buildingOverallLength − roof.frontCladdingOpeningArea − roof.backCladdingOpeningArea − roof.rightCladdingOpeningArea − roof.leftCladdingOpeningArea − roof.fasciaBoardArea) × 1.1 + QUANTITY!P82

= 168.38913824804428
```

# FORMAT - AMOUNT - N13

**Line item:** PURLIN BOLTS  
**Unit:** NOS  
**Original Excel formula:** `=QUANTITY!T55+QUANTITY!T87+QUANTITY!P87+QUANTITY!T98+QUANTITY!T153`  
**Computed value:** `13571.201275`

---

## 1. `QUANTITY!T55`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| Roof Purlin Spacing | `ROOF!J11` | `1.27` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| JOINTS!AV21 | `JOINTS!AV21` | `14` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| ROOF!AU19 | `ROOF!AU19` | `45` |

```
QUANTITY!T55 =
((ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) / ROOF!J11 + 1) × 2 × (ROOF!J9 + ROOF!J10) × JOINTS!AV21 + ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) / ROOF!J11 × (ROOF!AR19 + ROOF!AU19) × JOINTS!AV21

= 13155.201275
```

---

## 2. `QUANTITY!T87`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| Cladding Purlins | `ROOF!J12` | `2` |
| Int Cols End Frame | `ROOF!J16` | `2` |

```
QUANTITY!T87 =
((ROOF!J9 + ROOF!J10) × ROOF!J12 × 2 + (ROOF!J16 + 2) × (ROOF!J12 + 1) × 2 + ROOF!J12 × 1 × 2) × 4

= 208
```

---

## 3. `QUANTITY!P87`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!P87 | `QUANTITY!P87` | `75` |

```
QUANTITY!P87 =
QUANTITY!P87

= 75
```

---

## 4. `QUANTITY!T98`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Canopy Purlins | `CANOPY!Y9` | `3` |
| Canopy Beams | `CANOPY!V9` | `4` |
| JOINTS!AV25 | `JOINTS!AV25` | `10` |

```
QUANTITY!T98 =
CANOPY!Y9 × CANOPY!V9 × JOINTS!AV25

= 120
```

---

## 5. `QUANTITY!T153`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T153 | `QUANTITY!T153` | `13` |

```
QUANTITY!T153 =
QUANTITY!T153

= 13
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| Roof Purlin Spacing | `ROOF!J11` | `1.27` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| JOINTS!AV21 | `JOINTS!AV21` | `14` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| ROOF!AU19 | `ROOF!AU19` | `45` |
| Cladding Purlins | `ROOF!J12` | `2` |
| Int Cols End Frame | `ROOF!J16` | `2` |
| QUANTITY!P87 | `QUANTITY!P87` | `75` |
| Canopy Purlins | `CANOPY!Y9` | `3` |
| Canopy Beams | `CANOPY!V9` | `4` |
| JOINTS!AV25 | `JOINTS!AV25` | `10` |
| QUANTITY!T153 | `QUANTITY!T153` | `13` |

```
AMOUNT!N13 =
((ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) / ROOF!J11 + 1) × 2 × (ROOF!J9 + ROOF!J10) × JOINTS!AV21 + ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) / ROOF!J11 × (ROOF!AR19 + ROOF!AU19) × JOINTS!AV21 + ((ROOF!J9 + ROOF!J10) × ROOF!J12 × 2 + (ROOF!J16 + 2) × (ROOF!J12 + 1) × 2 + ROOF!J12 × 1 × 2) × 4 + QUANTITY!P87 + CANOPY!Y9 × CANOPY!V9 × JOINTS!AV25 + QUANTITY!T153

= 13571.201275000314
```

**Schema-field form:**

```
AMOUNT!N13 =
((roof.buildingOverallWidth / COS(roof.roofSlope × PI() / 180) / 2 + 0.14) / roof.roofPurlinSpacing + 1) × 2 × (roof.mainRoofFrames + roof.endRoofFrames) × joint.purlinFlangeBraceNumberOfBolts + roof.roofExtensionWidthHeight / COS(roof.roofSlope × PI() / 180) / roof.roofPurlinSpacing × (roof.roofExtensionMidFrameCount + roof.roofExtensionEndFrameCount) × joint.purlinFlangeBraceNumberOfBolts + ((roof.mainRoofFrames + roof.endRoofFrames) × roof.claddingPurlins × 2 + (roof.internalColumnsForEndRoofFrames + 2) × (roof.claddingPurlins + 1) × 2 + roof.claddingPurlins × 1 × 2) × 4 + QUANTITY!P87 + canopy.canopies[0].numberOfPurlins × canopy.canopies[0].numberOfBeams × joint.claddingPurlinsNumberOfBolts + QUANTITY!T153

= 13571.201275000314
```

# FORMAT - AMOUNT - N15

**Line item:** FOUNDATION BOLTS  
**Unit:** NOS  
**Original Excel formula:** `=X15+Y15+QUANTITY!T155`  
**Computed value:** `863`

---

## 1. `AMOUNT!X15`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| JOINTS!AV11 | `JOINTS!AV11` | `8` |
| Main Roof Frames | `ROOF!J9` | `4` |
| QUANTITY!AD89 | `QUANTITY!AD89` | `1` |
| End Roof Frames | `ROOF!J10` | `2` |
| QUANTITY!AD90 | `QUANTITY!AD90` | `2` |
| JOINTS!AV12 | `JOINTS!AV12` | `8` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| ROOF!AU19 | `ROOF!AU19` | `45` |
| QUANTITY!AD91 | `QUANTITY!AD91` | `1` |
| JOINTS!AV13 | `JOINTS!AV13` | `8` |
| Int Cols Main Frame | `ROOF!J14` | `1` |
| Int Cols End Frame | `ROOF!J16` | `2` |

```
AMOUNT!X15 =
JOINTS!AV11 × ROOF!J9 × QUANTITY!AD89 × 1 + JOINTS!AV11 × ROOF!J10 × QUANTITY!AD90 × 1 + JOINTS!AV12 × (ROOF!AR19 + ROOF!AU19) × QUANTITY!AD91 × 1 + JOINTS!AV13 × ROOF!J9 × ROOF!J14 × 1 + JOINTS!AV13 × ROOF!J10 × ROOF!J16 × 1

= 848
```

---

## 2. `AMOUNT!Y15`

| Variable | Excel Cell | Value |
| --- | --- | --- |

```
AMOUNT!Y15 =
0

= 0
```

---

## 3. `QUANTITY!T155`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T155 | `QUANTITY!T155` | `15` |

```
QUANTITY!T155 =
QUANTITY!T155

= 15
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| JOINTS!AV11 | `JOINTS!AV11` | `8` |
| Main Roof Frames | `ROOF!J9` | `4` |
| QUANTITY!AD89 | `QUANTITY!AD89` | `1` |
| End Roof Frames | `ROOF!J10` | `2` |
| QUANTITY!AD90 | `QUANTITY!AD90` | `2` |
| JOINTS!AV12 | `JOINTS!AV12` | `8` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| ROOF!AU19 | `ROOF!AU19` | `45` |
| QUANTITY!AD91 | `QUANTITY!AD91` | `1` |
| JOINTS!AV13 | `JOINTS!AV13` | `8` |
| Int Cols Main Frame | `ROOF!J14` | `1` |
| Int Cols End Frame | `ROOF!J16` | `2` |
| QUANTITY!T155 | `QUANTITY!T155` | `15` |

```
AMOUNT!N15 =
JOINTS!AV11 × ROOF!J9 × QUANTITY!AD89 × 1 + JOINTS!AV11 × ROOF!J10 × QUANTITY!AD90 × 1 + JOINTS!AV12 × (ROOF!AR19 + ROOF!AU19) × QUANTITY!AD91 × 1 + JOINTS!AV13 × ROOF!J9 × ROOF!J14 × 1 + JOINTS!AV13 × ROOF!J10 × ROOF!J16 × 1 + QUANTITY!T155

= 863.0
```

**Schema-field form:**

```
AMOUNT!N15 =
joint.foundationBoltRoof[FB4].numberOfBolts × roof.mainRoofFrames × QUANTITY!AD89 × 1 + joint.foundationBoltRoof[FB4].numberOfBolts × roof.endRoofFrames × QUANTITY!AD90 × 1 + joint.foundationBoltRoof[FB5].numberOfBolts × (roof.roofExtensionMidFrameCount + roof.roofExtensionEndFrameCount) × QUANTITY!AD91 × 1 + joint.foundationBoltRoof[FB6].numberOfBolts × roof.mainRoofFrames × roof.internalColumnsForMainRoofFrames × 1 + joint.foundationBoltRoof[FB6].numberOfBolts × roof.endRoofFrames × roof.internalColumnsForEndRoofFrames × 1 + QUANTITY!T155

= 863.0
```


# FORMAT - AMOUNT - N16

**Line item:** ANCHOR BOLTS  
**Unit:** NOS  
**Original Excel formula:** `=X16+QUANTITY!T154`  
**Computed value:** `14`

---

## 1. `AMOUNT!X16`

| Variable | Excel Cell | Value |
| --- | --- | --- |

```
AMOUNT!X16 =
0

= 0
```

---

## 2. `QUANTITY!T154`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T154 | `QUANTITY!T154` | `14` |

```
QUANTITY!T154 =
QUANTITY!T154

= 14
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T154 | `QUANTITY!T154` | `14` |

```
AMOUNT!N16 =
QUANTITY!T154

= 14.0
```

**Schema-field form:**

```
AMOUNT!N16 =
QUANTITY!T154

= 14.0
```

# FORMAT - AMOUNT - N21

**Line item:** FLASHING  
**Unit:** RM  
**Original Excel formula:** `=QUANTITY!T97+QUANTITY!T121+QUANTITY!T122+QUANTITY!T139+QUANTITY!P139`  
**Computed value:** `6802.314945`

---

## 1. `QUANTITY!T97`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Canopy Width | `CANOPY!J9` | `2` |
| Canopy Length | `CANOPY!G9` | `15` |

```
QUANTITY!T97 =
CANOPY!J9 × 2 + CANOPY!G9

= 19
```

---

## 2. `QUANTITY!T121`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| ACCESSORIES!Z8 | `ACCESSORIES!Z8` | `46` |

```
QUANTITY!T121 =
(ROOF!I6 / COS(ROOF!J8 × PI() / 180) + 0.14) × 2 + (ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) + 0.14) × 2 + ACCESSORIES!Z8

= 100.857447
```

---

## 3. `QUANTITY!T122`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Eave Height | `ROOF!J7` | `5.645` |
| ROOF!AI6 | `ROOF!AI6` | `2.4` |
| ROOF!AQ20 | `ROOF!AQ20` | `12` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AI9 | `ROOF!AI9` | `2.4` |
| ROOF!AI7 | `ROOF!AI7` | `2.4` |
| ACCESSORIES!Z9 | `ACCESSORIES!Z9` | `23` |

```
QUANTITY!T122 =
ROOF!J7 − ROOF!AI6 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9 + ROOF!J7 − ROOF!AI7 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9 + ACCESSORIES!Z9

= 33.457498
```

---

## 4. `QUANTITY!T139`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Mezz Bay Length | `MEZZ!L7` | `15` |
| Mezz Bay Width | `MEZZ!O7` | `6` |
| Mezz2 Bay Length | `MEZZ!L23` | `15` |
| Mezz2 Bay Width | `MEZZ!O23` | `6` |

```
QUANTITY!T139 =
(MEZZ!L7 + MEZZ!O7) × 2 + (MEZZ!L23 + MEZZ!O23) × 2

= 84
```

---

## 5. `QUANTITY!P139`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!P139 | `QUANTITY!P139` | `6565` |

```
QUANTITY!P139 =
QUANTITY!P139

= 6565
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Canopy Width | `CANOPY!J9` | `2` |
| Canopy Length | `CANOPY!G9` | `15` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| ACCESSORIES!Z8 | `ACCESSORIES!Z8` | `46` |
| Eave Height | `ROOF!J7` | `5.645` |
| ROOF!AI6 | `ROOF!AI6` | `2.4` |
| ROOF!AQ20 | `ROOF!AQ20` | `12` |
| ROOF!AI9 | `ROOF!AI9` | `2.4` |
| ROOF!AI7 | `ROOF!AI7` | `2.4` |
| ACCESSORIES!Z9 | `ACCESSORIES!Z9` | `23` |
| Mezz Bay Length | `MEZZ!L7` | `15` |
| Mezz Bay Width | `MEZZ!O7` | `6` |
| Mezz2 Bay Length | `MEZZ!L23` | `15` |
| Mezz2 Bay Width | `MEZZ!O23` | `6` |
| QUANTITY!P139 | `QUANTITY!P139` | `6565` |

```
AMOUNT!N21 =
CANOPY!J9 × 2 + CANOPY!G9 + (ROOF!I6 / COS(ROOF!J8 × PI() / 180) + 0.14) × 2 + (ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) + 0.14) × 2 + ACCESSORIES!Z8 + ROOF!J7 − ROOF!AI6 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9 + ROOF!J7 − ROOF!AI7 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9 + ACCESSORIES!Z9 + (MEZZ!L7 + MEZZ!O7) × 2 + (MEZZ!L23 + MEZZ!O23) × 2 + QUANTITY!P139

= 6802.3149454500535
```

**Schema-field form:**

```
AMOUNT!N21 =
canopy.canopies[0].width × 2 + canopy.canopies[0].length + (roof.buildingOverallWidth / COS(roof.roofSlope × PI() / 180) + 0.14) × 2 + (roof.roofExtensionWidthHeight / COS(roof.roofSlope × PI() / 180) + 0.14) × 2 + «ACCESSORIES!Z8» + roof.eaveHeight − roof.sidewalls[FRONT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.sidewalls[BACK].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height + «ACCESSORIES!Z9» + (mezzanine.floors[0].lengthM + mezzanine.floors[0].widthM) × 2 + (mezzanine.floors[1].lengthM + mezzanine.floors[1].widthM) × 2 + QUANTITY!P139

= 6802.3149454500535
```

# FORMAT - AMOUNT - N26

**Line item:** ROOF INSULATION  
**Unit:** SQM  
**Original Excel formula:** `=IF(ACCESSORIES!A16=FALSE,0,N10)`  
**Computed value:** `7675.493359`

---

## 1. `AMOUNT!N10`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Length | `ROOF!I5` | `30` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| ROOF!AU19 | `ROOF!AU19` | `45` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| ROOF!AS9 | `ROOF!AS9` | `5` |
| ROOF!AX12 | `ROOF!AX12` | `6` |
| ROOF!AX13 | `ROOF!AX13` | `7` |
| ROOF!AX14 | `ROOF!AX14` | `8` |
| QUANTITY!T21 | `QUANTITY!T21` | `456` |

```
AMOUNT!N10 =
(ROOF!I5 × (ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) × 2 + ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) × ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1) × (ROOF!AU19 + ROOF!AR19 − 1) − ROOF!AS9 − ROOF!AX12 × ROOF!AX13 × ROOF!AX14) × 1.1 + QUANTITY!T21

= 7675.493359
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Building Length | `ROOF!I5` | `30` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AQ19 | `ROOF!AQ19` | `12` |
| Main Roof Frames | `ROOF!J9` | `4` |
| End Roof Frames | `ROOF!J10` | `2` |
| ROOF!AU19 | `ROOF!AU19` | `45` |
| ROOF!AR19 | `ROOF!AR19` | `45` |
| ROOF!AS9 | `ROOF!AS9` | `5` |
| ROOF!AX12 | `ROOF!AX12` | `6` |
| ROOF!AX13 | `ROOF!AX13` | `7` |
| ROOF!AX14 | `ROOF!AX14` | `8` |
| QUANTITY!T21 | `QUANTITY!T21` | `456` |

```
AMOUNT!N26 =
(ROOF!I5 × (ROOF!I6 / COS(ROOF!J8 × PI() / 180) / 2 + 0.14) × 2 + ROOF!AQ19 / COS(ROOF!J8 × PI() / 180) × ROOF!I5 / (ROOF!J9 + ROOF!J10 − 1) × (ROOF!AU19 + ROOF!AR19 − 1) − ROOF!AS9 − ROOF!AX12 × ROOF!AX13 × ROOF!AX14) × 1.1 + QUANTITY!T21

= 7675.493359371257
```

**Schema-field form:**

```
AMOUNT!N26 =
(roof.buildingOverallLength × (roof.buildingOverallWidth / COS(roof.roofSlope × PI() / 180) / 2 + 0.14) × 2 + roof.roofExtensionWidthHeight / COS(roof.roofSlope × PI() / 180) × roof.buildingOverallLength / (roof.mainRoofFrames + roof.endRoofFrames − 1) × (roof.roofExtensionEndFrameCount + roof.roofExtensionMidFrameCount − 1) − roof.roofAreaDeduction − roof.polycarbonateRoofLength × roof.polycarbonateRoofWidth × roof.polycarbonateRoofCount) × 1.1 + QUANTITY!T21

= 7675.493359371257
```


# FORMAT - AMOUNT - N27

**Line item:** WALL INSULATION  
**Unit:** SQM  
**Original Excel formula:** `=IF(ACCESSORIES!A17=FALSE,0,N11)`  
**Computed value:** `168.389138`

---

## 1. `AMOUNT!N11`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Eave Height | `ROOF!J7` | `5.645` |
| ROOF!AI6 | `ROOF!AI6` | `2.4` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AI9 | `ROOF!AI9` | `2.4` |
| ROOF!AQ20 | `ROOF!AQ20` | `12` |
| ROOF!AI7 | `ROOF!AI7` | `2.4` |
| Building Length | `ROOF!I5` | `30` |
| ROOF!AI8 | `ROOF!AI8` | `2.4` |
| ROOF!AH18 | `ROOF!AH18` | `45` |
| ROOF!AH19 | `ROOF!AH19` | `42` |
| ROOF!AH20 | `ROOF!AH20` | `78` |
| ROOF!AH21 | `ROOF!AH21` | `45` |
| ROOF!AK24 | `ROOF!AK24` | `51.72` |
| QUANTITY!P82 | `QUANTITY!P82` | `53` |

```
AMOUNT!N11 =
((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5 − ROOF!AH18 − ROOF!AH19 − ROOF!AH20 − ROOF!AH21 − ROOF!AK24) × 1.1 + QUANTITY!P82

= 168.389138
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Eave Height | `ROOF!J7` | `5.645` |
| ROOF!AI6 | `ROOF!AI6` | `2.4` |
| Building Width | `ROOF!I6` | `15` |
| Roof Slope (deg) | `ROOF!J8` | `6` |
| ROOF!AI9 | `ROOF!AI9` | `2.4` |
| ROOF!AQ20 | `ROOF!AQ20` | `12` |
| ROOF!AI7 | `ROOF!AI7` | `2.4` |
| Building Length | `ROOF!I5` | `30` |
| ROOF!AI8 | `ROOF!AI8` | `2.4` |
| ROOF!AH18 | `ROOF!AH18` | `45` |
| ROOF!AH19 | `ROOF!AH19` | `42` |
| ROOF!AH20 | `ROOF!AH20` | `78` |
| ROOF!AH21 | `ROOF!AH21` | `45` |
| ROOF!AK24 | `ROOF!AK24` | `51.72` |
| QUANTITY!P82 | `QUANTITY!P82` | `53` |

```
AMOUNT!N27 =
((ROOF!J7 − ROOF!AI6 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI6) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI7 + ROOF!I6 / 2 × TAN(ROOF!J8 × PI() / 180) + ROOF!J7 − ROOF!AI7) / 2 × ROOF!I6 + (ROOF!J7 − ROOF!AI9 + ROOF!J7 − ROOF!AQ20 × TAN(ROOF!J8 × PI() / 180) − ROOF!AI9) / 2 × ROOF!AQ20 + (ROOF!J7 − ROOF!AI9) × ROOF!I5 + (ROOF!J7 − ROOF!AI8) × ROOF!I5 − ROOF!AH18 − ROOF!AH19 − ROOF!AH20 − ROOF!AH21 − ROOF!AK24) × 1.1 + QUANTITY!P82

= 168.38913824804428
```

**Schema-field form:**

```
AMOUNT!N27 =
((roof.eaveHeight − roof.sidewalls[FRONT].height + roof.buildingOverallWidth / 2 × TAN(roof.roofSlope × PI() / 180) + roof.eaveHeight − roof.sidewalls[FRONT].height) / 2 × roof.buildingOverallWidth + (roof.eaveHeight − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height) / 2 × roof.claddingExtensionWidthHeight + (roof.eaveHeight − roof.sidewalls[BACK].height + roof.buildingOverallWidth / 2 × TAN(roof.roofSlope × PI() / 180) + roof.eaveHeight − roof.sidewalls[BACK].height) / 2 × roof.buildingOverallWidth + (roof.eaveHeight − roof.sidewalls[LEFT].height + roof.eaveHeight − roof.claddingExtensionWidthHeight × TAN(roof.roofSlope × PI() / 180) − roof.sidewalls[LEFT].height) / 2 × roof.claddingExtensionWidthHeight + (roof.eaveHeight − roof.sidewalls[LEFT].height) × roof.buildingOverallLength + (roof.eaveHeight − roof.sidewalls[RIGHT].height) × roof.buildingOverallLength − roof.frontCladdingOpeningArea − roof.backCladdingOpeningArea − roof.rightCladdingOpeningArea − roof.leftCladdingOpeningArea − roof.fasciaBoardArea) × 1.1 + QUANTITY!P82

= 168.38913824804428
```

# FORMAT - AMOUNT - N29

**Line item:** DECKING SHEET  
**Unit:** SQM  
**Original Excel formula:** `=QUANTITY!T136+QUANTITY!T137`  
**Computed value:** `234.54`

---

## 1. `QUANTITY!T136`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Mezz Bay Length | `MEZZ!L7` | `15` |
| Mezz Bay Width | `MEZZ!O7` | `6` |
| STAIR!AS8 | `STAIR!AS8` | `3.6` |
| STAIR!AU8 | `STAIR!AU8` | `1` |
| Stair Run Count | `STAIR!S8` | `4` |
| Stair Width | `STAIR!V8` | `1.25` |
| Mezz2 Bay Length | `MEZZ!L23` | `15` |
| Mezz2 Bay Width | `MEZZ!O23` | `6` |

```
QUANTITY!T136 =
(MEZZ!L7 × MEZZ!O7 − STAIR!AS8 × STAIR!AU8 − STAIR!S8 × STAIR!V8 + MEZZ!L23 × MEZZ!O23) × 1.1

= 188.54
```

---

## 2. `QUANTITY!T137`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T137 | `QUANTITY!T137` | `46` |

```
QUANTITY!T137 =
QUANTITY!T137

= 46
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Mezz Bay Length | `MEZZ!L7` | `15` |
| Mezz Bay Width | `MEZZ!O7` | `6` |
| STAIR!AS8 | `STAIR!AS8` | `3.6` |
| STAIR!AU8 | `STAIR!AU8` | `1` |
| Stair Run Count | `STAIR!S8` | `4` |
| Stair Width | `STAIR!V8` | `1.25` |
| Mezz2 Bay Length | `MEZZ!L23` | `15` |
| Mezz2 Bay Width | `MEZZ!O23` | `6` |
| QUANTITY!T137 | `QUANTITY!T137` | `46` |

```
AMOUNT!N29 =
(MEZZ!L7 × MEZZ!O7 − STAIR!AS8 × STAIR!AU8 − STAIR!S8 × STAIR!V8 + MEZZ!L23 × MEZZ!O23) × 1.1 + QUANTITY!T137

= 234.54000000000002
```

**Schema-field form:**

```
AMOUNT!N29 =
(mezzanine.floors[0].lengthM × mezzanine.floors[0].widthM − stair.areaDeductions[0].areaM2 × stair.areaDeductions[0].numbers − stair.stairs[0].length × stair.stairs[0].width + mezzanine.floors[1].lengthM × mezzanine.floors[1].widthM) × 1.1 + QUANTITY!T137

= 234.54000000000002
```


# FORMAT - AMOUNT - N30

**Line item:** SHEAR STUDS  
**Unit:** NOS  
**Original Excel formula:** `=QUANTITY!P138+QUANTITY!T138`  
**Computed value:** `6480`

---

## 1. `QUANTITY!P138`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!P138 | `QUANTITY!P138` | `5580` |

```
QUANTITY!P138 =
QUANTITY!P138

= 5580
```

---

## 2. `QUANTITY!T138`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| Mezz Bay Length | `MEZZ!L7` | `15` |
| MEZZ!AG7 | `MEZZ!AG7` | `12` |
| Mezz2 Bay Length | `MEZZ!L23` | `15` |
| MEZZ!AG23 | `MEZZ!AG23` | `12` |

```
QUANTITY!T138 =
(MEZZ!L7 × MEZZ!AG7 + MEZZ!L23 × MEZZ!AG23) / 0.4

= 900
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!P138 | `QUANTITY!P138` | `5580` |
| Mezz Bay Length | `MEZZ!L7` | `15` |
| MEZZ!AG7 | `MEZZ!AG7` | `12` |
| Mezz2 Bay Length | `MEZZ!L23` | `15` |
| MEZZ!AG23 | `MEZZ!AG23` | `12` |

```
AMOUNT!N30 =
QUANTITY!P138 + (MEZZ!L7 × MEZZ!AG7 + MEZZ!L23 × MEZZ!AG23) / 0.4

= 6480.0
```

**Schema-field form:**

```
AMOUNT!N30 =
QUANTITY!P138 + (mezzanine.floors[0].lengthM × mezzanine.floors[0].beamsSecondary + mezzanine.floors[1].lengthM × mezzanine.floors[1].beamsSecondary) / 0.4

= 6480.0
```


# FORMAT - AMOUNT - N31

**Line item:** POLY CARBONATE SHEET  
**Unit:** SQM  
**Original Excel formula:** `=QUANTITY!T27+QUANTITY!T26`  
**Computed value:** `4564`

---

## 1. `QUANTITY!T27`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T27 | `QUANTITY!T27` | `4564` |

```
QUANTITY!T27 =
QUANTITY!T27

= 4564
```

---

## 2. `QUANTITY!T26`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| ROOF!AX12 | `ROOF!AX12` | `6` |
| ROOF!AX13 | `ROOF!AX13` | `7` |
| ROOF!AX14 | `ROOF!AX14` | `8` |

```
QUANTITY!T26 =
ROOF!AX12 × ROOF!AX13 × ROOF!AX14 × 0

= 0
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| QUANTITY!T27 | `QUANTITY!T27` | `4564` |

```
AMOUNT!N31 =
QUANTITY!T27

= 4564.0
```

**Schema-field form:**

```
AMOUNT!N31 =
QUANTITY!T27

= 4564.0
```

# FORMAT - AMOUNT - N40

**Line item:** INTERNAL PARTITIONS  
**Unit:** SQM  
**Original Excel formula:** `=QUANTITY!T116`  
**Computed value:** `900`

---

## 1. `QUANTITY!T116`

| Variable | Excel Cell | Value |
| --- | --- | --- |
| ACCESSORIES!X11 | `ACCESSORIES!X11` | `900` |

```
QUANTITY!T116 =
ACCESSORIES!X11

= 900
```

---

# Final Equation

| Variable | Excel Cell | Value |
| --- | --- | --- |
| ACCESSORIES!X11 | `ACCESSORIES!X11` | `900` |

```
AMOUNT!N40 =
ACCESSORIES!X11

= 900.0
```

**Schema-field form:**

```
AMOUNT!N40 =
accessories.partitionQuantity

= 900.0
```


# Application Job Data

{
    "id": "cms3ludmn0001asv0nzn7v5kq",
    "userId": "user_3EfmONmZWOmsqVwUa3RgGLeNVbp",
    "projectNo": "20-212",
    "subject": "20-212 Offer for Supply and Installation of Pre Engineered Steel Hypermarket Building at Wandoor",
    "refNo": "FBS/SM/212/17/12/2020",
    "date": "2026-07-28T00:00:00.000Z",
    "designedByName": "ROHITH E",
    "designedByMobile": "9747289249",
    "clientName": "Yaseen K C",
    "estimationEngineerName": "GEETHANJALI",
    "estimationEngineerMobile": "8136989922",
    "headOfSalesName": "SANTHOSH P S",
    "headOfSalesMobile": "9526716600",
    "firmName": "M/S MOCA ARCHITECTS",
    "buildingUsage": "Commercial Building",
    "numberOfBuilding": 1,
    "frameType": "Portal",
    "configuration": "Clear Span",
    "createdAt": "2026-07-27T19:13:23.327Z",
    "updatedAt": "2026-07-31T05:15:10.993Z",
    "roof": {
        "id": "cms3m56e30002asv01f8rqsy4",
        "jobId": "cms3ludmn0001asv0nzn7v5kq",
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
        "backCladdingOpeningArea": "42",
        "rightCladdingOpeningArea": "78",
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
        "createdAt": "2026-07-27T19:21:47.163Z",
        "updatedAt": "2026-07-31T05:15:13.207Z",
        "roofFrameBaseFixing": "FOUNDATION_BOLT",
        "materialConsumptionExcludingPurlin": "1.25",
        "diaOfRoofSagRod": "12",
        "diaOfCladdingSagRod": "12",
        "sidewalls": [
            {
                "id": "cms8hnw7a0000y4v0bihpi3j5",
                "roofId": "cms3m56e30002asv01f8rqsy4",
                "side": "FRONT",
                "wallType": "BRICK",
                "thickness": "200",
                "height": "2.4"
            },
            {
                "id": "cms8hnw7b0001y4v054as4t5j",
                "roofId": "cms3m56e30002asv01f8rqsy4",
                "side": "BACK",
                "wallType": "BRICK",
                "thickness": "200",
                "height": "2.4"
            },
            {
                "id": "cms8hnw7b0002y4v042sr2p3t",
                "roofId": "cms3m56e30002asv01f8rqsy4",
                "side": "RIGHT",
                "wallType": "BRICK",
                "thickness": "200",
                "height": "2.4"
            },
            {
                "id": "cms8hnw7b0003y4v0b6sxratt",
                "roofId": "cms3m56e30002asv01f8rqsy4",
                "side": "LEFT",
                "wallType": "BRICK",
                "thickness": "200",
                "height": "2.4"
            }
        ]
    },
    "mezzanine": {
        "id": "cms3m91q20007asv0jctv8svz",
        "jobId": "cms3ludmn0001asv0nzn7v5kq",
        "createdAt": "2026-07-27T19:24:47.738Z",
        "updatedAt": "2026-07-27T19:24:47.738Z",
        "floors": [
            {
                "id": "cms8hnxcy0004y4v0dahy1fwv",
                "mezzanineId": "cms3m91q20007asv0jctv8svz",
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
                "id": "cms8hnxd60005y4v0oppn5scg",
                "mezzanineId": "cms3m91q20007asv0jctv8svz",
                "code": null,
                "floor": "FLOOR_1",
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
        "id": "cms3mazxm000basv0bp81on9r",
        "jobId": "cms3ludmn0001asv0nzn7v5kq",
        "createdAt": "2026-07-27T19:26:18.730Z",
        "updatedAt": "2026-07-27T19:26:18.730Z",
        "stairs": [
            {
                "id": "cms8hnybt0006y4v0tv7sxasq",
                "stairId": "cms3mazxm000basv0bp81on9r",
                "code": "STAIR_1",
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
                "id": "cms8hnyc80007y4v0akdhmrs9",
                "stairId": "cms3mazxm000basv0bp81on9r",
                "type": "CUT_OUT",
                "location": "MEZ_1",
                "areaM2": "3.6",
                "numbers": 1,
                "deductionFor": "BOTH"
            }
        ]
    },
    "canopy": {
        "id": "cms3mc931000easv0kdng1f4d",
        "jobId": "cms3ludmn0001asv0nzn7v5kq",
        "createdAt": "2026-07-27T19:27:17.245Z",
        "updatedAt": "2026-07-27T19:27:17.245Z",
        "canopies": [
            {
                "id": "cms8hnz6y0008y4v0vynpelvi",
                "canopyId": "cms3mc931000easv0kdng1f4d",
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
        "id": "cms3mjzv3000hasv03ll0v0qo",
        "jobId": "cms3ludmn0001asv0nzn7v5kq",
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
        "createdAt": "2026-07-27T19:33:18.543Z",
        "updatedAt": "2026-07-31T05:15:20.779Z"
    },
    "accessories": {
        "id": "cms3minye000gasv09p0en1o1",
        "jobId": "cms3ludmn0001asv0nzn7v5kq",
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
        "createdAt": "2026-07-27T19:32:16.454Z",
        "updatedAt": "2026-07-31T05:15:19.456Z",
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
        "id": "cms3mlqom000iasv0hze49myd",
        "jobId": "cms3ludmn0001asv0nzn7v5kq",
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
        "createdAt": "2026-07-27T19:34:39.958Z",
        "updatedAt": "2026-07-31T05:15:22.374Z",
        "jointBoltRoof": [
            {
                "id": "cms8ho39r000by4v06u8t10o8",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "A",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000cy4v0aigfzwki",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "B",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000dy4v06njsgs92",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "C",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000ey4v0e2b6aug0",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "D",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000fy4v0sbmieqjz",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "E",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000gy4v0skiivndm",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "F",
                "boltDiameter": "16",
                "numberOfBolts": 4
            },
            {
                "id": "cms8ho39r000hy4v01it0d3bo",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "G",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000iy4v0deqn9454",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "H",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000jy4v0twsbqaos",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "I",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000ky4v0q9uj0d6n",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "J",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000ly4v0w3q8nokq",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "K",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000my4v05kwl4n30",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "L",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000ny4v0znezd5sx",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "A_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000oy4v0lc0cijsh",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "B_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000py4v0ranbbi0y",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "B_2",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000qy4v0z18tkldn",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "C_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000ry4v0ovv3xiv6",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "D_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000sy4v064s59liu",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "G_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000ty4v0dryy9k3z",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "H_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000uy4v0snxchv2n",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "I_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000vy4v09yxpz5e6",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "K_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho39r000wy4v0vkfg9nbn",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "roofJointId": "L_1",
                "boltDiameter": "16",
                "numberOfBolts": 8
            }
        ],
        "jointBoltMezzanine": [
            {
                "id": "cms8ho3a1000xy4v075d84rfu",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "mezzanineJointId": "M",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho3a1000yy4v0jex4mzv3",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "mezzanineJointId": "N",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho3a1000zy4v03f823pl5",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "mezzanineJointId": "O",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho3a10010y4v01j1lcsx6",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "mezzanineJointId": "P",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho3a10011y4v0uiaitrwa",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "mezzanineJointId": "Q",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho3a10012y4v0sic37ff4",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "mezzanineJointId": "R",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho3a10013y4v0djslfnlk",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "mezzanineJointId": "S",
                "boltDiameter": "16",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho3a10014y4v0dp19nnra",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "mezzanineJointId": "SEC",
                "boltDiameter": "16",
                "numberOfBolts": 8
            }
        ],
        "foundationBoltRoof": [
            {
                "id": "cms8ho3a50015y4v0meo3kmy2",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "foundationJointId": "FB4",
                "boltDiameter": "20",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho3a50016y4v05sd8692z",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "foundationJointId": "FB5",
                "boltDiameter": "20",
                "numberOfBolts": 8
            },
            {
                "id": "cms8ho3a50017y4v0i2g241ak",
                "jointId": "cms3mlqom000iasv0hze49myd",
                "foundationJointId": "FB6",
                "boltDiameter": "20",
                "numberOfBolts": 8
            }
        ]
    },
    "spec": {
        "id": "cms3mpvm0001gasv03ehy4npj",
        "jobId": "cms3ludmn0001asv0nzn7v5kq",
        "createdAt": "2026-07-27T19:37:52.968Z",
        "updatedAt": "2026-07-27T19:37:52.968Z",
        "products": [
            {
                "id": "cms8ho42b0018y4v02ts1ubkf",
                "specId": "cms3mpvm0001gasv03ehy4npj",
                "code": "PRODUCT-1",
                "description": "Fabricated Columns and Beams",
                "specification": "Fabricated from Plates or Stocks by continuous welding process.\nConform to IS2062 Grade E345/ASTM A572-12 Grade 50\nshall be killed/Semi killed\nMin Thickness of plate 4mm",
                "makeOrBrand": "JSW / TATA",
                "yieldStrengthMpa": 345
            },
            {
                "id": "cms8ho42b0019y4v03uwhiszw",
                "specId": "cms3mpvm0001gasv03ehy4npj",
                "code": "PRODUCT-2",
                "description": "Cold formed Purlins / Girt",
                "specification": "ASTM A 653 Grade 275\nCoating Z 120 or equivalent",
                "makeOrBrand": "JSW",
                "yieldStrengthMpa": 275
            },
            {
                "id": "cms8ho42b001ay4v0v4apkngo",
                "specId": "cms3mpvm0001gasv03ehy4npj",
                "code": "PRODUCT-3",
                "description": "Roofing Sheet ",
                "specification": "30mm Puff Sheet",
                "makeOrBrand": "Metecno/ JSW",
                "yieldStrengthMpa": 550
            },
            {
                "id": "cms8ho42b001by4v0133f7lm1",
                "specId": "cms3mpvm0001gasv03ehy4npj",
                "code": "PRODUCT-4",
                "description": "Cladding Sheet",
                "specification": "Zincalume Steel \nRoof sheet 0.40mm TCT\nGrade 550",
                "makeOrBrand": "JSW",
                "yieldStrengthMpa": 550
            },
            {
                "id": "cms8ho42b001cy4v0rogdy8km",
                "specId": "cms3mpvm0001gasv03ehy4npj",
                "code": "PRODUCT-5",
                "description": "Decking Sheet",
                "specification": "Decking Profile 50/230 (Depth/Pitch)\nPanel thickenss 0.8mm \nYield Strength 250 Mpa\nZinc Coating- Z 120 GSM",
                "makeOrBrand": "JSW",
                "yieldStrengthMpa": 250
            },
            {
                "id": "cms8ho42b001dy4v0tplaw1ca",
                "specId": "cms3mpvm0001gasv03ehy4npj",
                "code": "PRODUCT-6",
                "description": "Primary  Connection",
                "specification": "Primary bolts- high strength bolts conforming to the physical specifications of ASTM A325  (or equivalent)\nGrade 8.8",
                "makeOrBrand": "UNBRACO",
                "yieldStrengthMpa": 640
            },
            {
                "id": "cms8ho42b001ey4v0t29r12mb",
                "specId": "cms3mpvm0001gasv03ehy4npj",
                "code": "PRODUCT-7",
                "description": "Secondary Connection",
                "specification": "Secondary bolts - machine bolts conform to the physical Specifications of ASTM A307 (or equivalent).\nGrade 4.6 ",
                "makeOrBrand": "SS",
                "yieldStrengthMpa": 240
            }
        ]
    },
    "quantity": {
        "id": "cms3n14i1002nasv0779n3n6d",
        "jobId": "cms3ludmn0001asv0nzn7v5kq",
        "createdAt": "2026-07-27T19:46:37.705Z",
        "updatedAt": "2026-07-31T05:15:27.588Z",
        "calculationVersion": "quantity-v1",
        "sourceUpdatedAt": "2026-07-31T05:15:27.533Z",
        "rateVersion": 1,
        "isStale": false,
        "pebRoof": {
            "id": "cms3n14i6002oasv0cgbhdgd7",
            "quantityId": "cms3n14i1002nasv0779n3n6d",
            "pebRoofValue": "TRUE",
            "pebRoofQuantity": "0.48",
            "raftersAndColumns": "FE_345",
            "raftersAndColumnsQuantity": "6198.819",
            "lengthOfBuilding": "30",
            "lengthOfBuildingQuantity": "456",
            "inclinedLengthInOneHalf": "7.681",
            "roofArea": "4959.055",
            "materialConsumption": "1.25",
            "roofPurlinsValue": "89",
            "roofPurlins": "Z_CPURLIN 150 MM DEPTH",
            "roofPurlinsQuantity": "27672.335",
            "lengthOfOnePurlin": "6.4",
            "lengthOfOnePurlinQuantity": "565",
            "noOfPurlinsInOneFrame": "14.097",
            "totalNoOfPurlinBay": "5",
            "unitWeightOfPurlin": "4.72",
            "noOfExtendedFrame": "9.501",
            "noOfExtendedPurlinBay": "89",
            "roofSheet": "30MM THICK PUFF_SHEET",
            "roofSheetQuantity": "6563.176",
            "roofSheetPurchaseQuantity": "7219.493",
            "extendedRoofWidth": "12.066",
            "extendedRoofWidthAdditonal": "456",
            "extendedRoofLength": "534",
            "roofAreaDeductions": "5",
            "polyCarbonateAreaDeductions": "336",
            "polyCarbonateSheetQuantity": "336",
            "polyCarbonateSheetPurchaseQuantity": "0",
            "lengthOfpolyCarbonateSheet": "6",
            "lengthOfpolyCarbonateSheetAdditional": "4565",
            "widthOfpolyCarbonateSheet": "7",
            "NosOfpolyCarbonateSheet": "8",
            "roofWindBracing": "189.656",
            "lengthOfSinlgeWindBracing": "9.637",
            "lengthOfSinlgeWindBracingAdditional": "5432",
            "totalNumberOfWindBracing": "8",
            "unitWeightOfRoofWindBracing": "2.46",
            "roofSagRoadValue": "8.501",
            "roofSagRoadQuantity": "726.275",
            "lengthOfSingleSagRoad": "1.47",
            "lengthOfSingleSagRoadAdditional": "6756",
            "noOfSagRodInASingleFrame": "12.097",
            "noOfBayInSagRodProvided": "5",
            "noOfSagRodInExtendedFrame": "8.501",
            "noOfExtendedSagRodBay": "89",
            "unitWeightOfSagRod": "0.889",
            "roofFlangeBraceQuantity": "3308.273",
            "lengthOfMidFrameFlangeBrace": "1.5",
            "lengthOfMidFrameFlangeBraceAdditional": "767",
            "noOfFlangeBraceInMidFrame": "28.193",
            "noOfFlangeBraceInEndFrame": "14.097",
            "noOfMidFrame": "4",
            "noOfEndFrame": "2",
            "noOfFlngBraceInExtendedFrame": "19.002",
            "noOfFlngBraceInExtendedFrame2": "9.501",
            "noOfExtendedMidFrame": "45",
            "noOfExtendedEndFrame": "45",
            "lengthOfEndFrameFlangeBrace": "0.5",
            "numberOfPurlinBolts": "12 MM DIA ORDINARY BOLTS",
            "numberOfPurlinBoltsQuantity": "13155.201",
            "noOfPurlinJointInSingleFrame": "14.097",
            "totalnoOfFrames": "6",
            "noOfPurlinnodeInExtendedFrame": "9.501",
            "noOfExtendedFrames": "90",
            "noOfBoltsInSinglePurlinJoint": "14",
            "numberOfRoofJointBolts": "16 MM DIA HSFG BOLTS",
            "numberOfRoofJointBoltsQuantity": "1776",
            "numberOfFoundationBolts": "20 MM DIA FOUNDATION BOLTS",
            "numberOfFoundationBoltsQuantity": "848",
            "numberOfAnchorBolts": "20 MM DIA ANCHOR BOLTS",
            "numberOfAnchorBoltsQuantity": "0"
        },
        "cladding": {
            "id": "cms3n17j0002pasv0xdbhjkpp",
            "quantityId": "cms3n14i1002nasv0779n3n6d",
            "claddingStructureQuantity": "327.474",
            "claddingEaveHeightFront": "3.25",
            "claddingEaveHeightFrontAdditional": "3677",
            "claddingEaveHeightBack": "3.25",
            "claddingEaveHeightRight": "3.25",
            "claddingEaveHeightLeft": "3.25",
            "extendedColumnHeight": "1.989",
            "widthOfExtendedFrame": "12",
            "noOfSideCladdingPurlin": "2",
            "noOfFaceCladdingPurlin": "4",
            "totalLengthOfCladdingPurlin": "241.5",
            "totalWeightofCladdingPurlin": "1139.88",
            "claddingAreaWithoutAnyDeductions": "367.189",
            "averageMaterialConsumption": "0.289",
            "totalCladdingOpenings": "210",
            "fasciaOpening": "51.7",
            "claddingSheetQuantity": "105.489",
            "claddingSheetAdditional": "53",
            "claddingSheetPurchase": "116.038",
            "columnWindBracings": "161.52",
            "columnWindBracingsAdditional": "44",
            "claddingSagRod": "19.101",
            "claddingSagRodAdditional": "54",
            "claddingFlangeBrace": "163.28",
            "claddingFlangeBraceAdditional": "65",
            "numberOfCladdingPurlinBolts": "208",
            "numberOfCladdingPurlinBoltsAdditional": "75"
        },
        "canopy": {
            "id": "cms3o17wr001gh4v0n0nj2p4f",
            "quantityId": "cms3n14i1002nasv0779n3n6d",
            "canopyStructureQuantity": "403.5",
            "canopyArea": "322.8",
            "canopyPurlinQuantity": "229.392",
            "canopySheetQuantity": "30",
            "canopySheetPurchaseQuantity": "33",
            "canopyGutterQuantity": "15",
            "canopyDownTakeQuantity": "14",
            "canopySideCoveringQuantity": "9.5",
            "canopyFlashingQuantity": "19",
            "canopyPurlinBoltsQuantity": "120",
            "canopyJointBoltsQuantity": "32"
        },
        "accessories": {
            "id": "cms3o17wz001hh4v0mmlpaikw",
            "quantityId": "cms3n14i1002nasv0779n3n6d",
            "doors": "10",
            "doorsQuantity": "21",
            "windows": "10",
            "windowsQuantity": "18",
            "fasciaStructureQuantity": "556.292",
            "fasciaCoveringSheetBoardQuantity": "51.7",
            "internalPartitionsQuantity": "900",
            "ridgeQuantity": "442",
            "gutterQuantity": "306",
            "downtakeQuantity": "262.9",
            "dripTrimQuantity": "546",
            "gableEndFlashingQuantity": "100.857",
            "cornerFlashQuantity": "33.477",
            "rollingShutter": "1",
            "rollingShutterQuantity": "100",
            "louvers": "1",
            "louversQuantity": "100",
            "skyLight": "1",
            "skyLightQuantity": "100",
            "wallLight": "1",
            "wallLightQuantity": "100",
            "roofInsulation": "XLPE",
            "roofInsulationQuantity": "6563.176",
            "wallInsulation": "XLPE",
            "wallInsulationQuantity": "105.489",
            "turboVentilators": "IN_6",
            "turboVentilatorsQuantity": "10",
            "handrail": "250",
            "handrailQuantity": "250"
        },
        "mezzanine": {
            "id": "cms3n1btr002qasv0k3taxo4i",
            "quantityId": "cms3n14i1002nasv0779n3n6d",
            "mezzanineStructure": "DECK_SHEET",
            "mezzanineStructureQuantity": "6454.924",
            "totalMezzanineArea": "171.4",
            "totalMezzanineAreaQuantity": "4756",
            "materialConsumption": "3.5",
            "deckSheetQuantity": "171.4",
            "deckSheetPurchaseQuantity": "188.54",
            "deckSheetQuantityAdditional": "46",
            "shearStudsQuantity": "900",
            "shearStudsPurchaseQuantity": "990",
            "shearStudsQuantityAdditional": "5580",
            "concreteFlashing": "84",
            "concreteFlashingAdditional": "6565",
            "jointBolts": "16 MM DIA HSFG BOLTS",
            "jointBoltsQuantity": "392",
            "foundationBoltsQuantity": "0"
        },
        "stair": {
            "id": "cms3n1d8y002rasv05vzafps4",
            "quantityId": "cms3n14i1002nasv0779n3n6d",
            "totalAreaOfStairQuantity": "5",
            "totalWeightofStringerBeams": "HR_SECTION",
            "totalWeightofStringerBeamsQuantity": "484.094",
            "totalWeightofStringerBeamsAdditional": "456",
            "totalWeightofSteps": "CHQ_PLATE_6MM",
            "totalWeightofStepsQuantity": "242.859",
            "totalWeightofStepsAdditional": "457"
        },
        "additionalBolts": {
            "id": "cms3n1en6002sasv0l1zrtcq7",
            "quantityId": "cms3n14i1002nasv0779n3n6d",
            "jointBolt1": null,
            "jointBolt1Quantity": "0",
            "jointBolt2": null,
            "jointBolt2Quantity": "0",
            "jointBolt3": null,
            "jointBolt3Quantity": "0",
            "purlinBolt": null,
            "purlinBoltQuantity": "0",
            "anchorBoltQuantity": "0",
            "foundationBoltQuantity": "0"
        }
    },
    "amount": {
        "id": "cms3qn9v30000c8v0imjld7am",
        "jobId": "cms3ludmn0001asv0nzn7v5kq",
        "createdAt": "2026-07-27T21:27:49.935Z",
        "updatedAt": "2026-07-31T03:10:02.808Z",
        "calculationVersion": "amount-v1",
        "sourceUpdatedAt": "2026-07-31T03:10:02.806Z",
        "rateVersion": 1,
        "isStale": false,
        "steelStructuresQuantity": "13784.196",
        "steelStructuresFabricationRate": "101",
        "steelStructuresErrectionRate": "10",
        "steelStructuresLoadingRate": "3",
        "steelStructuresFabricationAmount": "1392203.804",
        "steelStructuresErrectionAmount": "137841.961",
        "steelStructuresLoadingAmount": "41352.588",
        "windBracingsQuantity": "142.754",
        "windBracingsFabricationRate": "101",
        "windBracingsErrectionRate": "10",
        "windBracingsLoadingRate": "3",
        "windBracingsFabricationAmount": "14418.19",
        "windBracingsErrectionAmount": "1427.544",
        "windBracingsLoadingAmount": "428.263",
        "sagRodQuantity": "838.549",
        "sagRodFabricationRate": "101",
        "sagRodErrectionRate": "10",
        "sagRodLoadingRate": "3",
        "sagRodFabricationAmount": "84693.448",
        "sagRodErrectionAmount": "8385.49",
        "sagRodLoadingAmount": "2515.647",
        "flangeBraceQuantity": "3471.553",
        "flangeBraceFabricationRate": "101",
        "flangeBraceErrectionRate": "10",
        "flangeBraceLoadingRate": "3",
        "flangeBraceFabricationAmount": "350626.892",
        "flangeBraceErrectionAmount": "34715.534",
        "flangeBraceLoadingAmount": "10414.66",
        "zCPurlinsQuantity": "27999.809",
        "zCPurlinsFabricationRate": "101",
        "zCPurlinsErrectionRate": "10",
        "zCPurlinsLoadingRate": "3",
        "zCPurlinsFabricationAmount": "2827980.729",
        "zCPurlinsErrectionAmount": "279998.092",
        "zCPurlinsLoadingAmount": "83999.428",
        "roofSheetQuantity": "7231.559",
        "roofSheetFabricationRate": "101",
        "roofSheetErrectionRate": "10",
        "roofSheetLoadingRate": "3",
        "roofSheetFabricationAmount": "730387.495",
        "roofSheetErrectionAmount": "72315.594",
        "roofSheetLoadingAmount": "21694.678",
        "claddingSheetQuantity": "116.038",
        "claddingSheetFabricationRate": "101",
        "claddingSheetErrectionRate": "10",
        "claddingSheetLoadingRate": "3",
        "claddingSheetFabricationAmount": "11719.852",
        "claddingSheetErrectionAmount": "1160.381",
        "claddingSheetLoadingAmount": "348.114",
        "canopySheetQuantity": "30",
        "canopySheetFabricationRate": "101",
        "canopySheetErrectionRate": "10",
        "canopySheetLoadingRate": "3",
        "canopySheetFabricationAmount": "3030",
        "canopySheetErrectionAmount": "300",
        "canopySheetLoadingAmount": "90",
        "purlinBoltsQuantity": "13483.201",
        "purlinBoltsFabricationRate": "101",
        "purlinBoltsErrectionRate": "10",
        "purlinBoltsLoadingRate": "3",
        "purlinBoltsFabricationAmount": "1361803.329",
        "purlinBoltsErrectionAmount": "134832.013",
        "purlinBoltsLoadingAmount": "40449.604",
        "jointBoltsQuantity": "2232",
        "jointBoltsFabricationRate": "101",
        "jointBoltsErrectionRate": "10",
        "jointBoltsLoadingRate": "3",
        "jointBoltsFabricationAmount": "225432",
        "jointBoltsErrectionAmount": "22320",
        "jointBoltsLoadingAmount": "6696",
        "foundationBoltsQuantity": "880",
        "foundationBoltsFabricationRate": "101",
        "foundationBoltsErrectionRate": "10",
        "foundationBoltsLoadingRate": "3",
        "foundationBoltsFabricationAmount": "88880",
        "foundationBoltsErrectionAmount": "8800",
        "foundationBoltsLoadingAmount": "2640",
        "anchorBoltsQuantity": "0",
        "anchorBoltsFabricationRate": "101",
        "anchorBoltsErrectionRate": "10",
        "anchorBoltsLoadingRate": "3",
        "anchorBoltsFabricationAmount": "0",
        "anchorBoltsErrectionAmount": "0",
        "anchorBoltsLoadingAmount": "0",
        "ridgeQuantity": "442",
        "ridgeFabricationRate": "101",
        "ridgeErrectionRate": "10",
        "ridgeLoadingRate": "3",
        "ridgeFabricationAmount": "44642",
        "ridgeErrectionAmount": "4420",
        "ridgeLoadingAmount": "1326",
        "gutterQuantity": "321",
        "gutterFabricationRate": "101",
        "gutterErrectionRate": "10",
        "gutterLoadingRate": "3",
        "gutterFabricationAmount": "32421",
        "gutterErrectionAmount": "3210",
        "gutterLoadingAmount": "963",
        "downtakeQuantity": "276.9",
        "downtakeFabricationRate": "101",
        "downtakeErrectionRate": "10",
        "downtakeLoadingRate": "3",
        "downtakeFabricationAmount": "27966.9",
        "downtakeErrectionAmount": "2769",
        "downtakeLoadingAmount": "830.7",
        "dripTrimQuantity": "546",
        "dripTrimFabricationRate": "101",
        "dripTrimErrectionRate": "10",
        "dripTrimLoadingRate": "3",
        "dripTrimFabricationAmount": "55146",
        "dripTrimErrectionAmount": "5460",
        "dripTrimLoadingAmount": "1638",
        "flashingQuantity": "225.335",
        "flashingFabricationRate": "101",
        "flashingErrectionRate": "10",
        "flashingLoadingRate": "3",
        "flashingFabricationAmount": "22758.829",
        "flashingErrectionAmount": "2253.349",
        "flashingLoadingAmount": "676.005",
        "rollingShutterQuantity": "100",
        "rollingShutterFabricationRate": "101",
        "rollingShutterErrectionRate": "10",
        "rollingShutterLoadingRate": "3",
        "rollingShutterFabricationAmount": "10100",
        "rollingShutterErrectionAmount": "1000",
        "rollingShutterLoadingAmount": "300",
        "louversQuantity": "100",
        "louversFabricationRate": "101",
        "louversErrectionRate": "10",
        "louversLoadingRate": "3",
        "louversFabricationAmount": "10100",
        "louversErrectionAmount": "1000",
        "louversLoadingAmount": "300",
        "skyLightQuantity": "100",
        "skyLightFabricationRate": "101",
        "skyLightErrectionRate": "10",
        "skyLightLoadingRate": "3",
        "skyLightFabricationAmount": "10100",
        "skyLightErrectionAmount": "1000",
        "skyLightLoadingAmount": "300",
        "wallLightQuantity": "100",
        "wallLightFabricationRate": "101",
        "wallLightErrectionRate": "10",
        "wallLightLoadingRate": "3",
        "wallLightFabricationAmount": "10100",
        "wallLightErrectionAmount": "1000",
        "wallLightLoadingAmount": "300",
        "roofInsulationQuantity": "7231.559",
        "roofInsulationFabricationRate": "101",
        "roofInsulationErrectionRate": "10",
        "roofInsulationLoadingRate": "3",
        "roofInsulationFabricationAmount": "730387.495",
        "roofInsulationErrectionAmount": "72315.594",
        "roofInsulationLoadingAmount": "21694.678",
        "wallInsulationQuantity": "116.038",
        "wallInsulationFabricationRate": "101",
        "wallInsulationErrectionRate": "10",
        "wallInsulationLoadingRate": "3",
        "wallInsulationFabricationAmount": "11719.852",
        "wallInsulationErrectionAmount": "1160.381",
        "wallInsulationLoadingAmount": "348.114",
        "turboVentilatorsQuantity": "10",
        "turboVentilatorsFabricationRate": "101",
        "turboVentilatorsErrectionRate": "10",
        "turboVentilatorsLoadingRate": "3",
        "turboVentilatorsFabricationAmount": "1010",
        "turboVentilatorsErrectionAmount": "100",
        "turboVentilatorsLoadingAmount": "30",
        "deckingSheetQuantity": "188.54",
        "deckingSheetFabricationRate": "101",
        "deckingSheetErrectionRate": "10",
        "deckingSheetLoadingRate": "3",
        "deckingSheetFabricationAmount": "19042.54",
        "deckingSheetErrectionAmount": "1885.4",
        "deckingSheetLoadingAmount": "565.62",
        "shearStudsQuantity": "900",
        "shearStudsFabricationRate": "101",
        "shearStudsErrectionRate": "10",
        "shearStudsLoadingRate": "3",
        "shearStudsFabricationAmount": "90900",
        "shearStudsErrectionAmount": "9000",
        "shearStudsLoadingAmount": "2700",
        "polyCarbonateSheetQuantity": "0",
        "polyCarbonateSheetFabricationRate": "101",
        "polyCarbonateSheetErrectionRate": "10",
        "polyCarbonateSheetLoadingRate": "3",
        "polyCarbonateSheetFabricationAmount": "0",
        "polyCarbonateSheetErrectionAmount": "0",
        "polyCarbonateSheetLoadingAmount": "0",
        "stair1Quantity": "484.094",
        "stair1FabricationRate": "101",
        "stair1ErrectionRate": "10",
        "stair1LoadingRate": "3",
        "stair1FabricationAmount": "48893.478",
        "stair1ErrectionAmount": "4840.938",
        "stair1LoadingAmount": "1452.282",
        "stair2Quantity": "242.859",
        "stair2FabricationRate": "101",
        "stair2ErrectionRate": "10",
        "stair2LoadingRate": "3",
        "stair2FabricationAmount": "24528.797",
        "stair2ErrectionAmount": "2428.594",
        "stair2LoadingAmount": "728.578",
        "handrailQuantity": "250",
        "handrailFabricationRate": "101",
        "handrailErrectionRate": "10",
        "handrailLoadingRate": "3",
        "handrailFabricationAmount": "25250",
        "handrailErrectionAmount": "2500",
        "handrailLoadingAmount": "750",
        "canopySideCoveringQuantity": "9.5",
        "canopySideCoveringFabricationRate": "101",
        "canopySideCoveringErrectionRate": "10",
        "canopySideCoveringLoadingRate": "3",
        "canopySideCoveringFabricationAmount": "959.5",
        "canopySideCoveringErrectionAmount": "95",
        "canopySideCoveringLoadingAmount": "28.5",
        "doorsQuantity": "21",
        "doorsFabricationRate": "101",
        "doorsErrectionRate": "10",
        "doorsLoadingRate": "3",
        "doorsFabricationAmount": "2121",
        "doorsErrectionAmount": "210",
        "doorsLoadingAmount": "63",
        "windowsQuantity": "18",
        "windowsFabricationRate": "101",
        "windowsErrectionRate": "10",
        "windowsLoadingRate": "3",
        "windowsFabricationAmount": "1818",
        "windowsErrectionAmount": "180",
        "windowsLoadingAmount": "54",
        "fasciaStructureQuantity": "556.292",
        "fasciaStructureFabricationRate": "101",
        "fasciaStructureErrectionRate": "10",
        "fasciaStructureLoadingRate": "3",
        "fasciaStructureFabricationAmount": "56185.492",
        "fasciaStructureErrectionAmount": "5562.92",
        "fasciaStructureLoadingAmount": "1668.876",
        "fasciaCoveringSheetBoardQuantity": "51.7",
        "fasciaCoveringSheetBoardFabricationRate": "101",
        "fasciaCoveringSheetBoardErrectionRate": "10",
        "fasciaCoveringSheetBoardLoadingRate": "3",
        "fasciaCoveringSheetBoardFabricationAmount": "5221.7",
        "fasciaCoveringSheetBoardErrectionAmount": "517",
        "fasciaCoveringSheetBoardLoadingAmount": "155.1",
        "internalPartitionsQuantity": "0",
        "internalPartitionsFabricationRate": "101",
        "internalPartitionsErrectionRate": "10",
        "internalPartitionsLoadingRate": "3",
        "internalPartitionsFabricationAmount": "0",
        "internalPartitionsErrectionAmount": "0",
        "internalPartitionsLoadingAmount": "0"
    }
}