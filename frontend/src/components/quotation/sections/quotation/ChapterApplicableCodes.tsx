import { DocChapter, DocProse, DocSubsection } from './DocPrimitives'
import { DocTable, type DocColumn } from './DocTable'
import { MOCK_APPLICABLE_CODES, MOCK_CODES_INTRO, MOCK_DESIGN_LOADS } from './quotation-data'

const CODE_COLUMNS: readonly DocColumn[] = [
  { header: 'SL No.', align: 'right', className: 'w-16', numeric: true },
  { header: 'Description', wrap: true, emphasis: true, className: 'min-w-56' },
  { header: 'Code Number', wrap: true, className: 'min-w-40' },
  { header: 'Title', wrap: true, className: 'min-w-64' },
  { header: 'Country', className: 'w-28' },
]

const LOAD_COLUMNS: readonly DocColumn[] = [
  { header: 'SL No.', align: 'right', className: 'w-16', numeric: true },
  { header: 'Load Type', wrap: true, emphasis: true, className: 'min-w-56' },
  { header: 'Value', align: 'right', className: 'min-w-32', numeric: true },
]

/** Chapter 3 — design codes the building was engineered against, plus loads. */
export function ChapterApplicableCodes() {
  return (
    <DocChapter eyebrow="Chapter 3" title="Applicable Codes" className="space-y-6">
      <DocProse>{MOCK_CODES_INTRO}</DocProse>

      <DocTable
        caption="Design standards and manuals applied, with code number and country"
        columns={CODE_COLUMNS}
        rows={MOCK_APPLICABLE_CODES}
        minWidth="min-w-[960px]"
      />

      <DocSubsection title="Design Loads">
        <DocTable
          caption="Design load type and the value used"
          columns={LOAD_COLUMNS}
          rows={MOCK_DESIGN_LOADS}
        />
      </DocSubsection>
    </DocChapter>
  )
}
