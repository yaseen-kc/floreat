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
import { QuotationPanel } from './QuotationPanel'

/**
 * The assembled quotation document — covering letter, contents, then chapters
 * 1 through 9 in order. Each chapter holds its own placeholder content until
 * the step is wired to the saved job, quantity and amount records.
 */
export function QuotationDocument() {
  return (
    <article className="space-y-4">
      <QuotationPanel>
        <QuotationLetterhead />
      </QuotationPanel>
      {/* <QuotationPanel>
        <QuotationContents />
      </QuotationPanel> */}
      <QuotationPanel>
        <ChapterScopeOfWork />
      </QuotationPanel>
      <QuotationPanel>
        <ChapterProductSpecs />
      </QuotationPanel>
      <QuotationPanel>
        <ChapterApplicableCodes />
      </QuotationPanel>
      <QuotationPanel>
        <ChapterApprovalDrawings />
      </QuotationPanel>
      <QuotationPanel>
        <ChapterQuantityEstimation />
      </QuotationPanel>
      <QuotationPanel>
        <ChapterPricing />
      </QuotationPanel>
      <QuotationPanel>
        <ChapterExclusions />
      </QuotationPanel>
      <QuotationPanel>
        <ChapterCommercialTerms />
      </QuotationPanel>
      <QuotationPanel>
        <ChapterContractForm />
      </QuotationPanel>
    </article>
  )
}
