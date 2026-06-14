import type { Roof } from '@/api/quotation/roof/getRoof'
import type { RoofDraft, RoofSectionsEnabled, RoofSectionKey } from '@/stores/quotation-store'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'

/** Prisma `Decimal` columns serialise as strings (or null) — coerce to number. */
const num = (v: string | null): number | undefined => (v == null ? undefined : Number(v))

/** `null` optional integers become `undefined` so they stay out of the payload. */
const int = (v: number | null): number | undefined => (v == null ? undefined : v)

/** The mapped roof draft plus the section toggles derived from it. */
export interface HydratedRoof {
  roof: RoofDraft
  roofSectionsEnabled: RoofSectionsEnabled
}

/**
 * Maps a `Roof` API response (Decimal columns as strings, optionals as `null`)
 * into a Step 2 {@link RoofDraft} and the matching section toggles. A section
 * is enabled when any of its fields came back populated (or, for sidewalls,
 * when at least one row exists).
 */
export function mapRoofResponseToDraft(r: Roof): HydratedRoof {
  const roof: RoofDraft = {
    // ── Required core dimensions ──
    buildingOverallLength: Number(r.buildingOverallLength),
    buildingOverallWidth: Number(r.buildingOverallWidth),
    eaveHeight: Number(r.eaveHeight),
    roofSlope: Number(r.roofSlope),
    mainRoofFrames: r.mainRoofFrames,
    endRoofFrames: r.endRoofFrames,
    roofPurlinSpacing: Number(r.roofPurlinSpacing),
    claddingPurlins: r.claddingPurlins,
    internalColumnsForMainRoofFrames: r.internalColumnsForMainRoofFrames,
    internalColumnsForEndRoofFrames: r.internalColumnsForEndRoofFrames,
    roofFrameBaseFixing: r.roofFrameBaseFixing,

    // ── Members ──
    columnSegmentsInMainFrame: int(r.columnSegmentsInMainFrame),
    raftersInOneHalfOfMainFrame: int(r.raftersInOneHalfOfMainFrame),
    columnSegmentsInEndFrame: int(r.columnSegmentsInEndFrame),
    raftersInOneHalfOfEndFrame: int(r.raftersInOneHalfOfEndFrame),
    endFrameHorizontalTieBeam: int(r.endFrameHorizontalTieBeam),

    // ── Purlins ──
    roofPurlinType: r.roofPurlinType ?? undefined,
    roofPurlinDepth: num(r.roofPurlinDepth),
    roofPurlinUnitWeight: num(r.roofPurlinUnitWeight),
    claddingPurlinType: r.claddingPurlinType ?? undefined,
    claddingPurlinDepth: num(r.claddingPurlinDepth),
    claddingPurlinUnitWeight: num(r.claddingPurlinUnitWeight),

    // ── Coverings ──
    roofCoveringType: r.roofCoveringType ?? undefined,
    roofCoveringThickness: num(r.roofCoveringThickness),
    claddingCoveringType: r.claddingCoveringType ?? undefined,
    claddingCoveringThickness: num(r.claddingCoveringThickness),
    roofAreaDeduction: num(r.roofAreaDeduction),

    // ── Flange brace ──
    roofFlangeBraceAverageLength: num(r.roofFlangeBraceAverageLength),
    claddingFlangeBraceAverageLength: num(r.claddingFlangeBraceAverageLength),
    endFrameFlangeBraceAverageLength: num(r.endFrameFlangeBraceAverageLength),

    // ── Polycarbonate ──
    polycarbonateRoofLength: num(r.polycarbonateRoofLength),
    polycarbonateRoofWidth: num(r.polycarbonateRoofWidth),
    polycarbonateRoofCount: int(r.polycarbonateRoofCount),

    // ── Wind bracing ──
    roofWindBracingSegmentsInOneHalf: int(r.roofWindBracingSegmentsInOneHalf),
    columnWindBracingSegments: int(r.columnWindBracingSegments),
    roofWindBracingProvidedBays: int(r.roofWindBracingProvidedBays),
    columnWindBracingProvidedBays: int(r.columnWindBracingProvidedBays),
    windBracingColumnHeight: num(r.windBracingColumnHeight),
    windBracingUnitWeight: num(r.windBracingUnitWeight),
    roofWindBracingBaySpacing: num(r.roofWindBracingBaySpacing),
    columnWindBracingBaySpacing: num(r.columnWindBracingBaySpacing),
    roofWindBracingLength: num(r.roofWindBracingLength),
    columnWindBracingLength: num(r.columnWindBracingLength),
    windBracingType: r.windBracingType ?? undefined,

    // ── Cladding openings ──
    frontCladdingOpeningArea: num(r.frontCladdingOpeningArea),
    backCladdingOpeningArea: num(r.backCladdingOpeningArea),
    rightCladdingOpeningArea: num(r.rightCladdingOpeningArea),
    leftCladdingOpeningArea: num(r.leftCladdingOpeningArea),

    // ── Fascia board ──
    fasciaBoardArea: num(r.fasciaBoardArea),
    fasciaMaterialWeightPerSqft: num(r.fasciaMaterialWeightPerSqft),

    // ── Side extension ──
    roofExtensionWidthHeight: num(r.roofExtensionWidthHeight),
    roofExtensionMidFrameCount: int(r.roofExtensionMidFrameCount),
    roofExtensionEndFrameCount: int(r.roofExtensionEndFrameCount),
    claddingExtensionWidthHeight: num(r.claddingExtensionWidthHeight),
    claddingExtensionMidFrameCount: int(r.claddingExtensionMidFrameCount),
    claddingExtensionEndFrameCount: int(r.claddingExtensionEndFrameCount),
    sideColumnsWidthHeight: num(r.sideColumnsWidthHeight),
    sideColumnsMidFrameCount: int(r.sideColumnsMidFrameCount),
    sideColumnsEndFrameCount: int(r.sideColumnsEndFrameCount),

    // ── Material grade ──
    gradeOfPlateMaterial: r.gradeOfPlateMaterial ?? undefined,

    // ── Material consumption ──
    materialConsumptionExcludingPurlin: num(r.materialConsumptionExcludingPurlin),

    // ── SAG rod ──
    DiaOfRoofSagRod: num(r.DiaOfRoofSagRod),
    DiaOfCladdingSagRod: num(r.DiaOfCladdingSagRod),

    // ── Inline sidewalls ──
    sidewalls: r.sidewalls.map((s) => ({
      side: s.side,
      wallType: s.wallType,
      thickness: Number(s.thickness),
      height: Number(s.height),
    })),
  }

  const record = roof as Record<string, unknown>
  const keys = Object.keys(ROOF_SECTION_FIELDS) as RoofSectionKey[]
  const roofSectionsEnabled = keys.reduce((acc, key) => {
    acc[key] =
      key === 'sidewalls'
        ? (roof.sidewalls?.length ?? 0) > 0
        : ROOF_SECTION_FIELDS[key].some((field) => record[field] !== undefined)
    return acc
  }, {} as RoofSectionsEnabled)

  return { roof, roofSectionsEnabled }
}
