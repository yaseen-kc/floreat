import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { ApiError } from '@/lib/api'
import { useQuantity } from '@/api/quotation/quantity/getQuantity'
import { calculateQuantityPebRoof } from '@floreat/shared/calc'
import { Spinner } from '@/components/ui/spinner'

import { PebRoofQuantityTable } from './PebRoofQuantityTable'
import { CladdingQuantityTable } from './CladdingQuantityTable'
import { CanopyQuantityTable } from './CanopyQuantityTable'
import { AccessoriesQuantityTable } from './AccessoriesQuantityTable'
import { MezzanineQuantityTable } from './MezzanineQuantityTable'
import { StairQuantityTable } from './StairQuantityTable'
import { AdditionalBoltsQuantityTable } from './AdditionalBoltsQuantityTable'

export function QuantityTable() {
  const { jobId, roof, joint } = useQuotationStore(useShallow((s) => ({
    jobId: s.jobId,
    roof: s.roof,
    joint: s.joint
  })))
  const { data: quantity, isLoading, isError, error } = useQuantity(jobId ?? '')
  const notFound = error instanceof ApiError && error.status === 404

  const pebRoofCalc = calculateQuantityPebRoof({
    roof: {
      buildingOverallLength: roof.buildingOverallLength ?? 0,
      buildingOverallWidth: roof.buildingOverallWidth ?? 0,
      roofSlope: roof.roofSlope ?? 0,
      materialConsumptionExcludingPurlin: roof.materialConsumptionExcludingPurlin ?? 0,
      mainRoofFrames: roof.mainRoofFrames ?? 0,
      endRoofFrames: roof.endRoofFrames ?? 0,
      roofPurlinSpacing: roof.roofPurlinSpacing ?? 0,
      roofPurlinUnitWeight: roof.roofPurlinUnitWeight ?? 0,
      roofExtensionWidthHeight: roof.roofExtensionWidthHeight ?? 0,
      roofExtensionEndFrameCount: roof.roofExtensionEndFrameCount ?? 0,
      roofExtensionMidFrameCount: roof.roofExtensionMidFrameCount ?? 0,
      roofAreaDeduction: roof.roofAreaDeduction ?? 0,
      polycarbonateRoofLength: roof.polycarbonateRoofLength ?? 0,
      polycarbonateRoofWidth: roof.polycarbonateRoofWidth ?? 0,
      polycarbonateRoofCount: roof.polycarbonateRoofCount ?? 0,
      gradeOfPlateMaterial: roof.gradeOfPlateMaterial ?? '',
      roofPurlinType: roof.roofPurlinType ?? '',
      roofPurlinDepth: roof.roofPurlinDepth ?? 0,
      roofCoveringThickness: roof.roofCoveringThickness ?? 0,
      roofCoveringType: roof.roofCoveringType ?? '',
      roofWindBracingSegmentsInOneHalf: roof.roofWindBracingSegmentsInOneHalf ?? 0,
      roofWindBracingProvidedBays: roof.roofWindBracingProvidedBays ?? 0,
      roofWindBracingLength: roof.roofWindBracingLength ?? 0,
      windBracingUnitWeight: roof.windBracingUnitWeight ?? 0,
      diaOfRoofSagRod: roof.diaOfRoofSagRod ?? 0,
      roofFlangeBraceAverageLength: roof.roofFlangeBraceAverageLength ?? 0,
      endFrameFlangeBraceAverageLength: roof.endFrameFlangeBraceAverageLength ?? 0,
    },
    joint: {
      purlinFlangeBraceBoltDiameter: joint.purlinFlangeBraceBoltDiameter ?? 0,
      purlinFlangeBraceNumberOfBolts: joint.purlinFlangeBraceNumberOfBolts ?? 0,
    },
    jointBoltRoof: {
      A: { numberOfBolts: joint.jointBoltRoof.find((j) => j.roofJointId === 'A')?.numberOfBolts ?? 0 }
    },
    foundationBoltRoof: {
      boltDiameter11: joint.foundationBoltRoof[0]?.boltDiameter ?? 0
    }
  })

  if (!jobId) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No active job. Start a quotation to view quantities.</p>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
        <Spinner /> Loading quantities…
      </div>
    )
  }

  if (isError && !notFound) {
    return <p className="py-14 text-center text-sm text-destructive">Couldn't load quantity data.</p>
  }

  const sd = (section: unknown) =>
    section as Record<string, string | number | boolean | null | undefined> | null

  return (
    <div className="space-y-6">
      <PebRoofQuantityTable jobId={jobId} initialData={sd(quantity?.pebRoof ?? null)} calculatedData={pebRoofCalc as unknown as Record<string, string | number>} />
      <CladdingQuantityTable jobId={jobId} initialData={sd(quantity?.cladding ?? null)} />
      <CanopyQuantityTable jobId={jobId} initialData={sd(quantity?.canopy ?? null)} />
      <AccessoriesQuantityTable jobId={jobId} initialData={sd(quantity?.accessories ?? null)} />
      <MezzanineQuantityTable jobId={jobId} initialData={sd(quantity?.mezzanine ?? null)} />
      <StairQuantityTable jobId={jobId} initialData={sd(quantity?.stair ?? null)} />
      <AdditionalBoltsQuantityTable jobId={jobId} initialData={sd(quantity?.additionalBolts ?? null)} />
    </div>
  )
}
