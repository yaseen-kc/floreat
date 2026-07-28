import { Num } from '@/components/ui/num'
import { DocProse } from './DocPrimitives'
import { MOCK_LETTER_BODY, MOCK_META, MOCK_SIGNATORIES } from './quotation-data'

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
  return (
    <header className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <address className="text-sm font-medium not-italic">{MOCK_META.client}</address>
        <div className="space-y-1">
          <MetaItem label="Ref" value={MOCK_META.ref} />
          <MetaItem label="Date" value={MOCK_META.date} />
        </div>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="shrink-0 font-semibold">Subject:</dt>
          <dd className="text-pretty text-foreground/85">{MOCK_META.subject}</dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="shrink-0 font-semibold">Reference:</dt>
          <dd>
            <Num>{MOCK_META.reference}</Num>
          </dd>
        </div>
      </dl>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Sir,</p>
        {MOCK_LETTER_BODY.map((paragraph) => (
          <DocProse key={paragraph}>{paragraph}</DocProse>
        ))}
      </div>

      <div className="space-y-1 text-sm">
        <p className="font-semibold">Assuring you the best of our services.</p>
        <p className="pt-2 font-semibold">Thanking you,</p>
        <p className="font-semibold">For {MOCK_META.company}</p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {MOCK_SIGNATORIES.map((person) => (
          <li key={person.name} className="rounded-md border border-border bg-muted/30 p-3">
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
