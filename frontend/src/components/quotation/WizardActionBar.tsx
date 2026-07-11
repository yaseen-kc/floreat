import { useQuotationStore, buildRoofPayload, buildMezzaninePayload, buildStairPayload, buildCanopyPayload, buildLoadPayload, buildAccessoriesPayload } from '@/stores/quotation-store'
import { useSaveStatusStore } from '@/stores/save-status-store'
import { useShallow } from 'zustand/react/shallow'
import { toast } from 'sonner'
import { useCreateJob } from '@/api/quotation/jobs/postJobs'
import { useUpdateJob } from '@/api/quotation/jobs/putJobs'
import { useUpsertRoof } from '@/api/quotation/roof/postRoof'
import { useUpsertMezzanine } from '@/api/quotation/mezz/postMezz'
import { useDeleteMezzanine } from '@/api/quotation/mezz/deleteMezz'
import { useUpsertStair } from '@/api/quotation/stair/postStairs'
import { useDeleteStair } from '@/api/quotation/stair/deleteStairs'
import { useUpsertCanopy } from '@/api/quotation/canopy/postCanopy'
import { useDeleteCanopy } from '@/api/quotation/canopy/deleteCanopy'
import { useUpsertLoad } from '@/api/quotation/load/postLoad'
import { useUpsertAccessories } from '@/api/quotation/accessories/postAccessories'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react'
import { STEPS, STEP_COUNT } from '@/components/quotation/steps'

