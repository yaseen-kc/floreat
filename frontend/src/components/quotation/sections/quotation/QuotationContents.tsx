import { DocChapter } from './DocPrimitives'
import { DocTable, type DocColumn } from './DocTable'
import { MOCK_CONTENTS } from './quotation-data'

const COLUMNS: readonly DocColumn[] = [
  { header: 'Chapter', className: 'w-32', emphasis: true },
  { header: 'Title', wrap: true },
  { header: 'Page', align: 'right', className: 'w-20', numeric: true },
]

/** The document's table of contents. */
export function QuotationContents() {
  return (
    <DocChapter title="List of Contents">
      <DocTable caption="Chapters of this quotation and their page numbers" columns={COLUMNS} rows={MOCK_CONTENTS} />
    </DocChapter>
  )
}
