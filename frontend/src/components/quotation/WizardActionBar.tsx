import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { toast } from 'sonner'
import { useCreateJob } from '@/api/quotation/jobs/postJobs'
import { useUpdateJob } from '@/api/quotation/jobs/putJobs'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react'
import { STEPS, STEP_COUNT } from '@/components/quotation/steps'

export function WizardActionBar() {
  const { currentStep, nextStep, prevStep, validateStep, goStep, projectInfo, jobId, setJobId, resetQuotation } =
    useQuotationStore(
      useShallow((s) => ({
        currentStep: s.currentStep,
        nextStep: s.nextStep,
        prevStep: s.prevStep,
        validateStep: s.validateStep,
        goStep: s.goStep,
        projectInfo: s.projectInfo,
        jobId: s.jobId,
        setJobId: s.setJobId,
        resetQuotation: s.resetQuotation,
      })),
    )
  const navigate = useNavigate()
  const createJob = useCreateJob()
  const updateJob = useUpdateJob()
  const isLast = currentStep === STEP_COUNT
  const isSubmitting = createJob.isPending || updateJob.isPending

  /**
   * Persists Step 1 data. Creates the job once (POST) and stores its id;
   * on subsequent calls the existing job is updated (PUT) to avoid duplicates.
   * Resolves on success and rejects on failure so callers can gate navigation.
   */
  const submitJob = async () => {
    try {
      if (jobId) {
        await updateJob.mutateAsync({ id: jobId, ...projectInfo })
        toast.success('Job updated successfully')
      } else {
        const job = await createJob.mutateAsync(projectInfo)
        setJobId(job.id)
        toast.success('Job created successfully')
      }
    } catch (err) {
      toast.error(jobId ? 'Failed to update job' : 'Failed to create job')
      throw err
    }
  }

  /** Validates Step 1; flags the form and toasts when incomplete. */
  const ensureStep1Valid = () => {
    if (validateStep(1)) return true
    useQuotationStore.setState({ showValidation: true })
    toast.error('Please complete the required fields')
    return false
  }

  const handleNext = async () => {
    if (isSubmitting) return

    // Step 1: validate, persist, then advance only if persistence succeeds.
    if (currentStep === 1) {
      if (!ensureStep1Valid()) return
      try {
        await submitJob()
        goStep(2)
      } catch {
        // Error toast already shown; stay on Step 1.
      }
      return
    }

    // Final step: finalise and return to the dashboard.
    if (isLast) {
      if (!validateStep(currentStep)) { toast.error('Please complete the required fields'); return }
      toast.success('Quotation finalised & saved')
      resetQuotation()
      navigate('/')
      return
    }

    // Intermediate steps: validation-driven advance (persistence is future work).
    if (!nextStep()) toast.error('Please complete the required fields')
  }

  const handleSaveDraft = async () => {
    if (isSubmitting) return
    if (currentStep === 1) {
      if (!ensureStep1Valid()) return
      try { await submitJob() } catch { /* error toast already shown */ }
    } else {
      toast.success('Draft saved')
    }
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-card/92 backdrop-blur-[10px] border-t border-border px-8 py-3.5 flex items-center gap-3 z-15">
      <Button variant="ghost" onClick={prevStep} className={currentStep === 1 ? 'invisible' : ''}>
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>
      <span className="text-xs text-muted-foreground font-mono">
        Step {currentStep} of {STEP_COUNT} · {STEPS[currentStep - 1]?.label}
      </span>
      <div className="flex-1" />
      <Button variant="secondary" onClick={handleSaveDraft} disabled={isSubmitting}>
        {isSubmitting ? <Spinner /> : <Save className="w-4 h-4" />} Save draft
      </Button>
      <Button onClick={handleNext} disabled={isSubmitting}>
        {isSubmitting ? (
          <>Saving <Spinner /></>
        ) : isLast ? (
          <>Finish & save <Check className="w-4 h-4" /></>
        ) : (
          <>Continue <ArrowRight className="w-4 h-4" /></>
        )}
      </Button>
    </div>
  )
}
