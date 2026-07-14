import type { CreateSpecInput } from '../schemas/spec.schema.js'

export interface SeedSpec extends CreateSpecInput {
  jobId: string
}

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
