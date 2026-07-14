import type { Mezzanine } from '@/api/quotation/mezz/getMezz'
import type {
  MezzanineDraft,
  MezzanineFloorDraft,
  MezzanineExtensionDraft,
} from '@/stores/quotation-store'

import { num, int } from '@floreat/shared/units'

/** The mapped mezzanine draft. */
export type HydratedMezzanine = MezzanineDraft

/**
 * Maps a `Mezzanine` API response (Decimal columns as strings, optionals as
 * `null`) into a Step 3 {@link MezzanineDraft}.
 */
export function mapMezzanineResponseToDraft(m: Mezzanine): HydratedMezzanine {
  const floors: MezzanineFloorDraft[] = m.floors.map((f) => ({
    code: f.code ?? undefined,
    floor: f.floor ?? undefined,
    type: f.type ?? undefined,
    heightFrom: f.heightFrom ?? undefined,
    thicknessMm: num(f.thicknessMm),
    lengthM: num(f.lengthM),
    widthM: num(f.widthM),
    heightM: num(f.heightM),
    materialConsumptionKgPerSqft: num(f.materialConsumptionKgPerSqft),
    beamsMidPrimary: int(f.beamsMidPrimary),
    beamsEndPrimary: int(f.beamsEndPrimary),
    beamsSecondary: int(f.beamsSecondary),
    jointsMidPrimary: int(f.jointsMidPrimary),
    jointsEndPrimary: int(f.jointsEndPrimary),
    internalColumnsMidPrimary: int(f.internalColumnsMidPrimary),
    internalColumnsEndPrimary: int(f.internalColumnsEndPrimary),
  }))

  const extensions: MezzanineExtensionDraft[] = m.extensions.map((e) => ({
    type: e.type ?? undefined,
    heightFrom: e.heightFrom ?? undefined,
    typicalTo: e.typicalTo ?? undefined,
    thicknessMm: num(e.thicknessMm),
    lengthM: num(e.lengthM),
    widthM: num(e.widthM),
    heightM: num(e.heightM),
    beamsMidPrimary: int(e.beamsMidPrimary),
    beamsEndPrimary: int(e.beamsEndPrimary),
    beamsSecondary: int(e.beamsSecondary),
    jointsMidPrimary: int(e.jointsMidPrimary),
    jointsEndPrimary: int(e.jointsEndPrimary),
    extendedColumnsMidPrimary: int(e.extendedColumnsMidPrimary),
    extendedColumnsEndPrimary: int(e.extendedColumnsEndPrimary),
  }))

  return { floors, extensions }
}
