import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CalendarClock } from 'lucide-react'
import type { ApprovalDrawingsTimeUnit } from '@/api/quotation/load/getLoad'
import { APPROVAL_DRAWINGS_UNIT_OPTIONS } from '@/components/quotation/sections/load/loadOptions'

/** The project completion-period card for Step 7 — approval drawings + supply/erection. */
export function CompletionPeriod() {
  const { load, setLoad } = useQuotationStore(
    useShallow((s) => ({ load: s.load, setLoad: s.setLoad })),
  )

  return (
    <SectionCard icon={<CalendarClock className="w-3.5 h-3.5" />} title="Completion Period">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-12">SL</TableHead>
            <TableHead scope="col">Items</TableHead>
            <TableHead scope="col">Time Period</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell className="font-medium">Approval Drawings</TableCell>
            <TableCell className="min-w-64">
              <div className="flex gap-3">
                <NumberField
                  className="[&>label]:sr-only flex-1"
                  label="Approval Drawings Time"
                  value={load.approvalDrawingsTime}
                  unit="qty"
                  step={1}
                  required={false}
                  error={false}
                  onChange={(value) => setLoad({ approvalDrawingsTime: value })}
                />
                <SelectField
                  className="[&>label]:sr-only flex-1"
                  label="Approval Drawings Unit"
                  value={load.approvalDrawingsUnit}
                  options={APPROVAL_DRAWINGS_UNIT_OPTIONS}
                  required={false}
                  error={false}
                  onChange={(value) => setLoad({ approvalDrawingsUnit: value as ApprovalDrawingsTimeUnit })}
                />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell className="font-medium">Supply of Materials</TableCell>
            <TableCell className="min-w-48">
              <NumberField
                className="[&>label]:sr-only"
                label="Supply of Materials"
                value={load.supplyOfMaterialsDays}
                unit="days"
                step={1}
                required={false}
                error={false}
                onChange={(value) => setLoad({ supplyOfMaterialsDays: value })}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell className="font-medium">Erection of Structure</TableCell>
            <TableCell className="min-w-48">
              <NumberField
                className="[&>label]:sr-only"
                label="Erection of Structure"
                value={load.erectionOfStructureDays}
                unit="days"
                step={1}
                required={false}
                error={false}
                onChange={(value) => setLoad({ erectionOfStructureDays: value })}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </SectionCard>
  )
}
