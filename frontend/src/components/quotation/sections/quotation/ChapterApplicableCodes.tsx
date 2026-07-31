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

const MOCK_CODES_INTRO =
  'The building was designed according to the following Standard whichever is applicable. The following standards and manuals were used for the design of the proposed steel building.'

/** SL No., Description, Code Number, Title, Country. */
const MOCK_APPLICABLE_CODES: readonly Row[] = [
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

/** Design Loads: SL No., Load Type, Value. */
const MOCK_DESIGN_LOADS: readonly Row[] = [
  ['1', 'Dead Load on Roof Floor', 'NA'],
  ['2', 'Live Load on Roof Floor', 'NA'],
  ['3', 'Collateral Load on Roof Floor', 'NA'],
  ['4', 'Wind Load (Horizontal)', '140 Kmph'],
  ['5', 'Wind Load (Upward)', '140 Kmph'],
  ['6', 'Roof Dead Load on Rafters', '0.15 KN/M²'],
  ['7', 'Roof Live Load on Rafters', '0.60 KN/M²'],
  ['8', 'Floor Dead Load', 'NA'],
  ['9', 'Floor Finish Load', 'NA'],
  ['10', 'Floor Live Load', 'NA'],
  ['11', 'Snow Load', 'NA'],
  ['12', 'Earthquake Load', '0'],
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
