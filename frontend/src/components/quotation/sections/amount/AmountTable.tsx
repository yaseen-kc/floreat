import { DEFAULT_AMOUNT_ITEMS } from '@/schemas/amount.schema'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Badge } from '@/components/ui/badge'
import { Num } from '@/components/ui/num'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calculator } from 'lucide-react'

/**
 * Read-only bill-of-quantities table for Step 11. Displays the 36 canonical
 * amount line items. All numeric fields are zero until the equations are wired
 * in a future pass.
 */
export function AmountTable() {
  return (
    <SectionCard icon={<Calculator />} title="Amount">
      <Table className="min-w-[1400px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 text-right">#</TableHead>
            <TableHead className="min-w-52">Description</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Rate Fab.</TableHead>
            <TableHead className="text-right">Rate Erec.</TableHead>
            <TableHead className="text-right">Rate Load.</TableHead>
            <TableHead className="text-right">Amt. Fab.</TableHead>
            <TableHead className="text-right">Amt. Erec.</TableHead>
            <TableHead className="text-right">Amt. Load.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DEFAULT_AMOUNT_ITEMS.map((item, index) => (
            <TableRow key={item.description}>
              <TableCell className="text-right text-muted-foreground">
                <Num>{index + 1}</Num>
              </TableCell>
              <TableCell className="font-medium">{item.description}</TableCell>
              <TableCell>
                <Badge variant="outline">{item.unit}</Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
              <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
              <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
              <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
              <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
              <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
              <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
