import { DocChapter } from './DocPrimitives'
import { DocTable, type DocColumn, type Row } from './DocTable'

const COLUMNS: readonly DocColumn[] = [
  { header: 'Chapter', className: 'w-32', emphasis: true },
  { header: 'Title', wrap: true },
  { header: 'Page', align: 'right', className: 'w-20', numeric: true },
]

/** Chapter number, title, page — the "List of Contents" table. */
const MOCK_CONTENTS: readonly Row[] = [
  ['Chapter 1', 'Scope of Work', '3'],
  ['Chapter 2', 'Product Specifications', '5'],
  ['Chapter 3', 'Applicable Codes', '6'],
  ['Chapter 4', 'Approval Drawings', '7'],
  ['Chapter 5', 'Quantity Estimation', '8'],
  ['Chapter 6', 'Pricing', '9'],
  ['Chapter 7', 'Exclusions', '10'],
  ['Chapter 8', 'Commercial Terms & Conditions', '10'],
  ['Chapter 9', 'Contract Form', '11'],
]

/** The document's table of contents. */
export function QuotationContents() {
  return (
    <DocChapter title="List of Contents">
      <DocTable caption="Chapters of this quotation and their page numbers" columns={COLUMNS} rows={MOCK_CONTENTS} />
    </DocChapter>
  )
}
