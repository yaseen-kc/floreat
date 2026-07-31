import { Badge } from '@/components/ui/badge'
import { DocChapter } from './DocPrimitives'
import { DocTable, type DocColumn } from './DocTable'

const COLUMNS: readonly DocColumn[] = [
  { header: 'SL No.', align: 'right', className: 'w-16', numeric: true },
  { header: 'Items', wrap: true, className: 'min-w-72' },
  { header: 'Unit', align: 'center', className: 'w-24' },
  { header: 'Quantity', align: 'right', className: 'min-w-32', numeric: true },
]

/**
 * SL No., Items, Unit, Quantity. `label` is the bold lead-in and `detail` the
 * plain remainder, mirroring the source's mixed emphasis.
 */
interface QuantityRow {
  sl: string
  label: string
  detail?: string
  unit: string
  quantity: string
}

const MOCK_QUANTITY_ESTIMATION: readonly QuantityRow[] = [
  { sl: '1', label: 'Roof Structure:', detail: 'Rafters, Columns and Tie Beams', unit: 'Kg', quantity: '7,211.33' },
  { sl: '2', label: 'Roof Purlins', unit: 'Kg', quantity: '28,237.33' },
  { sl: '3', label: 'Mezzanine Structure.', unit: 'Kg', quantity: '11,210.92' },
  { sl: '3', label: 'Cladding Structure:', detail: 'Cladding Purlins', unit: 'Kg', quantity: '4,003.15' },
  { sl: '4', label: 'Bracings:', detail: 'Wind Bracings, Sag Rod, Flange Brace', unit: 'Kg', quantity: '17,686.03' },
  { sl: '5', label: 'Canopy Structure', unit: 'Kg', quantity: '403.50' },
  { sl: '6', label: 'Canopy Purlins', unit: 'Kg', quantity: '229.39' },
  { sl: '7', label: 'Stair', unit: 'Kg', quantity: '726.95' },
  { sl: '8', label: 'Plinth Area', unit: 'Sqm', quantity: '450.00' },
  { sl: '9', label: 'Roof Sheet Area', unit: 'Sqm', quantity: '7,019.18' },
  { sl: '10', label: 'Decking Sheet', unit: 'Sqm', quantity: '234.54' },
  { sl: '9', label: 'Cladding Sheet Area', unit: 'Sqm', quantity: '157.90' },
  { sl: '10', label: 'Canopy Sheet Area', unit: 'Sqm', quantity: '30.00' },
  { sl: '11', label: 'Sheet Accessories: Flashing, Gutter and Downtake', unit: 'Rmtr', quantity: '1,748.68' },
  { sl: '12', label: 'Doors', unit: 'Sqm', quantity: '21.00' },
  { sl: '13', label: 'Windows', unit: 'Sqm', quantity: '18.00' },
  { sl: '14', label: 'Rolling Shutter', unit: 'Sqm', quantity: '100.00' },
  { sl: '15', label: 'Louvers', unit: 'Sqm', quantity: '100.00' },
  { sl: '16', label: 'Turbo Ventilators', unit: 'Nos', quantity: '10' },
  { sl: '17', label: 'Sky Lights', unit: 'Sqm', quantity: '100.00' },
  { sl: '18', label: 'Wall Lights', unit: 'Sqm', quantity: '100.00' },
  { sl: '19', label: 'Roof Insulation', unit: 'Sqm', quantity: '6,563.18' },
  { sl: '20', label: 'Wall Insulation', unit: 'Sqm', quantity: '104.90' },
  { sl: '21', label: 'Polycarbonate Sheet Area', unit: 'Sqm', quantity: '4,900.00' },
  { sl: '22', label: 'Fascia Structure', unit: 'Sqm', quantity: '4,564.00' },
]

/** Chapter 5 — estimated quantities per line item. */
export function ChapterQuantityEstimation() {
  const rows = MOCK_QUANTITY_ESTIMATION.map((row) => [
    row.sl,
    <>
      <span className="font-semibold">{row.label}</span>
      {row.detail && <span className="text-foreground/85"> {row.detail}</span>}
    </>,
    <Badge variant="outline">{row.unit}</Badge>,
    row.quantity,
  ])

  return (
    <DocChapter eyebrow="Chapter 5" title="Quantity Estimation">
      <DocTable
        caption="Estimated quantity and unit per item of work"
        columns={COLUMNS}
        rows={rows}
        minWidth="min-w-[640px]"
      />
    </DocChapter>
  )
}
