import { DocChapter, DocSubsection } from './DocPrimitives'
import { DocTable, type DocColumn } from './DocTable'
import {
  MOCK_BUILDING_DESCRIPTION,
  MOCK_GENERAL_SCOPE,
  MOCK_STEEL_FINISHES,
} from './quotation-data'

const SL: DocColumn = { header: 'SL No.', align: 'right', className: 'w-16', numeric: true }

const DESCRIPTION_COLUMNS: readonly DocColumn[] = [
  SL,
  { header: 'Item', wrap: true, emphasis: true, className: 'min-w-56' },
  { header: 'Value', wrap: true, className: 'min-w-48' },
]

const FINISHES_COLUMNS: readonly DocColumn[] = [
  SL,
  { header: 'Items', wrap: true, emphasis: true, className: 'min-w-56' },
  { header: 'Description', wrap: true, className: 'min-w-64' },
]

const SCOPE_COLUMNS: readonly DocColumn[] = [
  SL,
  { header: 'Items', wrap: true, emphasis: true, className: 'min-w-56' },
  { header: 'Responsibility', wrap: true, className: 'min-w-40' },
]

/** Chapter 1 — building description, steel work finishes and general scope. */
export function ChapterScopeOfWork() {
  return (
    <DocChapter eyebrow="Chapter 1" title="Scope of Work" className="space-y-6">
      <DocSubsection title="Building Description">
        <DocTable
          caption="Building configuration parameters and their values"
          columns={DESCRIPTION_COLUMNS}
          rows={MOCK_BUILDING_DESCRIPTION}
        />
      </DocSubsection>

      <DocSubsection title="Steel Work Finishes">
        <DocTable
          caption="Paint and coating finish per steel work item"
          columns={FINISHES_COLUMNS}
          rows={MOCK_STEEL_FINISHES}
        />
      </DocSubsection>

      <DocSubsection title="General Scope">
        <DocTable
          caption="Responsibility for each phase of work"
          columns={SCOPE_COLUMNS}
          rows={MOCK_GENERAL_SCOPE}
        />
      </DocSubsection>
    </DocChapter>
  )
}
