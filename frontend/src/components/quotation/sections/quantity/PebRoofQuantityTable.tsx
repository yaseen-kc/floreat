import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Layers } from 'lucide-react'
import { useUpsertQuantity } from '@/api/quotation/quantity/postQuantity'
import type { CreateQuantityPayload } from '@/api/quotation/quantity/postQuantity'
import { SectionTable, seedDrafts } from '@/components/quotation/shared/SectionTable'
import type { RowDef } from '@/components/quotation/shared/SectionTable'

export const PEB_ROOF_ROWS: RowDef[] = [
  {
    "sl": "1",
    "labelPrefix": "_",
    "label": "PEB ROOF",
    "spec": "MATERIAL WITH PURLIN",
    "unit": "KG/SQFT",
    "qtyField": "pebRoofQuantity",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "1.1",
    "label": "Rafters & columns",
    "spec": "",
    "unit": "KG",
    "qtyField": "raftersAndColumnsQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF BUILDING",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "lengthOfBuildingQuantity"
      },
      {
        "sl": "b",
        "desc": "INCLINED LENGTH IN ONE HALF",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "c",
        "desc": "ROOF AREA",
        "spec": "",
        "unit": "SQFT"
      },
      {
        "sl": "d",
        "desc": "MATERIAL CONSUMPTION",
        "spec": "",
        "unit": "KG/SQFT"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.2",
    "label": "Roof purlins",
    "labelSuffix": "_",
    "spec": "",
    "unit": "KG",
    "qtyField": "roofPurlinsQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF ONE PURLIN",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "lengthOfOnePurlinQuantity"
      },
      {
        "sl": "b",
        "desc": "NO.OF.PURLINS IN ONE FRAME",
        "spec": "",
        "unit": "NOS"
      },
      {
        "sl": "c",
        "desc": "TOTAL NO.OF PURLIN BAY",
        "spec": "",
        "unit": "NOS"
      },
      {
        "sl": "d",
        "desc": "UNIT WEIGHT OF PURLIN",
        "spec": "",
        "unit": "KG/M"
      },
      {
        "sl": "e",
        "desc": "NO.OF.PURLINS IN EXTENDED FRAME",
        "spec": "",
        "unit": "NOS"
      },
      {
        "sl": "f",
        "desc": "NO.OF EXTENDED PURLIN BAY",
        "spec": "",
        "unit": "NOS"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.3",
    "label": "Roof sheet",
    "spec": "",
    "unit": "SQM",
    "qtyField": "roofSheetQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "roofSheetPurchaseQuantity",
        "isCalculated": true
      },
      {
        "sl": "a",
        "desc": "EXTENDED ROOF WIDTH",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "SQM",
        "addlField": "extendedRoofWidth" 
      },
      {
        "sl": "b",
        "desc": "EXTENDED ROOF LENGTH",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "c",
        "desc": "ROOF AREA DEDUCTIONS",
        "spec": "",
        "unit": "SQM"
      },
      {
        "sl": "d",
        "desc": "POLY CARBONATE AREA DEDUCTION",
        "spec": "",
        "unit": "SQM"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.4",
    "label": "Polycarbonate sheet",
    "spec": "",
    "unit": "SQM",
    "qtyField": "polyCarbonateSheetQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "",
        "desc": "",
        "spec": "PURCHASE QUANTITY",
        "unit": "SQM",
        "purchField": "polyCarbonateSheetPurchaseQuantity",
        "isCalculated": true
      },
      {
        "sl": "a",
        "desc": "LENGTH OF POLYCARBONATE SHEET",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "SQM",
        "addlField": "lengthOfpolyCarbonateSheetAdditional"
      },
      {
        "sl": "b",
        "desc": "WIDTH OF POLYCARBONATE SHEET",
        "spec": "",
        "unit": "M"
      },
      {
        "sl": "c",
        "desc": "NOS OF POLYCARBONATE SHEET",
        "spec": "",
        "unit": "NOS"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.5",
    "label": "Roof wind bracings",
    "spec": "",
    "unit": "KG",
    "qtyField": "roofWindBracing",
    "unitField": "",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF ROOF SINGLE WIND BRACING",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "lengthOfSinlgeWindBracingAdditional"
      },
      {
        "sl": "b",
        "desc": "TOTAL NUMBER OF ROOF WIND BRACING",
        "spec": "",
        "unit": "NOS"
      },
      {
        "sl": "c",
        "desc": "UNIT WEIGHT OF ROOF WIND BRACING",
        "spec": "",
        "unit": "KG/M"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.6",
    "label": "Roof sag rod",
    "labelSuffix": "8.95456465",
    "spec": "",
    "unit": "",
    "qtyField": "roofSagRoadQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "a",
        "desc": "LENGTH OF SINGLE SAG ROD",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "roofSagRoadQuantityAdditional"
      },
      {
        "sl": "b",
        "desc": "NO.OF SAG ROD IN A SINGLE FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "c",
        "desc": "NO.OF BAY IN SAG ROD PROVIDED",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "d",
        "desc": "NO.OF.SAG ROD IN EXTENDED FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "e",
        "desc": "NO.OF EXTENDED SAG ROD BAY",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "f",
        "desc": "UNIT WEIGHT OF SAG ROD",
        "spec": "",
        "unit": "KG/M"
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.7",
    "label": "Roof flange brace",
    "spec": "",
    "unit": "KG",
    "qtyField": "roofFlangeBraceQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "a",
        "desc": "",
        "spec": "",
        "unit": "M",
        "addlSpec": "ADDITIONAL=",
        "addlUnit": "KG",
        "addlField": "lengthOfMidFrameFlangeBraceAdditional"
      },
      {
        "sl": "b",
        "desc": "NO.OF FLANGE BRACE IN MID FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "c",
        "desc": "NO.OF FLANGE BRACE IN END FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "d",
        "desc": "NO.OF MID FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "e",
        "desc": "NO.OF END FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "f",
        "desc": "NO.OF FLNG BRACE IN EXTENDED FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "g",
        "desc": "NO.OF FLNG BRACE IN EXTENDED FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "h",
        "desc": "NO.OF EXTENDED MID FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "i",
        "desc": "NO.OF EXTENDED END FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "j",
        "desc": "LENGTH OF END FRAME FLANGE BRACE",
        "spec": "",
        "unit": ""
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.8",
    "label": "Purlin bolts",
    "spec": "",
    "unit": "NOS",
    "qtyField": "numberOfPurlinBoltsQuantity",
    "unitField": "",
    "subRows": [
      {
        "sl": "a",
        "desc": "NO.OF PURLIN JOINT IN SINGLE FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "b",
        "desc": "TOTAL NO.OF FRAMES",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "c",
        "desc": "NO.OF PURLIN NODE IN EXTENDED FRAME",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "d",
        "desc": "NO.OF EXTENDED FRAMES",
        "spec": "",
        "unit": ""
      },
      {
        "sl": "e",
        "desc": "NO.OF BOLTS IN SINGLE PURLIN JOINT",
        "spec": "",
        "unit": ""
      }
    ],
    "isCalculated": true
  },
  {
    "sl": "1.9",
    "label": "NUMBER OF ROOF JOINT BOLTS",
    "spec": "",
    "unit": "NOS",
    "qtyField": "numberOfRoofJointBolts",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "1.9.1",
    "label": "NUMBER OF Foundation bolts",
    "spec": "",
    "unit": "",
    "qtyField": "numberOfFoundationBolts",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  },
  {
    "sl": "1.9.2",
    "label": "Anchor bolts",
    "spec": "",
    "unit": "",
    "qtyField": "numberOfAnchorBolts",
    "unitField": "",
    "subRows": [],
    "isCalculated": true
  }
];

