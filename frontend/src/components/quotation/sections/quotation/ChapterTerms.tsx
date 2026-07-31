import { DocChapter, DocList, DocSubsection } from './DocPrimitives'

const MOCK_EXCLUSIONS: readonly string[] = [
  'All type civil / RCC work',
  'All type of Electrical & Plumbing works',
  'Supply and installation of handrails',
  'Fire Proofing',
  'EOT Crane Device, Crane Girder, Gantry Girder',
  'Doors, Windows, Rolling Shutter and other Openings',
  'Construction of any type of building other than mentioned in the drawings',
]

const MOCK_CLIENT_FACILITIES: readonly string[] = [
  'Demolishing any type of existing structure.',
  'Covered and secure space for keeping our materials and machines at site free of cost.',
  'Secured space for stacking and erection of structure.',
  'Uninterrupted three phase power supply with adequate capacity near at site free of cost.',
  'Permission for using hoisting equipment or Crane for lifting of materials at desired locations at the time of work.',
  'Space for Site office with drinking water facilities at free of cost.',
]

const MOCK_COMPLETION_DAYS = '72 DAYS'

const MOCK_FORCE_MAJEURE =
  'While every effort will be made to effect the Completion within the stipulated time, it should be expressly understood and accepted by you that the delays occasioned by rain, strike, lockouts, power cuts, acts of God, acts of Government, other natural calamities like floods etc., occurring to our works site/suppliers’ works or any other reasons like running bill payment, delay of concrete work for column/footing or any such site clearance, beyond our control will not be regarded as a breach of contract on our part and will not be subject to any deductions.'

const MOCK_VALIDITY = 'The rate quoted is valid upto one month.'

/** Chapter 7 — work explicitly outside Floreat's scope. */
export function ChapterExclusions() {
  return (
    <DocChapter eyebrow="Chapter 7" title="Exclusions">
      <DocList items={MOCK_EXCLUSIONS} />
    </DocChapter>
  )
}

/** Chapter 8 — client obligations, completion time and offer validity. */
export function ChapterCommercialTerms() {
  return (
    <DocChapter eyebrow="Chapter 8" title="Commercial Terms and Conditions" className="space-y-6">
      <DocSubsection title="A. Facilities to be Provided by Client">
        <DocList items={MOCK_CLIENT_FACILITIES} />
      </DocSubsection>

      <DocSubsection title="B. Completion Time">
        <DocList
          items={[
            <>
              All works within our scope above will be completed within{' '}
              <strong>{MOCK_COMPLETION_DAYS}</strong> from the date of commencement of the project.
              The project will commence within 10 days from the date of your confirmed order / bank
              transacted date of receipt of advance amount.
            </>,
            MOCK_FORCE_MAJEURE,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="C. Validity of Offer">
        <DocList items={[MOCK_VALIDITY]} />
      </DocSubsection>
    </DocChapter>
  )
}
