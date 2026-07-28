import { cn } from '@/lib/utils'
import { Num } from '@/components/ui/num'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DocChapter, DocList, DocSubsection } from './DocPrimitives'
import { MOCK_PAYMENT_TERMS, MOCK_PRICING, MOCK_PRICING_NOTES } from './quotation-data'

/**
 * Chapter 6 — pricing. Hand-rolled rather than using `DocTable` because the
 * tax and subtotal rows are unnumbered continuations of the part above them,
 * and the totals carry their own emphasis.
 */
export function ChapterPricing() {
  return (
    <DocChapter eyebrow="Chapter 6" title="Pricing" className="space-y-6">
      <Table className="border-collapse min-w-[560px]">
        <caption className="sr-only">Priced parts, tax and grand total</caption>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead scope="col" className="w-16 font-mono text-[11.5px] uppercase tracking-wide text-muted-foreground border-r">
              SL No.
            </TableHead>
            <TableHead scope="col" className="min-w-72 font-mono text-[11.5px] uppercase tracking-wide text-muted-foreground border-r">
              Items
            </TableHead>
            <TableHead scope="col" className="min-w-40 text-right font-mono text-[11.5px] uppercase tracking-wide text-muted-foreground">
              Amount (Rs.)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_PRICING.map((row, i) => (
            <TableRow key={i} className={cn(row.emphasis && 'bg-muted/30')}>
              <TableCell className="align-top border-r text-center font-mono font-semibold">
                {row.sl ?? ''}
              </TableCell>
              <TableCell className={cn('align-top border-r whitespace-normal font-semibold', !row.sl && 'text-right')}>
                {row.item}
              </TableCell>
              <TableCell className={cn('align-top text-right', row.emphasis && 'font-semibold')}>
                <Num>{row.amount}</Num>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DocSubsection title="Notes">
        <DocList items={MOCK_PRICING_NOTES} />
      </DocSubsection>

      <DocSubsection title="6.1 Payment Terms">
        <p className="text-sm font-semibold">Part A: Fabrication and Supply</p>
        <DocList items={MOCK_PAYMENT_TERMS} />
      </DocSubsection>
    </DocChapter>
  )
}
