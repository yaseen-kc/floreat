/**
 * Joint bolt derivation. Authoritative business rules for the interdependent
 * bolt specifications: the backend applies them on write from validated inputs;
 * the frontend reuses them for live preview and to render dependent fields
 * read-only (the client value is never trusted server-side).
 *
 * Rules:
 *  1. Every roof & mezzanine joint's `boltDiameter` follows Roof Joint A.
 *  2. Roof Joint E `numberOfBolts` follows Roof Joint D.
 *  3. Roof Joint F `numberOfBolts` is fixed at 4; J is fixed at 8.
 *  4. Mezzanine Joint N `numberOfBolts` follows M.
 *  5. Mezzanine Joint R `numberOfBolts` follows Q.
 *
 * A blank source (e.g. Joint A has no diameter) leaves the dependents blank
 * (`undefined`) so they drop from a payload — matching `deriveSideColumnsWidthHeight`.
 */

/** Roof Joint whose `boltDiameter` every roof & mezzanine joint follows. */
export const BOLT_DIAMETER_SOURCE = 'A'

/** Roof joints with a fixed, non-editable `numberOfBolts`. */
export const FIXED_ROOF_BOLT_COUNTS: Record<string, number> = { F: 4, J: 8 }

/** Roof joints whose `numberOfBolts` mirrors another roof joint's (dependent → source). */
export const ROOF_COUNT_MIRRORS: Record<string, string> = { E: 'D' }

/** Mezzanine joints whose `numberOfBolts` mirrors another mezzanine joint's (dependent → source). */
export const MEZZ_COUNT_MIRRORS: Record<string, string> = { N: 'M', R: 'Q' }

/** A roof joint bolt row (framework-free shape; matches `jointBoltRoofItemSchema`). */
export interface RoofBoltRow {
  roofJointId: string
  boltDiameter?: number
  numberOfBolts?: number
}

/** A mezzanine joint bolt row (framework-free shape; matches `jointBoltMezzanineItemSchema`). */
export interface MezzanineBoltRow {
  mezzanineJointId: string
  boltDiameter?: number
  numberOfBolts?: number
}

/** The derived roof + mezzanine bolt arrays returned by {@link deriveJointBolts}. */
export interface DerivedJointBolts {
  jointBoltRoof: RoofBoltRow[]
  jointBoltMezzanine: MezzanineBoltRow[]
}

/**
 * Applies the five joint bolt derivation rules to the (possibly sparse) roof and
 * mezzanine bolt arrays, returning new arrays with the derived fields overwritten.
 *
 * - `boltDiameter` on every roof & mezzanine row is set to Roof Joint A's diameter
 *   (`undefined` when A is blank, which clears the dependents).
 * - Roof E count mirrors D; F is fixed at 4; J is fixed at 8.
 * - Mezzanine N count mirrors M; R mirrors Q.
 * - Fixed rows (F, J) are always ensured to exist; mirror rows (E, N, R) are
 *   ensured only when their source count is defined.
 *
 * Idempotent: applying it to its own output yields the same result.
 */
export function deriveJointBolts(
  jointBoltRoof: RoofBoltRow[],
  jointBoltMezzanine: MezzanineBoltRow[],
): DerivedJointBolts {
  const roofById = new Map(jointBoltRoof.map((r) => [r.roofJointId, r]))
  const mezzById = new Map(jointBoltMezzanine.map((r) => [r.mezzanineJointId, r]))
  const aDiameter = roofById.get(BOLT_DIAMETER_SOURCE)?.boltDiameter
  const roofCount = (id: string) => roofById.get(id)?.numberOfBolts
  const mezzCount = (id: string) => mezzById.get(id)?.numberOfBolts

  // ── Roof rows: sync diameter to A; apply fixed / mirrored counts ──
  const roofResult: RoofBoltRow[] = jointBoltRoof.map((row) => {
    const out: RoofBoltRow = { ...row, boltDiameter: aDiameter }
    if (row.roofJointId in FIXED_ROOF_BOLT_COUNTS) {
      out.numberOfBolts = FIXED_ROOF_BOLT_COUNTS[row.roofJointId]
    } else if (row.roofJointId in ROOF_COUNT_MIRRORS) {
      out.numberOfBolts = roofCount(ROOF_COUNT_MIRRORS[row.roofJointId])
    }
    return out
  })
  const presentRoof = new Set(roofResult.map((r) => r.roofJointId))
  // F / J always carry their fixed count.
  for (const [id, count] of Object.entries(FIXED_ROOF_BOLT_COUNTS)) {
    if (!presentRoof.has(id)) roofResult.push({ roofJointId: id, boltDiameter: aDiameter, numberOfBolts: count })
  }
  // E exists when its source (D) has a count.
  for (const [id, srcId] of Object.entries(ROOF_COUNT_MIRRORS)) {
    const c = roofCount(srcId)
    if (c !== undefined && !presentRoof.has(id)) {
      roofResult.push({ roofJointId: id, boltDiameter: aDiameter, numberOfBolts: c })
    }
  }

  // ── Mezzanine rows: sync diameter to A; apply mirrored counts ──
  const mezzResult: MezzanineBoltRow[] = jointBoltMezzanine.map((row) => {
    const out: MezzanineBoltRow = { ...row, boltDiameter: aDiameter }
    if (row.mezzanineJointId in MEZZ_COUNT_MIRRORS) {
      out.numberOfBolts = mezzCount(MEZZ_COUNT_MIRRORS[row.mezzanineJointId])
    }
    return out
  })
  const presentMezz = new Set(mezzResult.map((r) => r.mezzanineJointId))
  // N / R exist when their source (M / Q) has a count.
  for (const [id, srcId] of Object.entries(MEZZ_COUNT_MIRRORS)) {
    const c = mezzCount(srcId)
    if (c !== undefined && !presentMezz.has(id)) {
      mezzResult.push({ mezzanineJointId: id, boltDiameter: aDiameter, numberOfBolts: c })
    }
  }

  return { jointBoltRoof: roofResult, jointBoltMezzanine: mezzResult }
}
