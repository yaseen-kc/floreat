import { useQuotationStore } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CircleAlert, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isRequired, getFieldErrors, type JobInput, type JobField } from '@/schemas/job.schema'

/** Text fields handled by this section (everything except numberOfBuilding). */
type TextField = Exclude<JobField, 'numberOfBuilding'>

export function JobInformations() {
  const { projectInfo, setProjectInfo, showValidation } = useQuotationStore()
  const errors = showValidation ? getFieldErrors(projectInfo) : {}

  // Required markers and error states are derived from the schema (SSOT) so the
  // form can never disagree with what the backend actually requires.
  const fieldProps = (name: TextField, label: string) => ({
    label,
    required: isRequired(name),
    value: projectInfo[name],
    error: Boolean(errors[name]),
    onChange: (v: string) => setProjectInfo({ [name]: v } as Partial<JobInput>),
  })

  return (
    <SectionCard icon={<Users className="w-3.5 h-3.5" />} title="Job Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <Field {...fieldProps('projectNo', 'Project No')} />
        <Field {...fieldProps('refNo', 'Ref No')} />

        <div className="md:col-span-2">
          <Field {...fieldProps('subject', 'Subject')} />
        </div>

        <Field {...fieldProps('clientName', 'Client Name')} />
        <div>
          <Label>Date {isRequired('date') && <span className="text-destructive">*</span>}</Label>
          <Input type="date" value={projectInfo.date} onChange={(e) => setProjectInfo({ date: e.target.value })} className={cn(errors.date && 'border-destructive')} />
          {errors.date && <ErrMsg>Date is required</ErrMsg>}
        </div>

        <Field {...fieldProps('designedByName', 'Designed By (Name)')} />
        <Field {...fieldProps('designedByMobile', 'Designed By (Mobile)')} />

        <Field {...fieldProps('estimationEngineerName', 'Estimation Engineer (Name)')} />
        <Field {...fieldProps('estimationEngineerMobile', 'Estimation Engineer (Mobile)')} />

        <Field {...fieldProps('headOfSalesName', 'Head of Sales (Name)')} />
        <Field {...fieldProps('headOfSalesMobile', 'Head of Sales (Mobile)')} />

        <Field {...fieldProps('firmName', 'Firm Name')} />
      </div>
    </SectionCard>
  )
}

function Field({ label, value, error, required, onChange }: { label: string; value: string; error: boolean; required: boolean; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className={cn(error && 'border-destructive')} />
      {error && <ErrMsg>{label} is required</ErrMsg>}
    </div>
  )
}

function ErrMsg({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1 text-xs text-destructive mt-1">
      <CircleAlert className="w-3 h-3" /> {children}
    </span>
  )
}
