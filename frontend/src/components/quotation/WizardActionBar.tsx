import { useQuotationStore, buildRoofPayload, buildMezzaninePayload, buildStairPayload } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { toast } from 'sonner'
import { useCreateJob } from '@/api/quotation/jobs/postJobs'
import { useUpdateJob } from '@/api/quotation/jobs/putJobs'
import { useUpsertRoof } from '@/api/quotation/roof/postRoof'
import { useUpsertMezzanine } from '@/api/quotation/mezz/postMezz'
import { useDeleteMezzanine } from '@/api/quotation/mezz/deleteMezz'
import { useUpsertStair } from '@/api/quotation/stair/postStairs'
import { useDeleteStair } from '@/api/quotation/stair/deleteStairs'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react'
import { STEPS, STEP_COUNT } from '@/components/quotation/steps'

export function WizardActionBar() {
  const { currentStep, nextStep, prevStep, validateStep, goStep, projectInfo, roof, jobId, setJobId, resetQuotation, mezzanine, hasMezzanine, stair, hasStair } =
    useQuotationStore(
      useShallow((s) => ({
        currentStep: s.currentStep,
        nextStep: s.nextStep,
        prevStep: s.prevStep,
        validateStep: s.validateStep,
        goStep: s.goStep,
        projectInfo: s.projectInfo,
        roof: s.roof,
        jobId: s.jobId,
        setJobId: s.setJobId,
        resetQuotation: s.resetQuotation,
        mezzanine: s.mezzanine,
        hasMezzanine: s.hasMezzanine,
        stair: s.stair,
        hasStair: s.hasStair,
      })),
    )
  const navigate = useNavigate()
  const createJob = useCreateJob()
  const updateJob = useUpdateJob()
  const upsertRoof = useUpsertRoof()
  const upsertMezzanine = useUpsertMezzanine()
  const deleteMezzanine = useDeleteMezzanine()
  const upsertStair = useUpsertStair()
  const deleteStair = useDeleteStair()
  const isLast = currentStep === STEP_COUNT
  const isSubmitting =
    createJob.isPending ||
    updateJob.isPending ||
    upsertRoof.isPending ||
    upsertMezzanine.isPending ||
    deleteMezzanine.isPending ||
    upsertStair.isPending ||
    deleteStair.isPending

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

  /** Validates Step 2; flags the form and toasts when incomplete. */
  const ensureStep2Valid = () => {
    if (validateStep(2)) return true
    useQuotationStore.setState({ showValidation: true })
    toast.error('Please complete the required fields')
    return false
  }

  /**
   * Persists Step 2 roof data via an idempotent upsert (POST). Requires the
   * Step 1 `jobId`. Resolves on success and rejects on failure so callers can
   * gate navigation.
   */
  const submitRoof = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save roof before the job is created')
    }
    try {
      await upsertRoof.mutateAsync({ jobId, payload: buildRoofPayload(roof) })
      toast.success('Roof saved successfully')
    } catch (err) {
      toast.error('Failed to save roof')
      throw err
    }
  }

  /**
   * Persists Step 3 mezzanine data. Requires the Step 1 `jobId`. Upserts the
   * mezzanine when the job has one, otherwise deletes any existing record (the
   * toggle is off). Resolves on success and rejects on failure so callers can
   * gate navigation.
   */
  const submitMezzanine = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save mezzanine before the job is created')
    }
    try {
      if (hasMezzanine) {
        await upsertMezzanine.mutateAsync({ jobId, payload: buildMezzaninePayload(mezzanine) })
      } else {
        await deleteMezzanine.mutateAsync(jobId)
      }
      toast.success('Mezzanine saved successfully')
    } catch (err) {
      toast.error('Failed to save mezzanine')
      throw err
    }
  }

  /**
   * Persists Step 4 stair data. Requires the Step 1 `jobId`. Upserts the stair
   * when the job has one, otherwise deletes any existing record (the toggle is
   * off). Resolves on success and rejects on failure so callers can gate
   * navigation.
   */
  const submitStair = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save stair before the job is created')
    }
    try {
      if (hasStair) {
        await upsertStair.mutateAsync({ jobId, payload: buildStairPayload(stair) })
      } else {
        await deleteStair.mutateAsync(jobId)
      }
      toast.success('Stair saved successfully')
    } catch (err) {
      toast.error('Failed to save stair')
      throw err
    }
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

    // Step 2: validate, persist the roof, then advance only on success.
    if (currentStep === 2) {
      if (!ensureStep2Valid()) return
      try {
        await submitRoof()
        goStep(3)
      } catch {
        // Error toast already shown; stay on Step 2.
      }
      return
    }

    // Step 3: persist the mezzanine (upsert or delete), then advance. No
    // validation gate — the mezzanine is fully optional.
    if (currentStep === 3) {
      try {
        await submitMezzanine()
        goStep(4)
      } catch {
        // Error toast already shown; stay on Step 3.
      }
      return
    }

    // Step 4: persist the stair (upsert or delete), then advance. No validation
    // gate — the stair is fully optional.
    if (currentStep === 4) {
      try {
        await submitStair()
        goStep(5)
      } catch {
        // Error toast already shown; stay on Step 4.
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
    } else if (currentStep === 2) {
      if (!ensureStep2Valid()) return
      try { await submitRoof() } catch { /* error toast already shown */ }
    } else if (currentStep === 3) {
      try { await submitMezzanine() } catch { /* error toast already shown */ }
    } else if (currentStep === 4) {
      try { await submitStair() } catch { /* error toast already shown */ }
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
