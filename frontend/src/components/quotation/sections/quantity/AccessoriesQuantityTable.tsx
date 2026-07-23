import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Wrench } from 'lucide-react'
import { useUpsertQuantity } from '@/api/quotation/quantity/postQuantity'
import type { CreateQuantityPayload } from '@/api/quotation/quantity/postQuantity'
import { SectionTable, seedDrafts } from '@/components/quotation/shared/SectionTable'
import type { RowDef } from '@/components/quotation/shared/SectionTable'

export const ACCESSORIES_ROWS: RowDef[] = [
  {
    "sl": "4.1",
    "label": "DOORS",
    "spec": "10",
    "specValue": "NOS",
    "unit": "SQM",
    "qtyField": "doorsQuantity",
    "unitField": "",
    "defaultQty": "21",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.2",
    "label": "Windows",
    "spec": "10",
    "specValue": "NOS",
    "unit": "SQM",
    "qtyField": "windowsQuantity",
    "unitField": "",
    "defaultQty": "21",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.3",
    "label": "Fascia structure",
    "spec": "",
    "unit": "",
    "qtyField": "fasciaStructureQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.4",
    "label": "Fascia covering sheet",
    "spec": "",
    "unit": "",
    "qtyField": "fasciaCoveringSheetBoardQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.5",
    "label": "Internal partitions",
    "spec": "",
    "unit": "",
    "qtyField": "internalPartitionsQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.6",
    "label": "Ridge",
    "spec": "",
    "unit": "",
    "qtyField": "ridgeQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.7",
    "label": "Gutter",
    "spec": "",
    "unit": "",
    "qtyField": "gutterQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.8",
    "label": "Down take",
    "spec": "",
    "unit": "",
    "qtyField": "downtakeQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.9",
    "label": "Drip trim",
    "spec": "",
    "unit": "",
    "qtyField": "dripTrimQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.10",
    "label": "Gable end flashing",
    "spec": "",
    "unit": "",
    "qtyField": "gableEndFlashingQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.11",
    "label": "Corner flash",
    "spec": "",
    "unit": "SQM",
    "qtyField": "cornerFlashQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.12",
    "label": "Rolling shutter",
    "spec": "10",
    "specValue": "NOS",
    "unit": "SQM",
    "qtyField": "rollingShutterQuantity",
    "unitField": "",
    "defaultQty": "21",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.13",
    "label": "Louvers",
    "spec": "10",
    "specValue": "NOS",
    "unit": "SQM",
    "qtyField": "louversQuantity",
    "unitField": "",
    "defaultQty": "21",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.14",
    "label": "Sky light",
    "spec": "10",
    "specValue": "NOS",
    "unit": "SQM",
    "qtyField": "skyLightQuantity",
    "unitField": "",
    "defaultQty": "21",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.15",
    "label": "Wall light",
    "spec": "10",
    "specValue": "NOS",
    "unit": "SQM",
    "qtyField": "wallLightQuantity",
    "unitField": "",
    "defaultQty": "21",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.16",
    "label": "Roof insulation",
    "spec": "XLPE",
    "unit": "",
    "qtyField": "roofInsulationQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.17",
    "label": "Wall insulation",
    "spec": "",
    "unit": "",
    "qtyField": "wallInsulationQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.18",
    "label": "Turbo ventilators",
    "spec": "",
    "unit": "",
    "qtyField": "turboVentilatorsQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "4.19",
    "label": "Handrail",
    "spec": "",
    "unit": "",
    "qtyField": "handrailQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  }
];

export interface AccessoriesQuantityTableProps {
  jobId: string
  initialData: Record<string, string | number | boolean | null | undefined> | null
  calculatedData?: Record<string, string | number | boolean | null | undefined> | null
}

export function AccessoriesQuantityTable({ jobId, initialData, calculatedData }: AccessoriesQuantityTableProps) {
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const upsertQuantity = useUpsertQuantity()
  const seeded = useRef(false)

  useEffect(() => {
    if (seeded.current) return
    if (initialData !== undefined) {
      seeded.current = true
      setDraft(seedDrafts(initialData as Record<string, unknown> | null, ACCESSORIES_ROWS))
    }
  }, [initialData])

  const onEdit = (field: string, value: string) => setDraft((prev) => ({ ...prev, [field]: value }))

  const onSave = async () => {
    if (!jobId) return
    setSaving(true)
    const parseVal = (v: string) => (v === '' ? null : Number(v))
    const sectionPayload = Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, parseVal(v)]))
    try {
      await upsertQuantity.mutateAsync({ jobId, payload: { accessories: sectionPayload } as CreateQuantityPayload })
      toast.success('Accessories saved')
    } catch {
      toast.error('Failed to save Accessories')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionTable
      icon={<Wrench />}
      title="Accessories"
      rows={ACCESSORIES_ROWS}
      sectionData={initialData}
      draft={draft}
      onEdit={onEdit}
      onSave={onSave}
      saving={saving}
      calculatedData={calculatedData}
    />
  )
}
