import { DocChapter, DocList } from './DocPrimitives'

/** Chapter 4 — approval drawing and delivery lead times. */
export function ChapterApprovalDrawings() {
  const approvalDays = 7
  const approvalUnit = 'DAYS'
  const deliveryDays = 60

  return (
    <DocChapter eyebrow="Chapter 4" title="Approval Drawings">
      <DocList
        items={[
          <>
            Floreat will issue Approval Drawings within <strong>{approvalDays} {approvalUnit}</strong>{' '}
            from date of signing contract / issue of Purchase Order and receipt of advance payment.
            BUYER must return the accepted approval drawings preferably within 1 week thereafter;
            otherwise, may result in revision to delivery commitment.
          </>,
          <>
            <p>
              FLOREAT will deliver the materials in <strong>{deliveryDays} DAYS</strong> from the
              latest date of receipt and acceptance of the following at Floreat Head Office:
            </p>
            <DocList items={[
              'Signed Purchase Order',
              'Balance payment as specified in payment terms',
              "Floreat's approval drawings duly signed and approved",
            ]} ordered={false} className="mt-2" />
          </>,
        ]}
      />
    </DocChapter>
  )
}
