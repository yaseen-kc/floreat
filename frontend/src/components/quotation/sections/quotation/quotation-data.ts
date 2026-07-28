/**
 * Placeholder content for the Step 13 quotation preview.
 *
 * Every value here stands in for data that will later arrive from the job,
 * roof, quantity, amount and rate records. Keeping it in one module means the
 * swap to real data is a change of source, not a change of markup.
 */

/** A single table row expressed as ordered cells. */
export type Row = readonly string[]

export const MOCK_META = {
  ref: 'FBS/SM/212/17/12/2020',
  date: '17 December 2020',
  client: 'M/S MOCA ARCHITECTS',
  subject:
    '20-212 Offer for Supply and Installation of Pre Engineered Steel Hypermarket Building at Wandoor',
  reference: 'FBS/SM/212/17/12/2020',
  company: 'Floreat Building Systems Pvt Ltd',
} as const

export const MOCK_LETTER_BODY: readonly string[] = [
  'We take this opportunity to thank you for the enquiry and further to the discussion we had with you, we hereby forward our Proposal.',
  `The Scope of Work, terms and Conditions for the work is enclosed as per our offer no. ${MOCK_META.ref}.`,
  'We hope you will find the details furnished as per your requirement. Please feel free to call us for any information.',
]

export interface Signatory {
  name: string
  role: string
  mobile: string
}

export const MOCK_SIGNATORIES: readonly Signatory[] = [
  { name: 'GEETHANJALI', role: 'Estimation Engineer', mobile: '8136989922' },
  { name: 'SANTHOSH P S', role: 'Head of Sales', mobile: '9526716600' },
]

