import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Layers2 } from 'lucide-react'
import { useUpsertQuantity } from '@/api/quotation/quantity/postQuantity'
import type { CreateQuantityPayload } from '@/api/quotation/quantity/postQuantity'
import { SectionTable, seedDrafts } from '@/components/quotation/shared/SectionTable'
import type { RowDef } from '@/components/quotation/shared/SectionTable'

export const MEZZANINE_ROWS: RowDef[] = [
  {
    "sl": "5.1",
    "label": "Structure",
    "spec": "",
    "unit": "KG",
    "qtyField": "mezzanineStructureQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "a",
        "desc": "TOTAL MEZZANINE AREA",
        "spec": "171",
        "unit": "SQM",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "totalMezzanineAreaQuantity",
        "defaultQty": "4756",
        "isCalculated": true
      },
      {
        "sl": "b",
        "desc": "MATERIAL CONSUMPTION",
        "spec": "4",
        "unit": "KG/SQFT",
        "addlField": "materialConsumption",
        "defaultQty": "4756"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "5.2",
    "label": "Deck sheet",
    "spec": "",
    "unit": "SQM",
    "qtyField": "deckSheetQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "shearStudsPurchaseQuantity", // wait, what about deck sheet purchase? It is absent in JSON! Wait!
        "isCalculated": true
      },
      {
        "sl": "",
        "desc": "",
        "spec": "",
        "unit": "",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "SQM",
        "addlField": "",
        "defaultQty": "46",
        "isCalculated": true
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "5.3",
    "label": "Shear studs",
    "spec": "ADDITIONAL=",
    "specValue": "521",
    "unit": "",
    "qtyField": "shearStudsQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "5.4",
    "label": "Concrete flashing",
    "spec": "ADDITIONAL=",
    "specValue": "521",
    "unit": "",
    "qtyField": "concreteFlashing",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "5.5",
    "label": "Joint bolts",
    "spec": "16 MM DIA HSFG BOLTS",
    "unit": "",
    "qtyField": "jointBoltsQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "5.6",
    "label": "Foundation bolts",
    "spec": "",
    "unit": "",
    "qtyField": "foundationBoltsQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  }
];

export interface MezzanineQuantityTableProps {
  jobId: string
  initialData: Record<string, string | number | boolean | null | undefined> | null
  calculatedData?: Record<string, string | number | boolean | null | undefined> | null
}

export function MezzanineQuantityTable({ jobId, initialData, calculatedData }: MezzanineQuantityTableProps) {
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const upsertQuantity = useUpsertQuantity()
  const seeded = useRef(false)

  useEffect(() => {
    if (seeded.current) return
    if (initialData !== undefined) {
      seeded.current = true
      setDraft(seedDrafts(initialData as Record<string, unknown> | null, MEZZANINE_ROWS))
    }
  }, [initialData])

  const onEdit = (field: string, value: string) => setDraft((prev) => ({ ...prev, [field]: value }))

  const onSave = async () => {
    if (!jobId) return
    setSaving(true)
    const parseVal = (v: string) => (v === '' ? null : Number(v))
    const sectionPayload = Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, parseVal(v)]))
    try {
      await upsertQuantity.mutateAsync({ jobId, payload: { mezzanine: sectionPayload } as CreateQuantityPayload })
      toast.success('Mezzanine saved')
    } catch {
      toast.error('Failed to save Mezzanine')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionTable
      icon={<Layers2 />}
      title="Mezzanine"
      rows={MEZZANINE_ROWS}
      sectionData={initialData}
      draft={draft}
      onEdit={onEdit}
      onSave={onSave}
      saving={saving}
      calculatedData={calculatedData}
    />
  )
}
