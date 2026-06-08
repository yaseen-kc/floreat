import { useQuotationStore } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CircleAlert, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export function JobInformations() {
  const { projectInfo, setProjectInfo, showValidation } = useQuotationStore()

  const err = (v: string) => showValidation && !v.trim()

  return (
    <SectionCard icon={<Users className="w-3.5 h-3.5" />} title="Job Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <Field label="Project No" value={projectInfo.projectNo} error={err(projectInfo.projectNo)} onChange={(v) => setProjectInfo({ projectNo: v })} />
        <Field label="Ref No" value={projectInfo.refNo} error={err(projectInfo.refNo)} onChange={(v) => setProjectInfo({ refNo: v })} />

        <div className="md:col-span-2">
          <Field label="Subject" value={projectInfo.subject} error={err(projectInfo.subject)} onChange={(v) => setProjectInfo({ subject: v })} />
        </div>

        <Field label="Client Name" value={projectInfo.clientName} error={err(projectInfo.clientName)} onChange={(v) => setProjectInfo({ clientName: v })} />
        <div>
          <Label>Date <span className="text-destructive">*</span></Label>
          <Input type="date" value={projectInfo.date} onChange={(e) => setProjectInfo({ date: e.target.value })} className={cn(err(projectInfo.date) && 'border-destructive')} />
          {err(projectInfo.date) && <ErrMsg>Date is required</ErrMsg>}
        </div>

        <Field label="Designed By (Name)" value={projectInfo.designedByName} error={err(projectInfo.designedByName)} onChange={(v) => setProjectInfo({ designedByName: v })} />
        <Field label="Designed By (Mobile)" value={projectInfo.designedByMobile} error={err(projectInfo.designedByMobile)} onChange={(v) => setProjectInfo({ designedByMobile: v })} />

        <Field label="Estimation Engineer (Name)" value={projectInfo.estimationEngineerName} error={err(projectInfo.estimationEngineerName)} onChange={(v) => setProjectInfo({ estimationEngineerName: v })} />
        <Field label="Estimation Engineer (Mobile)" value={projectInfo.estimationEngineerMobile} error={err(projectInfo.estimationEngineerMobile)} onChange={(v) => setProjectInfo({ estimationEngineerMobile: v })} />

        <Field label="Head of Sales (Name)" value={projectInfo.headOfSalesName} error={err(projectInfo.headOfSalesName)} onChange={(v) => setProjectInfo({ headOfSalesName: v })} />
        <Field label="Head of Sales (Mobile)" value={projectInfo.headOfSalesMobile} error={err(projectInfo.headOfSalesMobile)} onChange={(v) => setProjectInfo({ headOfSalesMobile: v })} />
      </div>
    </SectionCard>
  )
}

function Field({ label, value, error, onChange }: { label: string; value: string; error: boolean; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label} <span className="text-destructive">*</span></Label>
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
