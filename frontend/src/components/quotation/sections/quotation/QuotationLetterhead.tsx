import { Num } from '@/components/ui/num'
import { useQuotationStore, type ProjectInfo } from '@/stores/quotation-store'
import { DocProse } from './DocPrimitives'

const META = {
  ref: 'FBS/SM/212/17/12/2020',
  date: '17 December 2020',
  client: 'M/S MOCA ARCHITECTS',
  subject:
    '20-212 Offer for Supply and Installation of Pre Engineered Steel Hypermarket Building at Wandoor',
  reference: 'FBS/SM/212/17/12/2020',
  company: 'Floreat Building Systems Pvt Ltd',
} as const

const LETTER_BODY: readonly string[] = [
  'We take this opportunity to thank you for the enquiry and further to the discussion we had with you, we hereby forward our Proposal.',
  `The Scope of Work, terms and Conditions for the work is enclosed as per our offer no. ${META.ref}.`,
  'We hope you will find the details furnished as per your requirement. Please feel free to call us for any information.',
]

type LetterheadInput = Partial<Record<keyof ProjectInfo, unknown>>

function provided(value: unknown): string {
  return typeof value === 'string' && value.trim() ? value.trim() : 'Not provided'
}

function formatDate(value: unknown): string {
  const raw = provided(value)
  if (raw === 'Not provided') return raw

  const isoDateMatch = /^(\d{4}-\d{2}-\d{2})T/.exec(raw)
  if (isoDateMatch) return isoDateMatch[1]

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
  if (!match) return raw
  const date = new Date(`${raw}T00:00:00Z`)
  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== Number(match[1]) ||
    date.getUTCMonth() + 1 !== Number(match[2]) ||
    date.getUTCDate() !== Number(match[3])
  ) {
    return raw
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function buildQuotationData(projectInfo: LetterheadInput = {}) {
  const ref = provided(projectInfo.refNo)
  return {
    META: {
      ref,
      date: formatDate(projectInfo.date),
      client: provided(projectInfo.clientName),
      subject: provided(projectInfo.subject),
      reference: ref,
      company: provided(projectInfo.firmName),
    },
    LETTER_BODY: [
      LETTER_BODY[0],
      `The Scope of Work, terms and Conditions for the work is enclosed as per our offer no. ${ref}.`,
      LETTER_BODY[2],
    ] as const,
    SIGNATORIES: [
      { name: provided(projectInfo.estimationEngineerName), role: 'Estimation Engineer', mobile: provided(projectInfo.estimationEngineerMobile) },
      { name: provided(projectInfo.headOfSalesName), role: 'Head of Sales', mobile: provided(projectInfo.headOfSalesMobile) },
    ] as const,
  }
}

/** Label + value pair for the ref/date block. */
function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="font-mono text-[11.5px] uppercase tracking-wide text-muted-foreground pt-px">
        {label}
      </span>
      <Num className="text-sm font-medium">{value}</Num>
    </div>
  )
}

/**
 * The covering letter: reference, date, addressee, subject and the closing
 * signature block.
 */
export function QuotationLetterhead() {
  const projectInfo = useQuotationStore((state) => state.projectInfo)
  const { META, LETTER_BODY, SIGNATORIES } = buildQuotationData(projectInfo)

  return (
    <header className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <address className="text-sm font-medium not-italic">{META.client}</address>
        <div className="space-y-1">
          <MetaItem label="Ref" value={META.ref} />
          <MetaItem label="Date" value={META.date} />
        </div>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="shrink-0 font-semibold">Subject:</dt>
          <dd className="text-pretty text-foreground/85">{META.subject}</dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="shrink-0 font-semibold">Reference:</dt>
          <dd>
            <Num>{META.reference}</Num>
          </dd>
        </div>
      </dl>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Sir,</p>
        {LETTER_BODY.map((paragraph) => (
          <DocProse key={paragraph}>{paragraph}</DocProse>
        ))}
      </div>

      <div className="space-y-1 text-sm">
        <p className="font-semibold">Assuring you the best of our services.</p>
        <p className="pt-2 font-semibold">Thanking you,</p>
        <p className="font-semibold">For {META.company}</p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {SIGNATORIES.map((person, index) => (
          <li key={`${person.role}-${index}`} className="rounded-md border border-border bg-muted/30 p-3">
            <p className="text-sm font-semibold">{person.name}</p>
            <p className="text-sm text-muted-foreground">{person.role}</p>
            <p className="text-sm text-muted-foreground">
              Mob: <Num>{person.mobile}</Num>
            </p>
          </li>
        ))}
      </ul>
    </header>
  )
}