export interface PebRoofQuantityTableProps {
  jobId: string
  initialData: Record<string, string | number | boolean | null | undefined> | null
  calculatedData?: Record<string, string | number | boolean | null | undefined> | null
}

export function PebRoofQuantityTable({ jobId, initialData, calculatedData }: PebRoofQuantityTableProps) {
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const upsertQuantity = useUpsertQuantity()
  const seeded = useRef(false)

  useEffect(() => {
    if (seeded.current) return
    if (initialData !== undefined) {
      seeded.current = true
      setDraft(seedDrafts(initialData as Record<string, unknown> | null, PEB_ROOF_ROWS))
    }
  }, [initialData])

  const onEdit = (field: string, value: string) => setDraft((prev) => ({ ...prev, [field]: value }))

  const onSave = async () => {
    if (!jobId) return
    setSaving(true)
    const parseVal = (v: string) => (v === '' ? null : Number(v))
    const sectionPayload = Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, parseVal(v)]))
    try {
      await upsertQuantity.mutateAsync({ jobId, payload: { pebRoof: sectionPayload } as CreateQuantityPayload })
      toast.success('PEB Roof saved')
    } catch {
      toast.error('Failed to save PEB Roof')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionTable
      icon={<Layers />}
      title="PEB Roof"
      rows={PEB_ROOF_ROWS}
      sectionData={initialData}
      draft={draft}
      onEdit={onEdit}
      onSave={onSave}
      saving={saving}
      calculatedData={calculatedData}
    />
  )
}
