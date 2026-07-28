import { DocChapter, DocList } from './DocPrimitives'
import {
  MOCK_APPROVAL_DRAWING_DAYS,
  MOCK_DELIVERY_DAYS,
  MOCK_DELIVERY_PREREQUISITES,
} from './quotation-data'

/** Chapter 4 — approval drawing and delivery lead times. */
export function ChapterApprovalDrawings() {
  return (
    <DocChapter eyebrow="Chapter 4" title="Approval Drawings">
      <DocList
        items={[
          <>
            Floreat will issue Approval Drawings within <strong>{MOCK_APPROVAL_DRAWING_DAYS}</strong>{' '}
            from date of signing contract / issue of Purchase Order and receipt of advance payment.
            BUYER must return the accepted approval drawings preferably within 1 week thereafter;
            otherwise, may result in revision to delivery commitment.
          </>,
          <>
            <p>
              FLOREAT will deliver the materials in <strong>{MOCK_DELIVERY_DAYS}</strong> from the
              latest date of receipt and acceptance of the following at Floreat Head Office:
            </p>
            <DocList items={MOCK_DELIVERY_PREREQUISITES} ordered={false} className="mt-2" />
          </>,
        ]}
      />
    </DocChapter>
  )
}
