import { useSpec } from '@/api/quotation/spec/getSpec'
import { useQuotationStore } from '@/stores/quotation-store'
import { DocChapter } from './DocPrimitives'
import { DocTable, type DocColumn, type Row } from './DocTable'

const COLUMNS: readonly DocColumn[] = [
  { header: 'SL No.', align: 'right', className: 'w-16', numeric: true },
  { header: 'Description', wrap: true, emphasis: true, className: 'min-w-44' },
  { header: 'Specifications', wrap: true, className: 'min-w-72' },
  { header: 'Make / Brand', wrap: true, className: 'min-w-32' },
  { header: 'Yield Strength', align: 'right', className: 'min-w-32', numeric: true },
]

/** Chapter 2 — material specifications, brands and yield strengths. */
export function ChapterProductSpecs() {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useSpec(jobId ?? '')

  const rows: Row[] = (data?.products ?? []).map((p, i) => [
    String(i + 1),
    p.description ?? '',
    p.specification ?? '',
    p.makeOrBrand ?? '',
    p.yieldStrengthMpa != null ? `Fy = ${p.yieldStrengthMpa} MPa` : '',
  ])

  return (
    <DocChapter eyebrow="Chapter 2" title="Product Specifications">
      <DocTable
        caption="Material specification, make and yield strength per product"
        columns={COLUMNS}
        rows={rows}
        minWidth="min-w-[900px]"
      />
    </DocChapter>
  )
}
