import { cn } from '@/lib/utils'
import { Num } from '@/components/ui/num'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DocChapter, DocList, DocSubsection } from './DocPrimitives'

/**
 * A priced line. `sl` is blank on tax/subtotal rows; `emphasis` marks the
 * totals the source sets in bold.
 */
interface PricingRow {
  sl?: string
  item: string
  amount: string
  emphasis?: boolean
}

const MOCK_PRICING: readonly PricingRow[] = [
  {
    sl: 'A',
    item: 'Fabrication and Supply of Pre Engineered Steel Structure including transportation, Loading and Unloading Charges',
    amount: '₹40,576,333.63',
  },
  { item: 'GST @ 18% =', amount: '₹7,303,740.05' },
  { item: 'Total Amount (Part A) =', amount: '₹47,880,073.68', emphasis: true },
  { sl: 'B', item: 'Installation of Supplied Pre Engineered Steel Structure', amount: '₹3,376,049.92' },
  { item: 'GST @ 18% =', amount: '₹607,688.99' },
  { item: 'Total Amount (Part B) =', amount: '₹3,983,738.90', emphasis: true },
  { sl: 'C', item: 'Total Amount (Part A) + (Part B) Excluding GST', amount: '₹43,952,383.55' },
  { item: 'GST 18% =', amount: '₹7,911,429.04' },
  { item: 'Grand Total =', amount: '₹51,863,812.59', emphasis: true },
]

const MOCK_PRICING_NOTES: readonly string[] = [
  'The rate includes the cost of all kinds of materials, loading and unloading, transportation, tools, wastage and labour charges.',
  'The amount quoted is inclusive of all taxes.',
]

const MOCK_PAYMENT_TERMS: readonly string[] = [
  '50% of Total agreement value as advance along with work order',
  '30% of Total agreement value on supply of fabricated materials',
  '15% of Total agreement value on pro rata basis',
  '5% of Total agreement value upon completion of project',
]

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
