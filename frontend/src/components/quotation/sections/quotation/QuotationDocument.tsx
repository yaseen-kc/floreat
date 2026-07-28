import { QuotationLetterhead } from './QuotationLetterhead'
import { QuotationContents } from './QuotationContents'
import { ChapterScopeOfWork } from './ChapterScopeOfWork'
import { ChapterProductSpecs } from './ChapterProductSpecs'
import { ChapterApplicableCodes } from './ChapterApplicableCodes'
import { ChapterApprovalDrawings } from './ChapterApprovalDrawings'
import { ChapterQuantityEstimation } from './ChapterQuantityEstimation'
import { ChapterPricing } from './ChapterPricing'
import { ChapterCommercialTerms, ChapterExclusions } from './ChapterTerms'
import { ChapterContractForm } from './ChapterContractForm'

/**
 * The assembled quotation document — covering letter, contents, then chapters
 * 1 through 9 in order. Content is placeholder data (see `quotation-data.ts`)
 * until the step is wired to the saved job, quantity and amount records.
 */
export function QuotationDocument() {
  return (
    <article className="rounded-[14px] border border-border bg-card p-6 max-[640px]:p-4">
      <QuotationLetterhead />
      <hr className="my-7 border-border" />
      <div className="space-y-8">
        <QuotationContents />
        <ChapterScopeOfWork />
        <ChapterProductSpecs />
        <ChapterApplicableCodes />
        <ChapterApprovalDrawings />
        <ChapterQuantityEstimation />
        <ChapterPricing />
        <ChapterExclusions />
        <ChapterCommercialTerms />
        <ChapterContractForm />
      </div>
    </article>
  )
}