/** Chapter number, title, page — the "List of Contents" table. */
export const MOCK_CONTENTS: readonly Row[] = [
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

/** Chapter 1 — Building Description: SL No., Item, Value. */
export const MOCK_BUILDING_DESCRIPTION: readonly Row[] = [
  ['1', 'Structure Type', 'Pre-Engineered Structure'],
  ['2', 'Building Usage', 'Commercial Building'],
  ['3', 'Number of Building', '1'],
  ['4', 'Frame Type', 'Portal'],
  ['5', 'Configuration', 'Clear Span'],
  ['6', 'Span (Width)', '15 Meter'],
  ['7', 'Length of Building', '30 Meter'],
  ['8', 'Column', 'Steel'],
  ['9', 'Intermediate Roof Columns', 'Yes'],
  ['10', 'Number of Main Frame', '4'],
  ['11', 'Number of Gable Frame', '2'],
  ['12', 'Eaves Height', '5.645 Meter'],
  ['13', 'Cladding Height', '3.245 Meter'],
  ['14', 'Wall Height', '2.4 Meter'],
  ['15', 'Wall Material', 'BRICK'],
  ['16', 'Roof Slope', '6 Degree'],
  ['17', 'Bay Spacing', '6 Meter'],
  ['18', 'Gable', 'Yes'],
  ['19', 'EOT Crane', 'Yes'],
  ['20', 'Roof Sheet', 'Puff Sheet 30 mm Thick'],
  ['21', 'Cladding Sheet', 'PPGL 4.4 mm Thick'],
  ['22A', 'Sheeting Accessories — Gutter', 'Yes'],
  ['22B', 'Sheeting Accessories — Down Take', 'Yes'],
  ['22C', 'Sheeting Accessories — Drip Trim', 'Yes'],
  ['22D', 'Sheeting Accessories — Gable Trim', 'Yes'],
  ['22E', 'Sheeting Accessories — Corner Flash', 'Yes'],
  ['22F', 'Sheeting Accessories — Ridge Sheet', 'Yes'],
  ['23', 'Polycarbonate Sheet', 'Yes'],
  ['24', 'Turbo Ventilator', 'Yes'],
  ['25', 'Rolling Shutter', 'Yes'],
  ['26', 'Wind Bracing', 'Yes'],
  ['27', 'Canopy', 'Yes'],
  ['28', 'Canopy Sheet', 'Yes'],
  ['29', 'Insulation', 'Yes'],
  ['30', 'Ridge Ventilator', 'NA'],
  ['31', 'Fixed Louver', 'Yes'],
  ['32', 'Sky Lights', 'Yes'],
  ['33', 'Wall Light', 'Yes'],
  ['35', 'Partition Wall', 'Yes'],
  ['36', 'Mezzanine Floor', 'Yes'],
  ['37', 'Decking Sheet', 'Yes'],
  ['38', 'Shear Studs', 'Yes'],
  ['39', 'Joint Bolt', 'Yes'],
  ['40', 'Anchor Bolt', 'NA'],
  ['41', 'Stair', 'Yes'],
  ['42', 'Handrail', 'Yes'],
  ['43', 'Lift Supporting Structure', 'Yes'],
  ['44', 'Lift Device', 'NA'],
]

/** Chapter 1 — Steel Work Finishes: SL No., Items, Description. */
export const MOCK_STEEL_FINISHES: readonly Row[] = [
  ['1', 'Frame, Built-up / HR Sections / Bracings', '2 Coat of EPOXY PRIMER and 2 Coat of EPOXY PAINT'],
  ['2', 'Purlins / Girt', 'Pre Galvanised 120 Gsm — UNPAINTED'],
  ['3', 'Foundation Bolt', 'Black Un Painted'],
]

/** Chapter 1 — General Scope: SL No., Items, Responsibility. */
export const MOCK_GENERAL_SCOPE: readonly Row[] = [
  ['1', 'Design', 'By Floreat'],
  ['2', 'Approval Drawings', 'By Floreat'],
  ['3', 'Fabrication Drawings', 'By Floreat'],
  ['4', 'Fabrication', 'By Floreat'],
  ['5', 'Delivery', 'By Floreat'],
  ['6', 'Erection', 'By Floreat'],
  ['7', 'Transportation', 'By Floreat'],
  ['8', 'Loading & Unloading', 'By Floreat'],
]

/** Chapter 2 — SL No., Description, Specifications, Make / Brand, Yield Strength. */
export const MOCK_PRODUCT_SPECS: readonly Row[] = [
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

export const MOCK_CODES_INTRO =
  'The building was designed according to the following Standard whichever is applicable. The following standards and manuals were used for the design of the proposed steel building.'

/** Chapter 3 — SL No., Description, Code Number, Title, Country. */
export const MOCK_APPLICABLE_CODES: readonly Row[] = [
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

/** Chapter 3 — Design Loads: SL No., Load Type, Value. */
export const MOCK_DESIGN_LOADS: readonly Row[] = [
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

export const MOCK_APPROVAL_DRAWING_DAYS = '7 DAYS'
export const MOCK_DELIVERY_DAYS = '60 DAYS'

/** Chapter 4 — the two lead-time clauses; the second carries a nested list. */
export const MOCK_DELIVERY_PREREQUISITES: readonly string[] = [
  'Signed Purchase Order',
  'Balance payment as specified in payment terms',
  "Floreat's approval drawings duly signed and approved",
]

/**
 * Chapter 5 — SL No., Items, Unit, Quantity. `label` is the bold lead-in and
 * `detail` the plain remainder, mirroring the source's mixed emphasis.
 */
export interface QuantityRow {
  sl: string
  label: string
  detail?: string
  unit: string
  quantity: string
}

export const MOCK_QUANTITY_ESTIMATION: readonly QuantityRow[] = [
  { sl: '1', label: 'Roof Structure:', detail: 'Rafters, Columns and Tie Beams', unit: 'Kg', quantity: '7,211.33' },
  { sl: '2', label: 'Roof Purlins', unit: 'Kg', quantity: '28,237.33' },
  { sl: '3', label: 'Mezzanine Structure.', unit: 'Kg', quantity: '11,210.92' },
  { sl: '3', label: 'Cladding Structure:', detail: 'Cladding Purlins', unit: 'Kg', quantity: '4,003.15' },
  { sl: '4', label: 'Bracings:', detail: 'Wind Bracings, Sag Rod, Flange Brace', unit: 'Kg', quantity: '17,686.03' },
  { sl: '5', label: 'Canopy Structure', unit: 'Kg', quantity: '403.50' },
  { sl: '6', label: 'Canopy Purlins', unit: 'Kg', quantity: '229.39' },
  { sl: '7', label: 'Stair', unit: 'Kg', quantity: '726.95' },
  { sl: '8', label: 'Plinth Area', unit: 'Sqm', quantity: '450.00' },
  { sl: '9', label: 'Roof Sheet Area', unit: 'Sqm', quantity: '7,019.18' },
  { sl: '10', label: 'Decking Sheet', unit: 'Sqm', quantity: '234.54' },
  { sl: '9', label: 'Cladding Sheet Area', unit: 'Sqm', quantity: '157.90' },
  { sl: '10', label: 'Canopy Sheet Area', unit: 'Sqm', quantity: '30.00' },
  { sl: '11', label: 'Sheet Accessories: Flashing, Gutter and Downtake', unit: 'Rmtr', quantity: '1,748.68' },
  { sl: '12', label: 'Doors', unit: 'Sqm', quantity: '21.00' },
  { sl: '13', label: 'Windows', unit: 'Sqm', quantity: '18.00' },
  { sl: '14', label: 'Rolling Shutter', unit: 'Sqm', quantity: '100.00' },
  { sl: '15', label: 'Louvers', unit: 'Sqm', quantity: '100.00' },
  { sl: '16', label: 'Turbo Ventilators', unit: 'Nos', quantity: '10' },
  { sl: '17', label: 'Sky Lights', unit: 'Sqm', quantity: '100.00' },
  { sl: '18', label: 'Wall Lights', unit: 'Sqm', quantity: '100.00' },
  { sl: '19', label: 'Roof Insulation', unit: 'Sqm', quantity: '6,563.18' },
  { sl: '20', label: 'Wall Insulation', unit: 'Sqm', quantity: '104.90' },
  { sl: '21', label: 'Polycarbonate Sheet Area', unit: 'Sqm', quantity: '4,900.00' },
  { sl: '22', label: 'Fascia Structure', unit: 'Sqm', quantity: '4,564.00' },
]

/**
 * Chapter 6 — Pricing. `sl` is blank on tax/subtotal rows; `emphasis` marks
 * the totals the source sets in bold.
 */
export interface PricingRow {
  sl?: string
  item: string
  amount: string
  emphasis?: boolean
}

export const MOCK_PRICING: readonly PricingRow[] = [
  {
    sl: 'A',
    item: 'Fabrication and Supply of Pre Engineered Steel Structure including transportation, Loading and Unloading Charges',
    amount: '₹40,576,333.63',
  },
  { item: 'GST @ 18% =', amount: '₹7,303,740.05' },
  { item: 'Total Amount (Part A) =', amount: '₹47,880,073.68', emphasis: true },
  { sl: 'B', item: 'Installation of Supplied Pre Engineered Steel Structure', amount: '₹3,376,049.92' },
  { item: 'GST @ 18% =', amount: '₹607,688.99' },
  { item: 'Total Amount (Part B) =', amount: '₹3,983,738.90', emphasis: true },
  { sl: 'C', item: 'Total Amount (Part A) + (Part B) Excluding GST', amount: '₹43,952,383.55' },
  { item: 'GST 18% =', amount: '₹7,911,429.04' },
  { item: 'Grand Total =', amount: '₹51,863,812.59', emphasis: true },
]

export const MOCK_PRICING_NOTES: readonly string[] = [
  'The rate includes the cost of all kinds of materials, loading and unloading, transportation, tools, wastage and labour charges.',
  'The amount quoted is inclusive of all taxes.',
]

export const MOCK_PAYMENT_TERMS: readonly string[] = [
  '50% of Total agreement value as advance along with work order',
  '30% of Total agreement value on supply of fabricated materials',
  '15% of Total agreement value on pro rata basis',
  '5% of Total agreement value upon completion of project',
]

export const MOCK_EXCLUSIONS: readonly string[] = [
  'All type civil / RCC work',
  'All type of Electrical & Plumbing works',
  'Supply and installation of handrails',
  'Fire Proofing',
  'EOT Crane Device, Crane Girder, Gantry Girder',
  'Doors, Windows, Rolling Shutter and other Openings',
  'Construction of any type of building other than mentioned in the drawings',
]

export const MOCK_CLIENT_FACILITIES: readonly string[] = [
  'Demolishing any type of existing structure.',
  'Covered and secure space for keeping our materials and machines at site free of cost.',
  'Secured space for stacking and erection of structure.',
  'Uninterrupted three phase power supply with adequate capacity near at site free of cost.',
  'Permission for using hoisting equipment or Crane for lifting of materials at desired locations at the time of work.',
  'Space for Site office with drinking water facilities at free of cost.',
]

export const MOCK_COMPLETION_DAYS = '72 DAYS'

export const MOCK_FORCE_MAJEURE =
  'While every effort will be made to effect the Completion within the stipulated time, it should be expressly understood and accepted by you that the delays occasioned by rain, strike, lockouts, power cuts, acts of God, acts of Government, other natural calamities like floods etc., occurring to our works site/suppliers’ works or any other reasons like running bill payment, delay of concrete work for column/footing or any such site clearance, beyond our control will not be regarded as a breach of contract on our part and will not be subject to any deductions.'

export const MOCK_VALIDITY = 'The rate quoted is valid upto one month.'

export const MOCK_CONTRACT = {
  registeredOffice:
    'FLOREAT BUILDING SYSTEMS PVT LTD, ON THE OTHER HAND, Registered office at 30/56-P, 2nd FLOOR, SK COMPLEX, KOVOOR, MEDICAL COLLEGE ROAD, CALICUT- 673008',
  documents: [
    "FLOREAT's Proposal No. __________ Rev. No. __________ Dated __________ with agreed and initial amendments (if any).",
    "FLOREAT's Standard terms and conditions of sale.",
  ],
} as const
