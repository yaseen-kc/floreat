import type { CreateSpecInput } from '../schemas/spec.schema.js'

export interface SeedSpec extends CreateSpecInput {
  id: string
}

/** Deterministic global product specifications used by the Prisma seed runner. */
export const specSeedData: SeedSpec[] = [
  {
    id: 'spec-fabricated-columns-beams',
    description: 'Fabricated Columns and Beams',
    specifications: [
      'Fabricated from Plates or Stocks by continuous welding process.',
      'Conform to IS2062 Grade E345 / ASTM A572-12 Grade 50.',
      'Shall be killed / semi-killed.',
      'Minimum plate thickness: 4 mm.',
    ],
    makeOrBrand: ['JSW', 'TATA'],
    yieldStrengthMpa: 345,
  },
  {
    id: 'spec-cold-formed-purlins-girts',
    description: 'Cold Formed Purlins / Girts',
    specifications: ['ASTM A653 Grade 275.', 'Z120 coating or equivalent.'],
    makeOrBrand: ['JSW'],
    yieldStrengthMpa: 275,
  },
  {
    id: 'spec-roofing-sheet',
    description: 'Roofing Sheet',
    specifications: ['30 mm PUF Sheet.'],
    makeOrBrand: ['Metecno', 'JSW'],
    yieldStrengthMpa: 550,
  },
  {
    id: 'spec-cladding-sheet',
    description: 'Cladding Sheet',
    specifications: ['Zincalume Steel.', 'Roof sheet 0.40 mm TCT.', 'Grade 550.'],
    makeOrBrand: ['JSW'],
    yieldStrengthMpa: 550,
  },
  {
    id: 'spec-decking-sheet',
    description: 'Decking Sheet',
    specifications: [
      'Decking Profile 50/230 (Depth/Pitch).',
      'Panel thickness: 0.8 mm.',
      'Yield Strength: 250 MPa.',
      'Zinc Coating: Z120 GSM.',
    ],
    makeOrBrand: ['JSW'],
    yieldStrengthMpa: 250,
  },
  {
    id: 'spec-primary-connection',
    description: 'Primary Connection',
    specifications: ['Primary bolts conforming to ASTM A325 (or equivalent).', 'Grade 8.8.'],
    makeOrBrand: ['UNBRACO'],
    yieldStrengthMpa: 640,
  },
  {
    id: 'spec-secondary-connection',
    description: 'Secondary Connection',
    specifications: ['Secondary machine bolts conforming to ASTM A307 (or equivalent).', 'Grade 4.6.'],
    makeOrBrand: ['SS'],
    yieldStrengthMpa: 240,
  },
  {
    id: 'spec-structural-steel-sections',
    description: 'Hot-Rolled Structural Steel Sections',
    specifications: ['Conform to IS 2062 Grade E350.', 'Rolled sections conform to IS 808.', 'Mill test certificates required.'],
    makeOrBrand: ['JSW', 'TATA'],
    yieldStrengthMpa: 350,
  },
  {
    id: 'spec-high-strength-bolts',
    description: 'High-Strength Structural Bolts',
    specifications: ['Conform to ASTM F3125 Grade A325 or equivalent.', 'Hot-dip galvanised where exposed.', 'Minimum property class: 8.8.'],
    makeOrBrand: ['UNBRACO', 'TVS'],
    yieldStrengthMpa: 830,
  },
  {
    id: 'spec-insulated-roofing-panels',
    description: 'Insulated Roofing Panels',
    specifications: ['30 mm PUF insulated sandwich panel.', 'Pre-painted steel outer skin.', 'Minimum external sheet thickness: 0.50 mm.'],
    makeOrBrand: ['Metecno', 'JSW'],
    yieldStrengthMpa: 550,
  },
  {
    id: 'spec-wall-cladding-panels',
    description: 'Wall Cladding Panels',
    specifications: ['Pre-painted galvanised steel cladding.', 'Minimum sheet thickness: 0.45 mm.', 'Profiled for weather-tight lap joints.'],
    makeOrBrand: ['JSW', 'TATA'],
    yieldStrengthMpa: 550,
  },
  {
    id: 'spec-thermal-insulation-material',
    description: 'Thermal Insulation Material',
    specifications: ['Rock wool or glass wool insulation.', 'Minimum density: 48 kg/m³.', 'Factory laminated vapour barrier.'],
    makeOrBrand: ['Rockwool', 'Saint-Gobain'],
    yieldStrengthMpa: 48,
  },
  {
    id: 'spec-protective-paint-coating',
    description: 'Protective Paint and Coating System',
    specifications: ['Two-coat epoxy primer system for fabricated steel.', 'Finish coat compatible with the approved colour schedule.', 'Minimum dry film thickness: 120 microns.'],
    makeOrBrand: ['Asian Paints', 'Jotun'],
    yieldStrengthMpa: 120,
  },
  {
    id: 'spec-foundation-materials',
    description: 'Foundation Anchor Bolt and Base Plate Materials',
    specifications: ['Anchor bolts conforming to IS 5624 or equivalent.', 'Base plates fabricated from IS 2062 steel.', 'Template alignment required before concrete pour.'],
    makeOrBrand: ['TATA', 'JSW'],
    yieldStrengthMpa: 345,
  },
  {
    id: 'spec-doors-windows-accessories',
    description: 'Steel Doors, Windows and Accessories',
    specifications: ['Pressed steel frames with corrosion-resistant finish.', 'Hardware to include hinges, locks and fasteners.', 'Openings to be supplied to approved schedule.'],
    makeOrBrand: ['ASSA ABLOY', 'Saint-Gobain'],
    yieldStrengthMpa: 250,
  },
]
