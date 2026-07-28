import { DocBlank, DocChapter, DocList, DocProse, DocSubsection } from './DocPrimitives'
import { MOCK_CONTRACT, MOCK_META } from './quotation-data'

/** A label with a rule to sign or date on. */
function SignatureField({ label }: { label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="w-20 shrink-0 font-mono text-[11.5px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <DocBlank width="flex-1" />
    </div>
  )
}

/** Chapter 9 — the executable contract form with fill-in blanks. */
export function ChapterContractForm() {
  return (
    <DocChapter eyebrow="Chapter 9" title="Contract Form" className="space-y-6">
      <DocProse>
        THIS CONTRACT is entered into on: Day <DocBlank width="w-20" /> Month{' '}
        <DocBlank width="w-24" /> Year <DocBlank width="w-24" /> AD
      </DocProse>

      <DocSubsection title="Between">
        <DocProse>
          <DocBlank width="w-full" /> , ON THE ONE HAND, located in <DocBlank width="w-40" /> and
          represented by Mr. <DocBlank width="w-40" /> duly authorized to enter into this contract.
        </DocProse>
      </DocSubsection>

      <DocSubsection title="And">
        <DocProse>
          {MOCK_CONTRACT.registeredOffice} and represented by Mr. <DocBlank width="w-40" /> , duly
          authorized to enter into this contract.
        </DocProse>
      </DocSubsection>

      <DocProse>NOW THEREFORE the parties agree as follows:</DocProse>

      <DocSubsection title="Contract Scope">
        <DocProse>As described in the contract documents.</DocProse>
      </DocSubsection>

      <DocSubsection title="Contract Documents">
        <DocProse>The following documents constitute the contract documents:</DocProse>
        <DocList items={MOCK_CONTRACT.documents} />
      </DocSubsection>

      <DocSubsection title="Contract Price">
        <DocProse>
          INR <DocBlank width="w-56" />
        </DocProse>
      </DocSubsection>

      <DocProse>
        IN WITNESS HEREOF, the authorized parties hereto have executed this Contract.
      </DocProse>

      <div className="grid gap-4 sm:grid-cols-2">
        {[`FOR: ${MOCK_META.company.toUpperCase()}`, 'FOR:'].map((heading) => (
          <div key={heading} className="space-y-3 rounded-md border border-border bg-muted/30 p-4">
            <p className="text-sm font-semibold">{heading}</p>
            <SignatureField label="Name" />
            <SignatureField label="Signature" />
            <SignatureField label="Date" />
          </div>
        ))}
      </div>
    </DocChapter>
  )
}
