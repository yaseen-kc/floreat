import { DocChapter } from './DocPrimitives'
import { DocTable, type DocColumn, type Row } from './DocTable'

const COLUMNS: readonly DocColumn[] = [
  { header: 'SL No.', align: 'right', className: 'w-16', numeric: true },
  { header: 'Description', wrap: true, emphasis: true, className: 'min-w-44' },
  { header: 'Specifications', wrap: true, className: 'min-w-72' },
  { header: 'Make / Brand', wrap: true, className: 'min-w-32' },
  { header: 'Yield Strength', align: 'right', className: 'min-w-32', numeric: true },
]

/** SL No., Description, Specifications, Make / Brand, Yield Strength. */
const MOCK_PRODUCT_SPECS: readonly Row[] = [
  [
    '1',
    'Fabricated Columns and Beams',
    'Fabricated from Plates or Stocks by continuous welding process. Conform to IS2062 Grade E345/ASTM A572-12 Grade 50. Shall be killed/semi killed. Min thickness of plate 4mm.',
    'JSW / TATA',
    'Fy = 345 MPa',
  ],
  [
    '2',
    'Cold Formed Purlins / Girt',
    'ASTM A 653 Grade 275. Coating Z 120 or equivalent.',
    'JSW',
    'Fy = 275 MPa',
  ],
  ['3', 'Roofing Sheet', '30mm Puff Sheet', 'Metecno / JSW', 'Fy = 550 MPa'],
  [
    '4',
    'Cladding Sheet',
    'Zincalume Steel, Roof sheet 0.40mm TCT, Grade 550',
    'JSW',
    'Fy = 550 MPa',
  ],
  [
    '5',
    'Decking Sheet',
    'Decking Profile 50/230 (Depth/Pitch), Panel thickness 0.8mm, Yield Strength 250 MPa, Zinc Coating Z 120 GSM',
    'JSW',
    'Fy = 250 MPa',
  ],
  [
    '6',
    'Primary Connection',
    'Primary bolts — high strength bolts conforming to ASTM A325 (or equivalent), Grade 8.8',
    'UNBRACO',
    'Fy = 640 MPa',
  ],
  [
    '7',
    'Secondary Connection',
    'Secondary bolts — machine bolts conform to ASTM A307 (or equivalent), Grade 4.6',
    'UNBRACO',
    'Fy = 240 MPa',
  ],
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
