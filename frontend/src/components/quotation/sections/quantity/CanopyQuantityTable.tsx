import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Umbrella } from 'lucide-react'
import { useUpsertQuantity } from '@/api/quotation/quantity/postQuantity'
import type { CreateQuantityPayload } from '@/api/quotation/quantity/postQuantity'
import { SectionTable, seedDrafts } from '@/components/quotation/shared/SectionTable'
import type { RowDef } from '@/components/quotation/shared/SectionTable'

export const CANOPY_ROWS: RowDef[] = [
  {
    "sl": "3.1",
    "label": "Canopy Structure",
    "spec": "",
    "unit": "KG",
    "qtyField": "canopyStructureQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "CANOPY AREA",
        "spec": "322.80",
        "unit": "SQFT",
        "addlField": "canopyArea"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "3.2",
    "label": "Canopy Purlin",
    "spec": "",
    "unit": "KG",
    "qtyField": "canopyPurlinQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.3",
    "label": "Canopy Sheet",
    "spec": "",
    "unit": "SQM",
    "qtyField": "canopySheetQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "canopySheetPurchaseQuantity",
        "isCalculated": true
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "3.4",
    "label": "Canopy Gutter",
    "spec": "",
    "unit": "M",
    "qtyField": "canopyGutterQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.5",
    "label": "Canopy Down take",
    "spec": "",
    "unit": "M",
    "qtyField": "canopyDownTakeQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.6",
    "label": "Canopy Side covering",
    "spec": "",
    "unit": "SQM",
    "qtyField": "canopySideCoveringQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.7",
    "label": "Canopy Flashing",
    "spec": "",
    "unit": "M",
    "qtyField": "canopyFlashingQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.8",
    "label": "Canopy Purlin bolts",
    "spec": "",
    "unit": "NOS",
    "qtyField": "canopyPurlinBoltsQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "3.9",
    "label": "Canopy Joint bolts",
    "spec": "",
    "unit": "NOS",
    "qtyField": "canopyJointBoltsQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  }
];

export interface CanopyQuantityTableProps {
  jobId: string
  initialData: Record<string, string | number | boolean | null | undefined> | null
  calculatedData?: Record<string, string | number | boolean | null | undefined> | null
}

export function CanopyQuantityTable({ jobId, initialData, calculatedData }: CanopyQuantityTableProps) {
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const upsertQuantity = useUpsertQuantity()
  const seeded = useRef(false)

  useEffect(() => {
    if (seeded.current) return
    if (initialData !== undefined) {
      seeded.current = true
      setDraft(seedDrafts(initialData as Record<string, unknown> | null, CANOPY_ROWS))
    }
  }, [initialData])

  const onEdit = (field: string, value: string) => setDraft((prev) => ({ ...prev, [field]: value }))

  const onSave = async () => {
    if (!jobId) return
    setSaving(true)
    const parseVal = (v: string) => (v === '' ? null : Number(v))
    const sectionPayload = Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, parseVal(v)]))
    try {
      await upsertQuantity.mutateAsync({ jobId, payload: { canopy: sectionPayload } as CreateQuantityPayload })
      toast.success('Canopy saved')
    } catch {
      toast.error('Failed to save Canopy')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionTable
      icon={<Umbrella />}
      title="Canopy"
      rows={CANOPY_ROWS}
      sectionData={initialData}
      draft={draft}
      onEdit={onEdit}
      onSave={onSave}
      saving={saving}
      calculatedData={calculatedData}
    />
  )
}
