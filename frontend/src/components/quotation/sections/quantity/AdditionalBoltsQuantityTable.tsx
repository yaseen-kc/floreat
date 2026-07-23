import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Nut } from 'lucide-react'
import { useUpsertQuantity } from '@/api/quotation/quantity/postQuantity'
import type { CreateQuantityPayload } from '@/api/quotation/quantity/postQuantity'
import { SectionTable, seedDrafts } from '@/components/quotation/shared/SectionTable'
import type { RowDef } from '@/components/quotation/shared/SectionTable'

export const ADDITIONAL_BOLTS_ROWS: RowDef[] = [
  {
    "sl": "7.1",
    "label": "Joint bolt",
    "spec": "24 MM DIA HSFG BOLTS",
    "unit": "NOS",
    "qtyField": "jointBolt1Quantity",
    "unitField": "",
    "subRows": []
  },
  {
    "sl": "7.2",
    "label": "Joint bolt",
    "spec": "20 MM DIA HSFG BOLTS",
    "unit": "NOS",
    "qtyField": "jointBolt2Quantity",
    "unitField": "",
    "subRows": []
  },
  {
    "sl": "7.3",
    "label": "Joint bolt",
    "spec": "16 MM DIA HSFG BOLTS",
    "unit": "NOS",
    "qtyField": "jointBolt3Quantity",
    "unitField": "",
    "subRows": []
  },
  {
    "sl": "7.4",
    "label": "Purlin bolt",
    "spec": "12 MM DIA ORDINARY BOLTS",
    "unit": "NOS",
    "qtyField": "purlinBoltQuantity",
    "unitField": "",
    "subRows": []
  },
  {
    "sl": "7.5",
    "label": "Anchor bolt",
    "spec": "",
    "unit": "NOS",
    "qtyField": "anchorBoltQuantity",
    "unitField": "",
    "subRows": []
  },
  {
    "sl": "7.6",
    "label": "Foundation bolt",
    "spec": "",
    "unit": "NOS",
    "qtyField": "foundationBoltQuantity",
    "unitField": "",
    "subRows": []
  }
];

export interface AdditionalBoltsQuantityTableProps {
  jobId: string
  initialData: Record<string, string | number | boolean | null | undefined> | null
  calculatedData?: Record<string, string | number | boolean | null | undefined> | null
}

export function AdditionalBoltsQuantityTable({ jobId, initialData, calculatedData }: AdditionalBoltsQuantityTableProps) {
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const upsertQuantity = useUpsertQuantity()
  const seeded = useRef(false)

  useEffect(() => {
    if (seeded.current) return
    if (initialData !== undefined) {
      seeded.current = true
      setDraft(seedDrafts(initialData as Record<string, unknown> | null, ADDITIONAL_BOLTS_ROWS))
    }
  }, [initialData])

  const onEdit = (field: string, value: string) => setDraft((prev) => ({ ...prev, [field]: value }))

  const onSave = async () => {
    if (!jobId) return
    setSaving(true)
    const parseVal = (v: string) => (v === '' ? null : Number(v))
    const sectionPayload = Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, parseVal(v)]))
    try {
      await upsertQuantity.mutateAsync({ jobId, payload: { additionalBolts: sectionPayload } as CreateQuantityPayload })
      toast.success('Additional Bolts saved')
    } catch {
      toast.error('Failed to save Additional Bolts')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionTable
      icon={<Nut />}
      title="Additional Bolts"
      rows={ADDITIONAL_BOLTS_ROWS}
      sectionData={initialData}
      draft={draft}
      onEdit={onEdit}
      onSave={onSave}
      saving={saving}
      calculatedData={calculatedData}
    />
  )
}
