import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { MoveUpRight } from 'lucide-react'
import { useUpsertQuantity } from '@/api/quotation/quantity/postQuantity'
import type { CreateQuantityPayload } from '@/api/quotation/quantity/postQuantity'
import { SectionTable, seedDrafts } from '@/components/quotation/shared/SectionTable'
import type { RowDef } from '@/components/quotation/shared/SectionTable'

export const STAIR_ROWS: RowDef[] = [
  {
    "sl": "6.1",
    "label": "Total area",
    "spec": "",
    "unit": "SQM",
    "qtyField": "totalAreaOfStairQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "6.2",
    "label": "Stringer beams",
    "spec": "HR SECTION",
    "unit": "KG",
    "qtyField": "totalWeightofStringerBeamsQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "",
        "unit": "",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "totalWeightofStringerBeamsAdditional"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "6.3",
    "label": "Steps",
    "spec": "6MM CHQ PLATE",
    "unit": "KG",
    "qtyField": "totalWeightofStepsQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "",
        "unit": "",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "totalWeightofStepsAdditional"
      }
    ],
    "isCalculated": true
  }
];

export interface StairQuantityTableProps {
  jobId: string
  initialData: Record<string, string | number | boolean | null | undefined> | null
  calculatedData?: Record<string, string | number | boolean | null | undefined> | null
}

export function StairQuantityTable({ jobId, initialData, calculatedData }: StairQuantityTableProps) {
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const upsertQuantity = useUpsertQuantity()
  const seeded = useRef(false)

  useEffect(() => {
    if (seeded.current) return
    if (initialData !== undefined) {
      seeded.current = true
      setDraft(seedDrafts(initialData as Record<string, unknown> | null, STAIR_ROWS))
    }
  }, [initialData])

  const onEdit = (field: string, value: string) => setDraft((prev) => ({ ...prev, [field]: value }))

  const onSave = async () => {
    if (!jobId) return
    setSaving(true)
    const parseVal = (v: string) => (v === '' ? null : Number(v))
    const sectionPayload = Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, parseVal(v)]))
    try {
      await upsertQuantity.mutateAsync({ jobId, payload: { stair: sectionPayload } as CreateQuantityPayload })
      toast.success('Stair saved')
    } catch {
      toast.error('Failed to save Stair')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionTable
      icon={<MoveUpRight />}
      title="Stair"
      rows={STAIR_ROWS}
      sectionData={initialData}
      draft={draft}
      onEdit={onEdit}
      onSave={onSave}
      saving={saving}
      calculatedData={calculatedData}
    />
  )
}
