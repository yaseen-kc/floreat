import { useQuotationStore } from '@/stores/quotation-store'
import type { LoadDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Gauge } from 'lucide-react'

/** A numeric Load field — its store key (excluding the enum unit), label and unit suffix. */
interface LoadNumberField {
  name: Exclude<keyof LoadDraft, 'approvalDrawingsUnit'>
  label: string
  unit: string
  step?: number
}

/** The 12 structural load fields (KN/M², except the two wind fields in KMPH). */
const LOAD_DETAIL_FIELDS: LoadNumberField[] = [
  { name: 'deadLoadOnRoofRafters', label: 'Dead Load on Roof Rafters', unit: 'KN/M²' },
  { name: 'liveLoadOnRoofRafters', label: 'Live Load on Roof Rafters', unit: 'KN/M²' },
  { name: 'collateralLoadOnRoofRafters', label: 'Collateral Load on Roof Rafters', unit: 'KN/M²' },
  { name: 'windLoadOnRoofRaftersUpward', label: 'Wind Load on Roof Rafters (Upward)', unit: 'KMPH' },
  { name: 'windLoadHorizontal', label: 'Wind Load (Horizontal)', unit: 'KMPH' },
  { name: 'deadLoadOnRoofFloor', label: 'Dead Load on Roof Floor', unit: 'KN/M²' },
  { name: 'liveLoadOnRoofFloor', label: 'Live Load on Roof Floor', unit: 'KN/M²' },
  { name: 'floorDeadLoad', label: 'Floor Dead Load', unit: 'KN/M²' },
  { name: 'floorFinishLoad', label: 'Floor Finish Load', unit: 'KN/M²' },
  { name: 'floorLiveLoad', label: 'Floor Live Load', unit: 'KN/M²' },
  { name: 'snowLoad', label: 'Snow Load', unit: 'KN/M²' },
  { name: 'earthquakeLoad', label: 'Earthquake Load', unit: 'KN' },
]

/** The structural design loads card for Step 7 — 12 optional numeric fields. */
export function LoadDetails() {
  const { load, setLoad } = useQuotationStore(
    useShallow((s) => ({ load: s.load, setLoad: s.setLoad })),
  )

  return (
    <SectionCard icon={<Gauge className="w-3.5 h-3.5" />} title="Load Details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 desktop:gap-6">
        {LOAD_DETAIL_FIELDS.map((f) => (
          <NumberField
            key={f.name}
            label={f.label}
            value={load[f.name]}
            unit={f.unit}
            step={f.step}
            required={false}
            error={false}
            onChange={(v) => setLoad({ [f.name]: v } as Partial<LoadDraft>)}
          />
        ))}
      </div>
    </SectionCard>
  )
}
