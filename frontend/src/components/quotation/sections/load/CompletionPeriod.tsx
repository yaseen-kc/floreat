import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField } from '@/components/quotation/shared/SelectField'
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 desktop:gap-6">
        <NumberField
          label="Approval Drawings Time"
          value={load.approvalDrawingsTime}
          unit="qty"
          step={1}
          required={false}
          error={false}
          onChange={(v) => setLoad({ approvalDrawingsTime: v })}
        />
        <SelectField
          label="Approval Drawings Unit"
          value={load.approvalDrawingsUnit}
          options={APPROVAL_DRAWINGS_UNIT_OPTIONS}
          required={false}
          error={false}
          onChange={(v) => setLoad({ approvalDrawingsUnit: v as ApprovalDrawingsTimeUnit })}
        />
        <NumberField
          label="Supply of Materials"
          value={load.supplyOfMaterialsDays}
          unit="days"
          step={1}
          required={false}
          error={false}
          onChange={(v) => setLoad({ supplyOfMaterialsDays: v })}
        />
        <NumberField
          label="Erection of Structure"
          value={load.erectionOfStructureDays}
          unit="days"
          step={1}
          required={false}
          error={false}
          onChange={(v) => setLoad({ erectionOfStructureDays: v })}
        />
      </div>
    </SectionCard>
  )
}
