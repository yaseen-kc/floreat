import { useLoad, type Load } from '@/api/quotation/load/getLoad'
import { useQuotationStore } from '@/stores/quotation-store'
import { DocChapter, DocProse, DocSubsection } from './DocPrimitives'
import { DocTable, type DocColumn, type Row } from './DocTable'

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

const CODES_INTRO =
  'The building was designed according to the following Standard whichever is applicable. The following standards and manuals were used for the design of the proposed steel building.'

/** SL No., Description, Code Number, Title, Country. */
const APPLICABLE_CODES: readonly Row[] = [
  ['1', 'Fabricated Rafters, Columns, Floor Beams, Tie Beams', 'IS : 800 - 1984', 'Code of Practice for General Construction in Steel', 'Indian'],
  ['2', 'Z-Purlins, C-Purlins, Girt', 'IS : 801 - 1975', 'Code of Practice for use of Cold Formed Light Gauge Steel', 'Indian'],
  ['3', 'Z-Purlins, C-Purlins, Girt — Specifications', 'IS : 811 - 1987', 'Specifications for Cold Formed Light Gauge Structural Steel Sections', 'Indian'],
  ['4', 'Fabricated Rafters, Columns, Floor Beams, Tie Beams — Material Specification', 'IS : 2062 - 2006', 'Hot Rolled Low, Medium and High Tensile Structural Steel', 'Indian'],
  ['5', 'Structural Connection Bolts', 'IS : 4000 - 1992', 'High Strength Bolts in Steel Structures — Code of Practice', 'Indian'],
  ['6', 'Portal Frame Analysis Reference', 'SP : 40 - 1987', 'Hand Book on Structures with Steel Portal Frames', 'Indian'],
  ['7', 'Steel Tubular Sections, Bracings — Design Reference', 'SP : 38 - 1987 / IS : 4923-1997 / IS:1161-2014', 'Hand Book of Typified Designs for Structures with Steel Roof Trusses', 'Indian'],
  ['8', 'Load Calculation, DL, LL and WL', 'IS : 875 - 1987', 'Code of Practice for Design Loads (Other Than Earthquake)', 'Indian'],
  ['9', 'Earthquake Load Calculation', 'IS : 1893 - 2002', 'Code of Practice for Design Loads — Earthquake', 'Indian'],
  ['10', 'General Welding', 'IS : 816 - 1969', 'Code of Practice for Use Metal Arc Welding for General Construction', 'Indian'],
  ['11', 'Fabrication Tolerance', 'MBMA - 2010', 'Manual for Fabrication Tolerances', 'American'],
  ['12', 'Structural Configurations', 'MBMA - 2010', 'Low Rise Building Systems Manual', 'American'],
  ['13', 'Welding Inspection', 'AWS DI.1', 'Structural Welding Code', 'American'],
  ['14', 'Fabrication Inspection', 'AISC Manual', 'Steel Construction Manual', 'American'],
]

type LoadRowDef = { label: string; key: keyof Load; unit: string }

const LOAD_ROW_DEFS: readonly LoadRowDef[] = [
  { label: 'Dead Load on Roof Floor', key: 'deadLoadOnRoofFloor', unit: 'KN/M²' },
  { label: 'Live Load on Roof Floor', key: 'liveLoadOnRoofFloor', unit: 'KN/M²' },
  { label: 'Collateral Load on Roof Floor', key: 'collateralLoadOnRoofRafters', unit: 'KN/M²' },
  { label: 'Wind Load (Horizontal)', key: 'windLoadHorizontal', unit: 'Kmph' },
  { label: 'Wind Load (Upward)', key: 'windLoadOnRoofRaftersUpward', unit: 'Kmph' },
  { label: 'Roof Dead Load on Rafters', key: 'deadLoadOnRoofRafters', unit: 'KN/M²' },
  { label: 'Roof Live Load on Rafters', key: 'liveLoadOnRoofRafters', unit: 'KN/M²' },
  { label: 'Floor Dead Load', key: 'floorDeadLoad', unit: 'KN/M²' },
  { label: 'Floor Finish Load', key: 'floorFinishLoad', unit: 'KN/M²' },
  { label: 'Floor Live Load', key: 'floorLiveLoad', unit: 'KN/M²' },
  { label: 'Snow Load', key: 'snowLoad', unit: 'KN/M²' },
  { label: 'Earthquake Load', key: 'earthquakeLoad', unit: 'KN/M²' },
]

/** Chapter 3 — design codes the building was engineered against, plus loads. */
export function ChapterApplicableCodes() {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useLoad(jobId ?? '')

  const loadRows: Row[] = LOAD_ROW_DEFS.map((r, i) => {
    const val = data?.[r.key]
    return [String(i + 1), r.label, val != null ? `${val} ${r.unit}` : 'NA']
  })

  return (
    <DocChapter eyebrow="Chapter 3" title="Applicable Codes" className="space-y-6">
      <DocProse>{CODES_INTRO}</DocProse>

      <DocTable
        caption="Design standards and manuals applied, with code number and country"
        columns={CODE_COLUMNS}
        rows={APPLICABLE_CODES}
        minWidth="min-w-[960px]"
      />

      <DocSubsection title="Design Loads">
        <DocTable
          caption="Design load type and the value used"
          columns={LOAD_COLUMNS}
          rows={loadRows}
        />
      </DocSubsection>
    </DocChapter>
  )
}
