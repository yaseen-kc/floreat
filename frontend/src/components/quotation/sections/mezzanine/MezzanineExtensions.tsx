import { useQuotationStore } from '@/stores/quotation-store'
import type { MezzanineExtensionDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Button } from '@/components/ui/button'
import { StretchHorizontal, Plus } from 'lucide-react'
import { RowCard, type RowGroup } from '@/components/quotation/shared/RowCard'
import {
  MEZZANINE_TYPE_OPTIONS,
  MEZZANINE_FLOOR_LEVEL_OPTIONS,
  MEZZANINE_HEIGHT_FROM_OPTIONS,
} from './mezzanineOptions'

/** Grouped field layout for a mezzanine floor-extension row. */
const EXTENSION_GROUPS: RowGroup[] = [
  {
    title: 'Classification',
    fields: [
      { kind: 'select', name: 'type', label: 'Type', options: MEZZANINE_TYPE_OPTIONS },
      { kind: 'select', name: 'heightFrom', label: 'Height From', options: MEZZANINE_HEIGHT_FROM_OPTIONS },
      { kind: 'select', name: 'typicalTo', label: 'Typical To', options: MEZZANINE_FLOOR_LEVEL_OPTIONS },
    ],
  },
  {
    title: 'Dimensions',
    fields: [
      { kind: 'number', name: 'thicknessMm', label: 'Thickness', unit: 'mm' },
      { kind: 'number', name: 'lengthM', label: 'Length', unit: 'm' },
      { kind: 'number', name: 'widthM', label: 'Width', unit: 'm' },
      { kind: 'number', name: 'heightM', label: 'Height', unit: 'm' },
    ],
  },
  {
    title: 'Beams',
    fields: [
      { kind: 'number', name: 'beamsMidPrimary', label: 'Mid Primary', unit: 'count', step: 1 },
      { kind: 'number', name: 'beamsEndPrimary', label: 'End Primary', unit: 'count', step: 1 },
      { kind: 'number', name: 'beamsSecondary', label: 'Secondary', unit: 'count', step: 1 },
    ],
  },
  {
    title: 'Joints in Beams',
    fields: [
      { kind: 'number', name: 'jointsMidPrimary', label: 'Mid Primary', unit: 'count', step: 1 },
      { kind: 'number', name: 'jointsEndPrimary', label: 'End Primary', unit: 'count', step: 1 },
    ],
  },
  {
    title: 'Extended Columns',
    fields: [
      { kind: 'number', name: 'extendedColumnsMidPrimary', label: 'Mid Primary', unit: 'count', step: 1 },
      { kind: 'number', name: 'extendedColumnsEndPrimary', label: 'End Primary', unit: 'count', step: 1 },
    ],
  },
]

export function MezzanineExtensions() {
  const { extensions, setMezzanine } = useQuotationStore(
    useShallow((s) => ({ extensions: s.mezzanine.extensions, setMezzanine: s.setMezzanine })),
  )

  const addRow = () => setMezzanine({ extensions: [...extensions, {}] })
  const removeRow = (index: number) => setMezzanine({ extensions: extensions.filter((_, i) => i !== index) })
  const updateRow = (index: number, patch: Partial<MezzanineExtensionDraft>) =>
    setMezzanine({ extensions: extensions.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<StretchHorizontal className="w-3.5 h-3.5" />} title="Floor Extensions">
      <div className="flex flex-col gap-[18px]">
        {extensions.length === 0 && <p className="text-muted-foreground text-sm">No extensions added yet.</p>}

        {extensions.map((row, index) => (
          <RowCard
            key={index}
            title={`Extension ${index + 1}`}
            groups={EXTENSION_GROUPS}
            values={row as Record<string, number | string | undefined>}
            onChange={(patch) => updateRow(index, patch as Partial<MezzanineExtensionDraft>)}
            onRemove={() => removeRow(index)}
          />
        ))}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus /> Add extension
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
