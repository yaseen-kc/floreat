import type { Accessories } from '@/api/quotation/accessories/getAccessories'
import type {
  AccessoriesDraft,
} from '@/stores/quotation-store'

import { num, int } from '@floreat/shared/units'

/**
 * Maps an `Accessories` API response (Decimal columns as strings, optionals as
 * `null`) into a Step 6 {@link AccessoriesDraft}. Decimal strings become
 * numbers, `null` becomes `undefined`, and the server-only per-item `quantity`
 * / `id` fields are dropped. The six `*Quantity` overrides and their `*Manual`
 * flags are carried through so a manual override rehydrates as such.
 */
export function mapAccessoriesResponseToDraft(a: Accessories): AccessoriesDraft {

  return {
    // ── Gutter ──
    gutterType: a.gutterType ?? undefined,
    gutterSize: a.gutterSize ?? undefined,
    gutterQuantity: num(a.gutterQuantity),
    gutterQuantityManual: a.gutterQuantityManual ?? undefined,

    // ── Down Take ──
    downTakeType: a.downTakeType ?? undefined,
    downTakeSize: a.downTakeSize ?? undefined,
    downTakeQuantity: num(a.downTakeQuantity),
    downTakeQuantityManual: a.downTakeQuantityManual ?? undefined,

    // ── Drip Trim ──
    dripTrimType: a.dripTrimType ?? undefined,
    dripTrimThickness: a.dripTrimThickness ?? undefined,
    dripTrimQuantity: num(a.dripTrimQuantity),
    dripTrimQuantityManual: a.dripTrimQuantityManual ?? undefined,

    // ── Gable End Flashing ──
    gableEndFlashingType: a.gableEndFlashingType ?? undefined,
    gableEndFlashingThickness: a.gableEndFlashingThickness ?? undefined,
    gableEndFlashingQuantity: num(a.gableEndFlashingQuantity),
    gableEndFlashingQuantityManual: a.gableEndFlashingQuantityManual ?? undefined,

    // ── Corner Flash ──
    cornerFlashType: a.cornerFlashType ?? undefined,
    cornerFlashThickness: a.cornerFlashThickness ?? undefined,
    cornerFlashQuantity: num(a.cornerFlashQuantity),
    cornerFlashQuantityManual: a.cornerFlashQuantityManual ?? undefined,

    // ── Ridge ──
    ridgeType: a.ridgeType ?? undefined,
    ridgeThickness: a.ridgeThickness ?? undefined,
    ridgeQuantity: num(a.ridgeQuantity),
    ridgeQuantityManual: a.ridgeQuantityManual ?? undefined,

    // ── Partition ──
    partitionType: a.partitionType ?? undefined,
    partitionThickness: a.partitionThickness ?? undefined,
    partitionQuantity: int(a.partitionQuantity),

    // ── Openings ──
    rollingShutterLength: num(a.rollingShutterLength),
    rollingShutterWidth: num(a.rollingShutterWidth),
    rollingShutterNos: int(a.rollingShutterNos),
    rollingShutterQuantity: num(a.rollingShutterQuantity),

    louverLength: num(a.louverLength),
    louverWidth: num(a.louverWidth),
    louverNos: int(a.louverNos),
    louverQuantity: num(a.louverQuantity),

    skyLightLength: num(a.skyLightLength),
    skyLightWidth: num(a.skyLightWidth),
    skyLightNos: int(a.skyLightNos),
    skyLightQuantity: num(a.skyLightQuantity),

    wallLightLength: num(a.wallLightLength),
    wallLightWidth: num(a.wallLightWidth),
    wallLightNos: int(a.wallLightNos),
    wallLightQuantity: num(a.wallLightQuantity),

    // ── Insulation ──
    roofInsulationType: a.roofInsulationType ?? undefined,
    wallInsulationType: a.wallInsulationType ?? undefined,

    // ── Turbo Ventilator ──
    turboVentilatorDiameter: a.turboVentilatorDiameter ?? undefined,
    turboVentilatorNos: int(a.turboVentilatorNos),

    // ── Handrail ──
    handrailWeightKg: num(a.handrailWeightKg),

    // ── Feature toggles ──
    deckSheetFlashingEnabled: a.deckSheetFlashingEnabled ?? undefined,
    gantryGirderEnabled: a.gantryGirderEnabled ?? undefined,
    liftStructureEnabled: a.liftStructureEnabled ?? undefined,

    // ── Paint & Primer: Frames ──
    framesPrimerCoats: int(a.framesPrimerCoats),
    framesPrimerType: a.framesPrimerType ?? undefined,
    framesPaintCoats: int(a.framesPaintCoats),
    framesPaintType: a.framesPaintType ?? undefined,

    // ── Paint & Primer: Purlins & Girts ──
    purlinsGirtsFinish: a.purlinsGirtsFinish ?? undefined,
    purlinsGirtsGsm: int(a.purlinsGirtsGsm),
    purlinsGirtsPaint: a.purlinsGirtsPaint ?? undefined,

    // ── Paint & Primer: Foundation Bolt ──
    foundationBoltFinish: a.foundationBoltFinish ?? undefined,

    // ── Doors, Windows, Folded Plates ──
    doorHeight: num(a.doorHeight),
    doorWidth: num(a.doorWidth),
    doorNos: int(a.doorNos),

    windowHeight: num(a.windowHeight),
    windowWidth: num(a.windowWidth),
    windowNos: int(a.windowNos),

    foldedPlateLength: num(a.foldedPlateLength),
    foldedPlateWidth: num(a.foldedPlateWidth),
    foldedPlateNos: int(a.foldedPlateNos),
  }
}
