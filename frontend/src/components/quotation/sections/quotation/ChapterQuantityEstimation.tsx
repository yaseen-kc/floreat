import { Badge } from '@/components/ui/badge'
import { DocChapter } from './DocPrimitives'
import { DocTable, type DocColumn } from './DocTable'
import { MOCK_QUANTITY_ESTIMATION } from './quotation-data'

const COLUMNS: readonly DocColumn[] = [
  { header: 'SL No.', align: 'right', className: 'w-16', numeric: true },
  { header: 'Items', wrap: true, className: 'min-w-72' },
  { header: 'Unit', align: 'center', className: 'w-24' },
  { header: 'Quantity', align: 'right', className: 'min-w-32', numeric: true },
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
