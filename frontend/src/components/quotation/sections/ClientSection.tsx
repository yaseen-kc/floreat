import { useQuotationStore } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CircleAlert, HelpCircle, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const RECENT_CLIENTS = ['Meridian Logistics', 'Sundaram Motors', 'Kestrel Cold Chain', 'Anand Agritech']
const PROJECT_TYPES = ['Pre-engineered building (PEB)', 'Conventional steel structure', 'Mezzanine / platform', 'Canopy / shed']
const REVISIONS = ['R0 — Initial', 'R1', 'R2', 'R3']
const VALIDITY_OPTIONS = ['15 days', '30 days', '45 days', '60 days']

export function ClientSection() {
  const { projectInfo, setProjectInfo, showValidation } = useQuotationStore()

  const clientErr = showValidation && !projectInfo.client.trim()
  const projectErr = showValidation && !projectInfo.project.trim()

  return (
    <SectionCard icon={<Users className="w-3.5 h-3.5" />} title="Client & project">
      {/* Recent chips */}
      <div className="mb-4">
        <Label className="mb-2 block text-xs">Recently used</Label>
        <div className="flex gap-2 flex-wrap">
          {RECENT_CLIENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setProjectInfo({ client: c })}
              className="px-[11px] py-[5px] border border-border rounded-full text-xs text-foreground/70 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Form grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        {/* Client name */}
        <div>
          <Label>Client name <span className="text-destructive">*</span></Label>
          <Input
            value={projectInfo.client}
            onChange={(e) => setProjectInfo({ client: e.target.value })}
            placeholder="Start typing…"
            list="client-list"
            className={cn(clientErr && 'border-destructive')}
          />
          <datalist id="client-list">
            {[...RECENT_CLIENTS, 'Greenfield Foods'].map((c) => <option key={c} value={c} />)}
          </datalist>
          {clientErr && <ErrMsg>Client name is required</ErrMsg>}
        </div>

        {/* Project name */}
        <div>
          <Label>Project name <span className="text-destructive">*</span></Label>
          <Input
            value={projectInfo.project}
            onChange={(e) => setProjectInfo({ project: e.target.value })}
            placeholder="e.g. Bhiwandi Distribution Hub"
            className={cn(projectErr && 'border-destructive')}
          />
          {projectErr && <ErrMsg>Project name is required</ErrMsg>}
        </div>

        {/* Site */}
        <div>
          <Label>Site location</Label>
          <Input value={projectInfo.site} onChange={(e) => setProjectInfo({ site: e.target.value })} placeholder="City / state" />
        </div>

        {/* Project type */}
        <div>
          <Label>Project type</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" value={projectInfo.type} onChange={(e) => setProjectInfo({ type: e.target.value })}>
            {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Consultant */}
        <div>
          <Label className="inline-flex items-center gap-1">
            Consultant
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild><HelpCircle className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                <TooltipContent>Structural consultant of record for this project.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input value={projectInfo.consultant} onChange={(e) => setProjectInfo({ consultant: e.target.value })} placeholder="Firm or engineer" />
        </div>

        {/* Revision */}
        <div>
          <Label>Revision</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" value={projectInfo.revision} onChange={(e) => setProjectInfo({ revision: e.target.value })}>
            {REVISIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Date */}
        <div>
          <Label>Quotation date</Label>
          <Input type="date" value={projectInfo.date} onChange={(e) => setProjectInfo({ date: e.target.value })} />
        </div>

        {/* Validity */}
        <div>
          <Label>Validity</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" value={projectInfo.validity} onChange={(e) => setProjectInfo({ validity: e.target.value })}>
            {VALIDITY_OPTIONS.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <Label>Notes</Label>
          <textarea
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-y"
            value={projectInfo.notes}
            onChange={(e) => setProjectInfo({ notes: e.target.value })}
            placeholder="Internal notes, special requirements, access constraints…"
          />
        </div>
      </div>
    </SectionCard>
  )
}

function ErrMsg({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1 text-xs text-destructive mt-1">
      <CircleAlert className="w-3 h-3" /> {children}
    </span>
  )
}
