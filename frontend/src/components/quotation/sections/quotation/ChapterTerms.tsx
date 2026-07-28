import { DocChapter, DocList, DocSubsection } from './DocPrimitives'
import {
  MOCK_CLIENT_FACILITIES,
  MOCK_COMPLETION_DAYS,
  MOCK_EXCLUSIONS,
  MOCK_FORCE_MAJEURE,
  MOCK_VALIDITY,
} from './quotation-data'

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