export function WizardActionBar() {
  const { currentStep, nextStep, prevStep, validateStep, goStep, projectInfo, roof, jobId, setJobId, resetQuotation, mezzanine, hasMezzanine, stair, hasStair, canopy, hasCanopy, load, accessories } =
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
        canopy: s.canopy,
        hasCanopy: s.hasCanopy,
        load: s.load,
        accessories: s.accessories,
      })),
    )
  const navigate = useNavigate()
  const setSaving = useSaveStatusStore((s) => s.saving)
  const setSaved = useSaveStatusStore((s) => s.saved)
  const resetSaveStatus = useSaveStatusStore((s) => s.reset)
  const createJob = useCreateJob()
  const updateJob = useUpdateJob()
  const upsertRoof = useUpsertRoof()
  const upsertMezzanine = useUpsertMezzanine()
  const deleteMezzanine = useDeleteMezzanine()
  const upsertStair = useUpsertStair()
  const deleteStair = useDeleteStair()
  const upsertCanopy = useUpsertCanopy()
  const deleteCanopy = useDeleteCanopy()
  const upsertLoad = useUpsertLoad()
  const upsertAccessories = useUpsertAccessories()
  const isLast = currentStep === STEP_COUNT
  const isSubmitting =
    createJob.isPending ||
    updateJob.isPending ||
    upsertRoof.isPending ||
    upsertMezzanine.isPending ||
    deleteMezzanine.isPending ||
    upsertStair.isPending ||
    deleteStair.isPending ||
    upsertCanopy.isPending ||
    deleteCanopy.isPending ||
    upsertLoad.isPending ||
    upsertAccessories.isPending

  /**
   * Persists Step 1 data. Creates the job once (POST) and stores its id;
   * on subsequent calls the existing job is updated (PUT) to avoid duplicates.
   * Resolves on success and rejects on failure so callers can gate navigation.
   */
  const submitJob = async () => {
    setSaving()
    try {
      if (jobId) {
        await updateJob.mutateAsync({ id: jobId, ...projectInfo })
        toast.success('Job updated successfully')
      } else {
        const job = await createJob.mutateAsync(projectInfo)
        setJobId(job.id)
        toast.success('Job created successfully')
      }
      setSaved()
    } catch (err) {
      resetSaveStatus()
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
      setSaving()
      await upsertRoof.mutateAsync({ jobId, payload: buildRoofPayload(roof) })
      setSaved()
      toast.success('Roof saved successfully')
    } catch (err) {
      resetSaveStatus()
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
      setSaving()
      if (hasMezzanine) {
        await upsertMezzanine.mutateAsync({ jobId, payload: buildMezzaninePayload(mezzanine) })
      } else {
        await deleteMezzanine.mutateAsync(jobId)
      }
      setSaved()
      toast.success('Mezzanine saved successfully')
    } catch (err) {
      resetSaveStatus()
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
      setSaving()
      if (hasStair) {
        await upsertStair.mutateAsync({ jobId, payload: buildStairPayload(stair) })
      } else {
        await deleteStair.mutateAsync(jobId)
      }
      setSaved()
      toast.success('Stair saved successfully')
    } catch (err) {
      resetSaveStatus()
      toast.error('Failed to save stair')
      throw err
    }
  }

  /**
   * Persists Step 5 canopy data. Requires the Step 1 `jobId`. Upserts the
   * canopy when the job has one, otherwise deletes any existing record (the
   * toggle is off). Resolves on success and rejects on failure so callers can
   * gate navigation.
   */
  const submitCanopy = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save canopy before the job is created')
    }
    try {
      setSaving()
      if (hasCanopy) {
        await upsertCanopy.mutateAsync({ jobId, payload: buildCanopyPayload(canopy) })
      } else {
        await deleteCanopy.mutateAsync(jobId)
      }
      setSaved()
      toast.success('Canopy saved successfully')
    } catch (err) {
      resetSaveStatus()
      toast.error('Failed to save canopy')
      throw err
    }
  }

  /**
   * Persists Step 6 accessories data via an idempotent upsert. Requires the
   * Step 1 `jobId`. The Accessories form is always-on, so this always upserts
   * the non-blank fields (an entirely blank draft upserts `{}`). Resolves on
   * success and rejects on failure so callers can gate navigation.
   */
  const submitAccessories = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save accessories before the job is created')
    }
    try {
      setSaving()
      await upsertAccessories.mutateAsync({ jobId, payload: buildAccessoriesPayload(accessories) })
      setSaved()
      toast.success('Accessories saved successfully')
    } catch (err) {
      resetSaveStatus()
      toast.error('Failed to save accessories')
      throw err
    }
  }

  /**
   * Persists Step 7 load data via an idempotent upsert. Requires the Step 1
   * `jobId`. The Load form is always-on, so this always upserts the non-blank
   * fields (an entirely blank draft upserts `{}`). Resolves on success and
   * rejects on failure so callers can gate navigation.
   */
  const submitLoad = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save load before the job is created')
    }
    try {
      setSaving()
      await upsertLoad.mutateAsync({ jobId, payload: buildLoadPayload(load) })
      setSaved()
      toast.success('Load saved successfully')
    } catch (err) {
      resetSaveStatus()
      toast.error('Failed to save load')
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

    // Step 5: persist the canopy (upsert or delete), then advance. No validation
    // gate — the canopy is fully optional.
    if (currentStep === 5) {
      try {
        await submitCanopy()
        goStep(6)
      } catch {
        // Error toast already shown; stay on Step 5.
      }
      return
    }

    // Step 6: persist the accessories (always-on upsert), then advance. No
    // validation gate — every accessories field is optional.
    if (currentStep === 6) {
      try {
        await submitAccessories()
        goStep(7)
      } catch {
        // Error toast already shown; stay on Step 6.
      }
      return
    }

    // Final step (Load): persist the load, then finalise and return to the
    // dashboard. Stay on the step if persistence fails.
    if (isLast) {
      try {
        await submitLoad()
        toast.success('Quotation finalised & saved')
        resetQuotation()
        navigate('/')
      } catch {
        // Error toast already shown; stay on the final step.
      }
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
    } else if (currentStep === 5) {
      try { await submitCanopy() } catch { /* error toast already shown */ }
    } else if (currentStep === 6) {
      try { await submitAccessories() } catch { /* error toast already shown */ }
    } else if (currentStep === 7) {
      try { await submitLoad() } catch { /* error toast already shown */ }
    } else {
      toast.success('Draft saved')
    }
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 z-15 flex flex-wrap items-center gap-3 border-t border-border bg-card/92 px-8 py-3.5 backdrop-blur-[10px] max-[640px]:gap-2 max-[640px]:px-4 max-[640px]:py-3">
      <Button
        variant="ghost"
        onClick={prevStep}
        className={cn('max-[640px]:order-2 max-[640px]:flex-1', currentStep === 1 && 'invisible max-[640px]:hidden')}
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      {/* Full step label on desktop; a compact "Step N of 7" line on top on
          mobile (the step label already shows in the compact stepper). */}
      <span className="font-mono text-xs text-muted-foreground max-[640px]:order-1 max-[640px]:w-full">
        Step {currentStep} of {STEP_COUNT}
        <span className="max-[640px]:hidden"> · {STEPS[currentStep - 1]?.label}</span>
      </span>

      <div className="flex-1 max-[640px]:hidden" />

      <Button
        variant="secondary"
        onClick={handleSaveDraft}
        disabled={isSubmitting}
        aria-label="Save draft"
        className="max-[640px]:order-4"
      >
        {isSubmitting ? <Spinner /> : <Save className="w-4 h-4" />}
        <span className="max-[640px]:hidden">Save draft</span>
      </Button>

      <Button onClick={handleNext} disabled={isSubmitting} className="max-[640px]:order-3 max-[640px]:flex-1">
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
