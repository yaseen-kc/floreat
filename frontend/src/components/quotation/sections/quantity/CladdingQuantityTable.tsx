import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { LayoutGrid } from 'lucide-react'
import { useUpsertQuantity } from '@/api/quotation/quantity/postQuantity'
import type { CreateQuantityPayload } from '@/api/quotation/quantity/postQuantity'
import { SectionTable, seedDrafts } from '@/components/quotation/shared/SectionTable'
import type { RowDef } from '@/components/quotation/shared/SectionTable'

export const CLADDING_ROWS: RowDef[] = [
  {
    "sl": "2.1",
    "label": "Cladding structure",
    "spec": "",
    "unit": "KG",
    "qtyField": "claddingStructureQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "a",
        "desc": "CLADDING EAVE HEIGHT FRONT",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "claddingEaveHeightFrontAdditional"
      },
      {
        "sl": "b",
        "desc": "CLADDING EAVE HEIGHT BACK",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "c",
        "desc": "CLADDING EAVE HEIGHT RIGHT",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "d",
        "desc": "CLADDING EAVE HEIGHT LEFT",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "e",
        "desc": "EXTENDED COLUMN HEIGHT",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "f",
        "desc": "WIDTH OF EXTENDED FRAME",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "g",
        "desc": "NO.OF SIDE CLADDING PURLIN",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "h",
        "desc": "NO.OF FACE CLADDING PURLIN",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "i",
        "desc": "TOTAL LENGTH OF CLADDING PURLIN",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "j",
        "desc": "TOTAL WEIGHT OF CLADDING PURLIN",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "k",
        "desc": "CLADDING AREA WITHOUT ANY DEDUCTIONS",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "l",
        "desc": "AVERAGE MATERIAL CONSUMPTION",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "m",
        "desc": "TOTAL CLADDING OPENINGS",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "n",
        "desc": "FASCIA OPENING",
        "spec": "",
        "unit": "M"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "2.2",
    "label": "CLADDING SHEET",
    "spec": "ADDITIONAL=",
    "specValue": "_",
    "unit": "SQM",
    "qtyField": "claddingSheetQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "claddingSheetPurchase"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "2.3",
    "label": "Column wind bracings",
    "spec": "ADDITIONAL=",
    "specValue": "_",
    "unit": "44",
    "qtyField": "columnWindBracingsAdditional",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "2.4",
    "label": "Cladding sag rod",
    "spec": "ADDITIONAL=",
    "specValue": "_",
    "unit": "54",
    "qtyField": "claddingSagRodAdditional",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "2.5",
    "label": "Cladding flange brace",
    "spec": "ADDITIONAL=",
    "specValue": "_",
    "unit": "65",
    "qtyField": "claddingFlangeBraceAdditional",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "2.6",
    "label": "Cladding purlin bolts",
    "spec": "ADDITIONAL=",
    "specValue": "_",
    "unit": "75",
    "qtyField": "numberOfCladdingPurlinBoltsAdditional",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  }
];

export interface CladdingQuantityTableProps {
  jobId: string
  initialData: Record<string, string | number | boolean | null | undefined> | null
  calculatedData?: Record<string, string | number | boolean | null | undefined> | null
}

export function CladdingQuantityTable({ jobId, initialData, calculatedData }: CladdingQuantityTableProps) {
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const upsertQuantity = useUpsertQuantity()
  const seeded = useRef(false)

  useEffect(() => {
    if (seeded.current) return
    if (initialData !== undefined) {
      seeded.current = true
      setDraft(seedDrafts(initialData as Record<string, unknown> | null, CLADDING_ROWS))
    }
  }, [initialData])

  const onEdit = (field: string, value: string) => setDraft((prev) => ({ ...prev, [field]: value }))

  const onSave = async () => {
    if (!jobId) return
    setSaving(true)
    const parseVal = (v: string) => (v === '' ? null : Number(v))
    const sectionPayload = Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, parseVal(v)]))
    try {
      await upsertQuantity.mutateAsync({ jobId, payload: { cladding: sectionPayload } as CreateQuantityPayload })
      toast.success('Cladding saved')
    } catch {
      toast.error('Failed to save Cladding')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionTable
      icon={<LayoutGrid />}
      title="Cladding"
      rows={CLADDING_ROWS}
      sectionData={initialData}
      draft={draft}
      onEdit={onEdit}
      onSave={onSave}
      saving={saving}
      calculatedData={calculatedData}
    />
  )
}
