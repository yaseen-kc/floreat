import { useQuotationStore } from '@/stores/quotation-store'
import { useToast } from '@/components/quotation/shared/Toast'
import { useCreateJob } from '@/api/quotation/jobs/postJobs'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react'

const STEP_NAMES = ['', 'Project Info', 'Structural Inputs', 'Calc Engine', 'Pricing', 'Review']

export function WizardActionBar() {
  const { currentStep, nextStep, prevStep, validateStep, projectInfo } = useQuotationStore()
  const toast = useToast((s) => s.show)
  const navigate = useNavigate()
  const createJob = useCreateJob()
  const isLast = currentStep === 5

  const submitJob = () => {
    createJob.mutate(projectInfo, {
      onSuccess: () => { toast('Job created successfully'); navigate('/') },
      onError: () => toast('Failed to create job'),
    })
  }

  const handleNext = () => {
    const ok = nextStep()
    if (!ok) { toast('Please complete the required fields'); return }
    if (currentStep === 1) { submitJob(); return }
    if (isLast) toast('Quotation finalised & saved')
  }

  const handleSaveDraft = () => {
    if (currentStep === 1) {
      if (!validateStep(1)) { useQuotationStore.setState({ showValidation: true }); toast('Please complete the required fields'); return }
      submitJob()
    } else {
      toast('Draft saved')
    }
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-card/92 backdrop-blur-[10px] border-t border-border px-8 py-3.5 flex items-center gap-3 z-15">
      <Button variant="ghost" onClick={prevStep} className={currentStep === 1 ? 'invisible' : ''}>
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>
      <span className="text-xs text-muted-foreground font-mono">
        Step {currentStep} of 5 · {STEP_NAMES[currentStep]}
      </span>
      <div className="flex-1" />
      <Button variant="secondary" onClick={handleSaveDraft} disabled={createJob.isPending}>
        <Save className="w-4 h-4" /> Save draft
      </Button>
      <Button onClick={handleNext} disabled={createJob.isPending}>
        {isLast ? (<>Finish & save <Check className="w-4 h-4" /></>) : (<>Continue <ArrowRight className="w-4 h-4" /></>)}
      </Button>
    </div>
  )
}
