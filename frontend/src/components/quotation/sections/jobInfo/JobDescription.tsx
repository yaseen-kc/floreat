import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Field, ErrMsg } from '@/components/quotation/shared/FormField'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isRequired, getFieldErrors } from '@/schemas/job.schema'

export function JobDescription() {
  const { projectInfo, setProjectInfo, showValidation } = useQuotationStore(
    useShallow((s) => ({
      projectInfo: s.projectInfo,
      setProjectInfo: s.setProjectInfo,
      showValidation: s.showValidation,
    })),
  )
  // Errors and required markers come from the schema (SSOT), matching JobInformations.
  const errors = showValidation ? getFieldErrors(projectInfo) : {}

  return (
    <SectionCard icon={<Building2 className="w-3.5 h-3.5" />} title="Building Description">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] desktop:gap-6">
        <Field
          label="Building Usage"
          required={isRequired('buildingUsage')}
          value={projectInfo.buildingUsage}
          error={Boolean(errors.buildingUsage)}
          onChange={(v) => setProjectInfo({ buildingUsage: v })}
        />
        <div>
          <Label className="desktop:mb-2">Number of Buildings {isRequired('numberOfBuilding') && <span className="text-destructive">*</span>}</Label>
          <Input
            type="number"
            min={1}
            value={projectInfo.numberOfBuilding || ''}
            onChange={(e) => setProjectInfo({ numberOfBuilding: parseInt(e.target.value) || 0 })}
            className={cn(errors.numberOfBuilding && 'border-destructive')}
          />
          {errors.numberOfBuilding && <ErrMsg>At least 1 building required</ErrMsg>}
        </div>

        <Field
          label="Frame Type"
          required={isRequired('frameType')}
          value={projectInfo.frameType}
          error={Boolean(errors.frameType)}
          onChange={(v) => setProjectInfo({ frameType: v })}
        />
        <Field
          label="Configuration"
          required={isRequired('configuration')}
          value={projectInfo.configuration}
          error={Boolean(errors.configuration)}
          onChange={(v) => setProjectInfo({ configuration: v })}
        />
      </div>
    </SectionCard>
  )
}
