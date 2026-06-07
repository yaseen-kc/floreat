import { useQuotationStore } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CircleAlert, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export function JobDescription() {
  const { projectInfo, setProjectInfo, showValidation } = useQuotationStore()

  const err = (v: string) => showValidation && !v.trim()
  const numErr = showValidation && projectInfo.numberOfBuilding < 1

  return (
    <SectionCard icon={<Users className="w-3.5 h-3.5" />} title="Job Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <Field label="Building Usage" value={projectInfo.buildingUsage} error={err(projectInfo.buildingUsage)} onChange={(v) => setProjectInfo({ buildingUsage: v })} />
        <div>
          <Label>Number of Buildings <span className="text-destructive">*</span></Label>
          <Input type="number" min={1} value={projectInfo.numberOfBuilding || ''} onChange={(e) => setProjectInfo({ numberOfBuilding: parseInt(e.target.value) || 0 })} className={cn(numErr && 'border-destructive')} />
          {numErr && <ErrMsg>At least 1 building required</ErrMsg>}
        </div>

        <Field label="Frame Type" value={projectInfo.frameType} error={err(projectInfo.frameType)} onChange={(v) => setProjectInfo({ frameType: v })} />
        <Field label="Configuration" value={projectInfo.configuration} error={err(projectInfo.configuration)} onChange={(v) => setProjectInfo({ configuration: v })} />
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
