import type { CreateSpecInput, CreateRateInput } from '../schemas/spec.schema.js'

export interface SeedSpec extends CreateSpecInput {
  jobId: string
}

/**
 * Rate master items used by the Prisma seed runner. Rate is a global lookup
 * table keyed by unique `item` (not job-scoped). Mirrors `rate.json`: only
 * STEEL STRUCTURE carries full pricing; the rest are draft rows (item + unit),
 * to be priced later. Derived rates are computed on read (never seeded).
 */
export const rateSeedData: CreateRateInput[] = [
  {
    item: 'STEEL STRUCTURE',
    unit: 'KG',
    material: 63,
    fabrication: 15,
    transportation: 1.5,
    installation: 8,
    loadingUnloading: 3,
    overheads: 0,
    others: 0,
    marginPercentage: 15,
  },
  { item: 'WIND BRACING - ROD', unit: 'RM' },
  { item: 'SAG ROD - 12 MM', unit: 'RM' },
  { item: 'FLANGE BRACE - GI', unit: 'KG' },
  { item: 'Z/C - PURLINS', unit: 'KG' },
  { item: 'PUFF SHEET 30MM THICK - ROOF', unit: 'SQM' },
  { item: 'PPGL 0.4MM THICK - CLADDING', unit: 'SQM' },
  { item: 'PPGL 0.4MM THICK - CANOPY', unit: 'SQM' },
  { item: '12 MM DIA BOLT - ORD', unit: 'NOS' },
  { item: '16 MM DIA BOLT - HSFG', unit: 'NOS' },
  { item: '20 MM FOUNDATION BOLT', unit: 'NOS' },
  { item: '20 MM ANCHOR BOLT', unit: 'NOS' },
  { item: 'RIDGE', unit: 'RM' },
  { item: 'GUTTER', unit: 'RM' },
  { item: 'DOWNTAKE', unit: 'RM' },
  { item: 'DRIP TRIM', unit: 'RM' },
  { item: 'FLASHING', unit: 'RM' },
  { item: 'ROLLING SHUTTER', unit: 'SQM' },
  { item: 'LOUVERS', unit: 'NOS' },
  { item: 'SKY LIGHT', unit: 'NOS' },
  { item: 'WALL LIGHT', unit: 'NOS' },
  { item: 'INSULATION', unit: 'SQM' },
  { item: 'TURBO VENTILATORS', unit: 'NOS' },
  { item: 'DECKING SHEET', unit: 'SQM' },
  { item: 'SHEAR STUDS', unit: 'NOS' },
  { item: 'POLYCARBONATE SHEET', unit: 'SQM' },
  { item: 'STAIR - HR SECTION', unit: 'KG' },
  { item: 'STAIR 6MM CHQ PLATE STEPS', unit: 'KG' },
  { item: 'HANDRAIL', unit: 'KG' },
  { item: 'CANOPY SIDE COVERING', unit: 'SQM' },
  { item: 'DOORS', unit: 'SQM' },
  { item: 'WINDOWS', unit: 'SQM' },
  { item: 'FASCIA STRUCTURE', unit: 'KG' },
  { item: 'FASCIA COVERING SHEET / BOARD', unit: 'SQM' },
  { item: 'INTERNAL PARTITIONS', unit: 'SQM' },
]

/**
 * Deterministic job-owned product specifications used by the Prisma seed runner.
 * Spec is 1-to-1 with a Job, so there is at most one entry per seed job.
 */
export const specSeedData: SeedSpec[] = [
  {
    jobId: 'seed_job_1',
    products: [
      {
        code: 'PRODUCT-1',
        description: 'Fabricated Columns and Beams',
        specification: 'Fabricated from Plates or Stocks by continuous welding process. Conform to IS2062 Grade E345 / ASTM A572-12 Grade 50. Shall be killed / semi-killed. Minimum plate thickness: 4 mm.',
        makeOrBrand: 'JSW, TATA',
        yieldStrengthMpa: 345,
      },
    ],
  },
  {
    jobId: 'seed_job_2',
    products: [
      {
        code: 'PRODUCT-1',
        description: 'Cold Formed Purlins / Girts',
        specification: 'ASTM A653 Grade 275. Z120 coating or equivalent.',
        makeOrBrand: 'JSW',
        yieldStrengthMpa: 275,
      },
    ],
  },
  {
    jobId: 'seed_job_3',
    products: [
      {
        code: 'PRODUCT-1',
        description: 'Roofing Sheet',
        specification: '30 mm PUF Sheet.',
        makeOrBrand: 'Metecno, JSW',
        yieldStrengthMpa: 550,
      },
    ],
  },
  {
    jobId: 'seed_job_4',
    products: [
      {
        code: 'PRODUCT-1',
        description: 'Cladding Sheet',
        specification: 'Zincalume Steel. Roof sheet 0.40 mm TCT. Grade 550.',
        makeOrBrand: 'JSW',
        yieldStrengthMpa: 550,
      },
    ],
  },
  {
    jobId: 'seed_job_5',
    products: [
      {
        code: 'PRODUCT-1',
        description: 'Decking Sheet',
        specification: 'Decking Profile 50/230 (Depth/Pitch). Panel thickness: 0.8 mm. Yield Strength: 250 MPa. Zinc Coating: Z120 GSM.',
        makeOrBrand: 'JSW',
        yieldStrengthMpa: 250,
      },
    ],
  },
]
