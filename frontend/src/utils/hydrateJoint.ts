import type { Joint } from '@/api/quotation/joint/getJoint'
import type {
  JointDraft,
  JointBoltRoofDraft,
  JointBoltMezzanineDraft,
  FoundationBoltRoofDraft,
} from '@/stores/quotation-store'
import {
  roofJointIdEnum,
  mezzanineJointIdEnum,
  foundationBoltJointIdEnum,
} from '@/schemas/joint.schema'

import { num, int } from '@floreat/shared/units'

/**
 * Merges the server's (sparse) bolt rows into the full, enum-seeded row set so
 * every joint code keeps a stable, addressable input row. Starts from one blank
 * row per enum member (id-only) and overlays any matching server row's values.
 */
function mergeById<Id extends string, Row extends Record<string, unknown>>(
  ids: readonly Id[],
  idKey: keyof Row,
  blank: (id: Id) => Row,
  serverRows: Row[],
): Row[] {
  const byId = new Map(serverRows.map((r) => [r[idKey] as Id, r]))
  return ids.map((id) => byId.get(id) ?? blank(id))
}

/**
 * Maps a `Joint` API response (Decimal columns as strings, optionals as `null`)
 * into a Step 8 {@link JointDraft}. Decimal strings become numbers, `null`
 * becomes `undefined`, and the server-only per-row `id`/`jointId` fields are
 * dropped. The three inline arrays are merged into the full enum-seeded row set
 * so untouched joint codes still render as blank rows.
 */
export function mapJointResponseToDraft(j: Joint): JointDraft {
  const jointBoltRoof = mergeById<string, JointBoltRoofDraft>(
    roofJointIdEnum.options,
    'roofJointId',
    (roofJointId) => ({ roofJointId } as JointBoltRoofDraft),
    j.jointBoltRoof.map((r) => ({
      roofJointId: r.roofJointId,
      boltDiameter: num(r.boltDiameter),
      numberOfBolts: int(r.numberOfBolts),
    })),
  )

  const jointBoltMezzanine = mergeById<string, JointBoltMezzanineDraft>(
    mezzanineJointIdEnum.options,
    'mezzanineJointId',
    (mezzanineJointId) => ({ mezzanineJointId } as JointBoltMezzanineDraft),
    j.jointBoltMezzanine.map((r) => ({
      mezzanineJointId: r.mezzanineJointId,
      boltDiameter: num(r.boltDiameter),
      numberOfBolts: int(r.numberOfBolts),
    })),
  )

  const foundationBoltRoof = mergeById<string, FoundationBoltRoofDraft>(
    foundationBoltJointIdEnum.options,
    'foundationJointId',
    (foundationJointId) => ({ foundationJointId } as FoundationBoltRoofDraft),
    j.foundationBoltRoof.map((r) => ({
      foundationJointId: r.foundationJointId,
      boltDiameter: num(r.boltDiameter),
      numberOfBolts: int(r.numberOfBolts),
    })),
  )

  return {
    // ── Secondary beams ──
    secondaryBeamsBoltType: j.secondaryBeamsBoltType ?? undefined,
    secondaryBeamsBoltDiameter: num(j.secondaryBeamsBoltDiameter),
    secondaryBeamsNumberOfBolts: int(j.secondaryBeamsNumberOfBolts),

    // ── Purlins & flange brace ──
    purlinFlangeBraceBoltType: j.purlinFlangeBraceBoltType ?? undefined,
    purlinFlangeBraceBoltDiameter: num(j.purlinFlangeBraceBoltDiameter),
    purlinFlangeBraceNumberOfBolts: int(j.purlinFlangeBraceNumberOfBolts),

    // ── Cladding purlins ──
    claddingPurlinsBoltType: j.claddingPurlinsBoltType ?? undefined,
    claddingPurlinsBoltDiameter: num(j.claddingPurlinsBoltDiameter),
    claddingPurlinsNumberOfBolts: int(j.claddingPurlinsNumberOfBolts),

    // ── Canopy ──
    canopyBoltType: j.canopyBoltType ?? undefined,
    canopyBoltDiameter: num(j.canopyBoltDiameter),
    canopyNumberOfBolts: int(j.canopyNumberOfBolts),

    // ── Inline arrays (full enum-seeded set, server values overlaid) ──
    jointBoltRoof,
    jointBoltMezzanine,
    foundationBoltRoof,
  }
}
