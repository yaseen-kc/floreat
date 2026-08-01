import { useShallow } from 'zustand/react/shallow'
import { cn } from '@/lib/utils'
import { Num } from '@/components/ui/num'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuotationStore } from '@/stores/quotation-store'
import { DocChapter, DocList, DocSubsection } from './DocPrimitives'

const PAYMENT_ROWS = [
  { stage: 'Advance payment along with the Work Order',    payment: <><strong>50%</strong> of the total agreement value</> },
  { stage: 'On supply of fabricated materials',            payment: <><strong>30%</strong> of the total agreement value</> },
  { stage: 'On a pro-rata basis during project execution', payment: <><strong>15%</strong> of the total agreement value</> },
  { stage: 'Upon completion of the project',              payment: <><strong>5%</strong> of the total agreement value</> },
] as const

const EXCLUSIONS = [
  'All types of Civil / RCC works.',
  'All types of electrical and plumbing works.',
  'Supply and installation of handrails.',
  'Fireproofing works.',
  'EOT crane system, crane girders, and gantry girders.',
  'Doors, windows, rolling shutters, and other openings.',
  'Construction of any building or structure not specifically mentioned in the approved drawings.',
] as const

const FACILITIES = [
  'Demolition of any existing structures, if required.',
  'Covered and secure storage space for materials and machinery.',
  'Safe and adequate space for stacking materials and erection activities.',
  'Uninterrupted three-phase power supply with sufficient capacity near the work site.',
  'Permission to use hoisting equipment or cranes for lifting materials to the required locations during execution.',
  'Site office space with drinking water facilities.',
] as const

const SIGNATORIES = [
  { name: 'RAJISHA TR',  designation: 'ESTIMATION ENGINEER', phone: '6282636228', email: 'sales@floreat.in',  signature: '' },
  { name: 'HANEES K P',  designation: 'DIRECTOR-TECHNICAL',  phone: '9745219955', email: 'hanizkp@floreat.in', signature: '/hanees.jpg' },
] as const

interface PricingRow {
  sl?: string
  item: string
  amount: string
  emphasis?: boolean
}

const parseNum = (v?: string | null) => (v ? parseFloat(v) : 0)
const fmt = (n: number) =>
  '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })





export function ChapterPricing() {
  const { amount } = useQuotationStore(useShallow((s) => ({ amount: s.amount })))

  const fab      = parseNum(amount?.totalFabricationAmount)
  const erec     = parseNum(amount?.totalErrectionAmount)
  const load     = parseNum(amount?.totalLoadingAmount)
  const partBBase = erec + load
  const partAGst  = fab * 0.18
  const partBGst  = partBBase * 0.18
  const partCBase = fab + partBBase

  const pricing: readonly PricingRow[] = [
    { sl: 'A', item: 'Fabrication and Supply of Pre Engineered Steel Structure including transportation, Loading and Unloading Charges', amount: fmt(fab) },
    { item: 'GST @ 18% =', amount: fmt(partAGst) },
    { item: 'Total Amount (Part A) =', amount: fmt(fab + partAGst), emphasis: true },
    { sl: 'B', item: 'Installation of Supplied Pre Engineered Steel Structure', amount: fmt(partBBase) },
    { item: 'GST @ 18% =', amount: fmt(partBGst) },
    { item: 'Total Amount (Part B) =', amount: fmt(partBBase + partBGst), emphasis: true },
    { sl: 'C', item: 'Total Amount (Part A) + (Part B) Excluding GST', amount: fmt(partCBase) },
    { item: 'GST 18% =', amount: fmt(partAGst + partBGst) },
    { item: 'Grand Total =', amount: fmt(partCBase * 1.18), emphasis: true },
  ]

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
          {pricing.map((row, i) => (
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
        <DocList items={[
          'The quoted rate includes the cost of all materials, loading and unloading, transportation, tools and equipment, wastage, and labour charges.',
          'The quoted amount is inclusive of all applicable taxes.',
        ]} />
      </DocSubsection>

      <DocSubsection title="Payment Terms">
        <DocSubsection title="Fabrication and Supply">
          <Table className="border-collapse min-w-[480px]">
            <caption className="sr-only">Part A payment schedule</caption>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead scope="col" className="font-mono text-[11.5px] uppercase tracking-wide text-muted-foreground border-r">Stage</TableHead>
                <TableHead scope="col" className="text-right font-mono text-[11.5px] uppercase tracking-wide text-muted-foreground">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAYMENT_ROWS.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="align-top border-r whitespace-normal text-sm">{row.stage}</TableCell>
                  <TableCell className="align-top text-right text-sm">{row.payment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DocSubsection>
      </DocSubsection>

      <DocSubsection title="Exclusions">
        <DocList items={[...EXCLUSIONS]} />
      </DocSubsection>

      <DocSubsection title="Commercial Terms and Conditions">
        <DocSubsection title="Facilities to be Provided by the Client">
          <DocList items={[...FACILITIES]} />
        </DocSubsection>
        <DocSubsection title="Completion Time">
          <DocList items={[
            <>All work within our scope shall be completed within <strong>72 days</strong> from the date of commencement of the project. The project shall commence within <strong>10 days</strong> from the date of receipt of the confirmed Work Order and realization of the advance payment.</>,
            'Every reasonable effort will be made to complete the project within the stipulated period. However, delays arising from circumstances beyond our control—including but not limited to rain, strikes, lockouts, power failures, acts of God, government actions, floods, supplier delays, delayed running bill payments, delays in civil works such as foundations or columns, site clearance issues, or similar unforeseen events—shall not be considered a breach of contract and shall not attract any penalties or deductions.',
          ]} />
        </DocSubsection>
        <DocSubsection title="Validity of Offer">
          <DocList items={[<>This quotation is valid for <strong>one month</strong> from the date of issue.</>]} />
        </DocSubsection>
      </DocSubsection>

      <div className="flex justify-between pt-4 mt-6 border-t">
        {SIGNATORIES.map((person) => (
          <table key={person.name} className="text-sm border-collapse">
            <tbody>
              <tr><td className="pb-2 h-14">{person.signature && <img src={person.signature} alt="Signature" className="h-12 w-auto" />}</td></tr>
              <tr><td className="pb-0.5 font-semibold">{person.name}</td></tr>
              <tr><td className="text-muted-foreground">{person.designation}</td></tr>
              <tr><td className="text-muted-foreground"><Num>{person.phone}</Num></td></tr>
              <tr><td className="text-muted-foreground">{person.email}</td></tr>
            </tbody>
          </table>
        ))}
      </div>

    </DocChapter>
  )
}
