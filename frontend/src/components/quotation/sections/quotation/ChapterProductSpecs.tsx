import { DocChapter } from './DocPrimitives'
import { DocTable, type DocColumn } from './DocTable'
import { MOCK_PRODUCT_SPECS } from './quotation-data'

const COLUMNS: readonly DocColumn[] = [
  { header: 'SL No.', align: 'right', className: 'w-16', numeric: true },
  { header: 'Description', wrap: true, emphasis: true, className: 'min-w-44' },
  { header: 'Specifications', wrap: true, className: 'min-w-72' },
  { header: 'Make / Brand', wrap: true, className: 'min-w-32' },
  { header: 'Yield Strength', align: 'right', className: 'min-w-32', numeric: true },
]

/** Chapter 2 — material specifications, brands and yield strengths. */
export function ChapterProductSpecs() {
  return (
    <DocChapter eyebrow="Chapter 2" title="Product Specifications">
      <DocTable
        caption="Material specification, make and yield strength per product"
        columns={COLUMNS}
        rows={MOCK_PRODUCT_SPECS}
        minWidth="min-w-[900px]"
      />
    </DocChapter>
  )
}
