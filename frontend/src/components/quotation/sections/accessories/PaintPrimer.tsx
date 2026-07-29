import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Paintbrush } from 'lucide-react'
import type {
  PaintType,
  PurlinsGirtsFinish,
  PurlinsGirtsPaint,
  FoundationBoltFinish,
} from '@/api/quotation/accessories/getAccessories'
import {
  PAINT_TYPE_OPTIONS,
  PURLINS_GIRTS_FINISH_OPTIONS,
  PURLINS_GIRTS_PAINT_OPTIONS,
  FOUNDATION_BOLT_FINISH_OPTIONS,
} from './accessoriesOptions'

/** Paint & primer specifications (frames, purlins & girts, foundation bolt) for Step 6. */
export function PaintPrimer() {
  const { accessories, setAccessories } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories })),
  )

  return (
    <SectionCard icon={<Paintbrush className="w-3.5 h-3.5" />} title="Paint & Primer">
      <Table className="min-w-[720px] border-collapse text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50 border-b">
            <TableHead scope="col" className="w-16 text-center">SL</TableHead>
            <TableHead scope="col" className="min-w-80">ITEMS</TableHead>
            <TableHead scope="col" className="min-w-96">FINISHES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-center font-medium text-muted-foreground">1</TableCell>
            <TableCell className="font-medium">FRAMES, BUILT-UP / HR SECTIONS / BRACINGS</TableCell>
            <TableCell>
              <div className="flex min-w-80 items-center gap-3">
                <InputUnit
                  value={accessories.framesPrimerCoats}
                  unit="coats"
                  step={1}
                  aria-label="Frames primer coats"
                  onChange={(value) => setAccessories({ framesPrimerCoats: value })}
                />
                <PaintSelect
                  ariaLabel="Frames primer type"
                  value={accessories.framesPrimerType}
                  options={PAINT_TYPE_OPTIONS}
                  onChange={(value) => setAccessories({ framesPrimerType: value as PaintType })}
                />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center font-medium text-muted-foreground">-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>
              <div className="flex min-w-80 items-center gap-3">
                <InputUnit
                  value={accessories.framesPaintCoats}
                  unit="coats"
                  step={1}
                  aria-label="Frames paint coats"
                  onChange={(value) => setAccessories({ framesPaintCoats: value })}
                />
                <PaintSelect
                  ariaLabel="Frames paint type"
                  value={accessories.framesPaintType}
                  options={PAINT_TYPE_OPTIONS}
                  onChange={(value) => setAccessories({ framesPaintType: value as PaintType })}
                />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center font-medium text-muted-foreground">2</TableCell>
            <TableCell className="font-medium">PURLINS / GIRT</TableCell>
            <TableCell>
              <div className="flex min-w-80 items-center gap-3">
                <PaintSelect
                  ariaLabel="Purlins and girts finish"
                  value={accessories.purlinsGirtsFinish}
                  options={PURLINS_GIRTS_FINISH_OPTIONS}
                  onChange={(value) => setAccessories({ purlinsGirtsFinish: value as PurlinsGirtsFinish })}
                />
                <InputUnit
                  value={accessories.purlinsGirtsGsm}
                  unit="gsm"
                  step={1}
                  aria-label="Purlins and girts GSM"
                  onChange={(value) => setAccessories({ purlinsGirtsGsm: value })}
                />
                <PaintSelect
                  ariaLabel="Purlins and girts paint"
                  value={accessories.purlinsGirtsPaint}
                  options={PURLINS_GIRTS_PAINT_OPTIONS}
                  onChange={(value) => setAccessories({ purlinsGirtsPaint: value as PurlinsGirtsPaint })}
                />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center font-medium text-muted-foreground">3</TableCell>
            <TableCell className="font-medium">FOUNDATION BOLT</TableCell>
            <TableCell>
              <PaintSelect
                ariaLabel="Foundation bolt finish"
                value={accessories.foundationBoltFinish}
                options={FOUNDATION_BOLT_FINISH_OPTIONS}
                onChange={(value) => setAccessories({ foundationBoltFinish: value as FoundationBoltFinish })}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </SectionCard>
  )
}

function PaintSelect({
  ariaLabel,
  value,
  options,
  onChange,
}: {
  ariaLabel: string
  value: string | undefined
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <Select value={value ?? ''} onValueChange={onChange}>
      <SelectTrigger className="w-full" aria-label={ariaLabel}>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}
