import { useQuotationStore, buildRoofPayload, buildMezzaninePayload, buildStairPayload, buildCanopyPayload, buildLoadPayload, buildAccessoriesPayload, buildJointPayload, buildSpecPayload } from '@/stores/quotation-store'
import { useSaveStatusStore } from '@/stores/save-status-store'
import { useShallow } from 'zustand/react/shallow'
import { toast } from 'sonner'
import { useCreateJob } from '@/api/quotation/jobs/postJobs'
import { useUpdateJob } from '@/api/quotation/jobs/putJobs'
import { useUpsertRoof } from '@/api/quotation/roof/postRoof'
import { useUpsertMezzanine } from '@/api/quotation/mezz/postMezz'
import { useUpsertStair } from '@/api/quotation/stair/postStairs'
import { useUpsertCanopy } from '@/api/quotation/canopy/postCanopy'
import { useUpsertLoad } from '@/api/quotation/load/postLoad'
import { useUpsertAccessories } from '@/api/quotation/accessories/postAccessories'
import { useUpsertJoint } from '@/api/quotation/joint/postJoint'
import { useUpsertSpec } from '@/api/quotation/spec/postSpec'
import { useUpsertAmount } from '@/api/quotation/amount/postAmount'
import { useUpsertQuantity } from '@/api/quotation/quantity/postQuantity'
import {
  calculatePebQuantities,
  calculateCladdingQuantities,
  calculateCanopyQuantities,
  calculateAccessoriesQuantities,
  calculateMezzanineQuantities,
  calculateStairQuantities,
  calculateAdditionalBoltsQuantities,
  calculateAmountQuantities,
} from '@floreat/shared/calc'
import { buildFullQuantityPayload } from '@/lib/quantity-payload'
import { buildAmountPayload } from '@/lib/amount-payload'
import { useNavigate } from 'react-router-dom'
import { useRates } from '@/api/quotation/rate/getRate'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react'
import { STEPS, STEP_COUNT } from '@/components/quotation/steps'
/** Fires a success toast, but stays silent on small (≤640px) devices, where the
 *  sticky action bar already surfaces state via the save-status pill and spinner. */
export const successToast = (message: string) => {
  if (window.matchMedia('(max-width: 640px)').matches) return // ponytail: viewport read at call time
  toast.success(message)
}

export function WizardActionBar() {
  const { currentStep, nextStep, prevStep, validateStep, goStep, projectInfo, roof, jobId, setJobId, resetQuotation, mezzanine, stair, canopy, load, accessories, joint, spec } =
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
        stair: s.stair,
        canopy: s.canopy,
        load: s.load,
        accessories: s.accessories,
        joint: s.joint,
        spec: s.spec,
      })),
    )
  const navigate = useNavigate()
  const setSaving = useSaveStatusStore((s) => s.saving)
  const setSaved = useSaveStatusStore((s) => s.saved)
  const resetSaveStatus = useSaveStatusStore((s) => s.reset)
  
  const { data: ratesPage } = useRates(1, 100)

  const createJob = useCreateJob()
  const updateJob = useUpdateJob()
  const upsertRoof = useUpsertRoof()
  const upsertMezzanine = useUpsertMezzanine()
  const upsertStair = useUpsertStair()
  const upsertCanopy = useUpsertCanopy()
  const upsertLoad = useUpsertLoad()
  const upsertAccessories = useUpsertAccessories()
  const upsertJoint = useUpsertJoint()
  const upsertSpec = useUpsertSpec()
  const upsertAmount = useUpsertAmount()
  const upsertQuantity = useUpsertQuantity()
  const isLast = currentStep === STEP_COUNT
  const isSubmitting =
    createJob.isPending ||
    updateJob.isPending ||
    upsertRoof.isPending ||
    upsertMezzanine.isPending ||
    upsertStair.isPending ||
    upsertCanopy.isPending ||
    upsertLoad.isPending ||
    upsertAccessories.isPending ||
    upsertJoint.isPending ||
    upsertSpec.isPending ||
    upsertAmount.isPending ||
    upsertQuantity.isPending

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
        successToast('Job updated successfully')
      } else {
        const job = await createJob.mutateAsync(projectInfo)
        setJobId(job.id)
        successToast('Job created successfully')
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
      successToast('Roof saved successfully')
    } catch (err) {
      resetSaveStatus()
      toast.error('Failed to save roof')
      throw err
    }
  }

  /**
   * Persists Step 3 mezzanine data via an idempotent upsert. Requires the
   * Step 1 `jobId`. Mezzanine is always-on: an empty draft upserts `{}` and
   * the backend creates/updates the record. Resolves on success and rejects on
   * failure so callers can gate navigation.
   */
  const submitMezzanine = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save mezzanine before the job is created')
    }
    try {
      setSaving()
      await upsertMezzanine.mutateAsync({ jobId, payload: buildMezzaninePayload(mezzanine) })
      setSaved()
      successToast('Mezzanine saved successfully')
    } catch (err) {
      resetSaveStatus()
      toast.error('Failed to save mezzanine')
      throw err
    }
  }

  /**
   * Persists Step 4 stair data via an idempotent upsert. Requires the Step 1
   * `jobId`. Stair is always-on: an empty draft upserts `{}` and the backend
   * creates/updates the record. Resolves on success and rejects on failure so
   * callers can gate navigation.
   */
  const submitStair = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save stair before the job is created')
    }
    try {
      setSaving()
      await upsertStair.mutateAsync({ jobId, payload: buildStairPayload(stair) })
      setSaved()
      successToast('Stair saved successfully')
    } catch (err) {
      resetSaveStatus()
      toast.error('Failed to save stair')
      throw err
    }
  }

  /**
   * Persists Step 5 canopy data via an idempotent upsert. Requires the Step 1
   * `jobId`. Canopy is always-on: an empty draft upserts `{}` and the backend
   * creates/updates the record. Resolves on success and rejects on failure so
   * callers can gate navigation.
   */
  const submitCanopy = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save canopy before the job is created')
    }
    try {
      setSaving()
      await upsertCanopy.mutateAsync({ jobId, payload: buildCanopyPayload(canopy) })
      setSaved()
      successToast('Canopy saved successfully')
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
      successToast('Accessories saved successfully')
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
      successToast('Load saved successfully')
    } catch (err) {
      resetSaveStatus()
      toast.error('Failed to save load')
      throw err
    }
  }

  /**
   * Persists Step 8 joint data via an idempotent upsert. Requires the Step 1
   * `jobId`. The Joint form is always-on, so this always upserts the non-blank
   * fields (an entirely blank draft upserts `{}`). Resolves on success and
   * rejects on failure so callers can gate navigation.
   */
  const submitJoint = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save joint before the job is created')
    }
    try {
      setSaving()
      await upsertJoint.mutateAsync({ jobId, payload: buildJointPayload(joint) })
      setSaved()
      successToast('Joint saved successfully')
    } catch (err) {
      resetSaveStatus()
      toast.error('Failed to save joint')
      throw err
    }
  }

  /**
   * Persists Step 9 spec data via an idempotent upsert. Requires the Step 1
   * `jobId`. The Spec form is always-on, so this always upserts the non-blank
   * fields (an entirely blank draft upserts `{}`). Resolves on success and
   * rejects on failure so callers can gate navigation.
   */
  const submitSpec = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save spec before the job is created')
    }
    try {
      setSaving()
      await upsertSpec.mutateAsync({ jobId, payload: buildSpecPayload(spec) })
      setSaved()
      successToast('Spec saved successfully')
    } catch (err) {
      resetSaveStatus()
      toast.error('Failed to save spec')
      throw err
    }
  }

  /**
   * Persists Step 11 amount data by upserting the canonical flat amount fields for
   * the job. Calculated quantities and rate master values are derived client-side.
   * Requires the Step 1 `jobId`.
   */
  const submitAmount = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save amount before the job is created')
    }
    try {
      setSaving()
      const storeState = useQuotationStore.getState()
      const calculatedQuantities = calculateAmountQuantities({
        buildingOverallLength: storeState.roof.buildingOverallLength,
        buildingOverallWidth: storeState.roof.buildingOverallWidth,
        roofSlope: storeState.roof.roofSlope,
        materialConsumptionExcludingPurlin: storeState.roof.materialConsumptionExcludingPurlin,
        mainRoofFrames: storeState.roof.mainRoofFrames,
        endRoofFrames: storeState.roof.endRoofFrames,
        roofWindBracingSegmentsInOneHalf: storeState.roof.roofWindBracingSegmentsInOneHalf,
        roofWindBracingProvidedBays: storeState.roof.roofWindBracingProvidedBays,
        windBracingUnitWeight: storeState.roof.windBracingUnitWeight,
        columnWindBracingSegments: storeState.roof.columnWindBracingSegments,
        columnWindBracingProvidedBays: storeState.roof.columnWindBracingProvidedBays,
        windBracingColumnHeight: storeState.roof.windBracingColumnHeight,
        roofPurlinSpacing: storeState.roof.roofPurlinSpacing,
        roofExtensionWidthHeight: storeState.roof.roofExtensionWidthHeight,
        roofExtensionEndFrameCount: storeState.roof.roofExtensionEndFrameCount,
        roofExtensionMidFrameCount: storeState.roof.roofExtensionMidFrameCount,
        diaOfRoofSagRod: storeState.roof.diaOfRoofSagRod,
        eaveHeight: storeState.roof.eaveHeight,
        claddingExtensionWidthHeight: storeState.roof.claddingExtensionWidthHeight,
        frontCladdingOpeningArea: storeState.roof.frontCladdingOpeningArea,
        backCladdingOpeningArea: storeState.roof.backCladdingOpeningArea,
        rightCladdingOpeningArea: storeState.roof.rightCladdingOpeningArea,
        leftCladdingOpeningArea: storeState.roof.leftCladdingOpeningArea,
        fasciaBoardArea: storeState.roof.fasciaBoardArea,
        claddingPurlins: storeState.roof.claddingPurlins,
        internalColumnsForEndRoofFrames: storeState.roof.internalColumnsForEndRoofFrames,
        diaOfCladdingSagRod: storeState.roof.diaOfCladdingSagRod,
        roofFlangeBraceAverageLength: storeState.roof.roofFlangeBraceAverageLength,
        endFrameFlangeBraceAverageLength: storeState.roof.endFrameFlangeBraceAverageLength,
        claddingFlangeBraceAverageLength: storeState.roof.claddingFlangeBraceAverageLength,
        roofPurlinUnitWeight: storeState.roof.roofPurlinUnitWeight,
        claddingPurlinUnitWeight: storeState.roof.claddingPurlinUnitWeight,
        roofAreaDeduction: storeState.roof.roofAreaDeduction,
        polycarbonateRoofLength: storeState.roof.polycarbonateRoofLength,
        polycarbonateRoofWidth: storeState.roof.polycarbonateRoofWidth,
        polycarbonateRoofCount: storeState.roof.polycarbonateRoofCount,
        raftersInOneHalfOfMainFrame: storeState.roof.raftersInOneHalfOfMainFrame,
        raftersInOneHalfOfEndFrame: storeState.roof.raftersInOneHalfOfEndFrame,
        fasciaMaterialWeightPerSqft: storeState.roof.fasciaMaterialWeightPerSqft,

        // Sidewalls
        sidewallFrontHeight: storeState.roof.sidewalls?.find((s) => s.side === 'FRONT')?.height,
        sidewallBackHeight: storeState.roof.sidewalls?.find((s) => s.side === 'BACK')?.height,
        sidewallLeftHeight: storeState.roof.sidewalls?.find((s) => s.side === 'LEFT')?.height,
        sidewallRightHeight: storeState.roof.sidewalls?.find((s) => s.side === 'RIGHT')?.height,

        // QuantityPebRoof fields
        pebLengthOfBuildingQuantity: storeState.quantity?.pebRoof?.lengthOfBuildingQuantity ? Number(storeState.quantity.pebRoof.lengthOfBuildingQuantity) : undefined,
        pebLengthOfSinlgeWindBracingAdditional: storeState.quantity?.pebRoof?.lengthOfSinlgeWindBracingAdditional ? Number(storeState.quantity.pebRoof.lengthOfSinlgeWindBracingAdditional) : undefined,
        pebLengthOfSingleSagRoadAdditional: storeState.quantity?.pebRoof?.lengthOfSingleSagRoadAdditional ? Number(storeState.quantity.pebRoof.lengthOfSingleSagRoadAdditional) : undefined,
        pebLengthOfMidFrameFlangeBraceAdditional: storeState.quantity?.pebRoof?.lengthOfMidFrameFlangeBraceAdditional ? Number(storeState.quantity.pebRoof.lengthOfMidFrameFlangeBraceAdditional) : undefined,
        pebLengthOfOnePurlinQuantity: storeState.quantity?.pebRoof?.lengthOfOnePurlinQuantity ? Number(storeState.quantity.pebRoof.lengthOfOnePurlinQuantity) : undefined,
        pebExtendedRoofWidthAdditonal: storeState.quantity?.pebRoof?.extendedRoofWidthAdditonal ? Number(storeState.quantity.pebRoof.extendedRoofWidthAdditonal) : undefined,
        pebLengthOfpolyCarbonateSheetAdditional: storeState.quantity?.pebRoof?.lengthOfpolyCarbonateSheetAdditional ? Number(storeState.quantity.pebRoof.lengthOfpolyCarbonateSheetAdditional) : undefined,

        // QuantityCladding fields
        claddingColumnWindBracingsAdditional: storeState.quantity?.cladding?.columnWindBracingsAdditional ? Number(storeState.quantity.cladding.columnWindBracingsAdditional) : undefined,
        claddingSagRodAdditional: storeState.quantity?.cladding?.claddingSagRodAdditional ? Number(storeState.quantity.cladding.claddingSagRodAdditional) : undefined,
        claddingFlangeBraceAdditional: storeState.quantity?.cladding?.claddingFlangeBraceAdditional ? Number(storeState.quantity.cladding.claddingFlangeBraceAdditional) : undefined,
        claddingEaveHeightFrontAdditional: storeState.quantity?.cladding?.claddingStructureFrontEaveHeight ? Number(storeState.quantity.cladding.claddingStructureFrontEaveHeight) : undefined,
        claddingSheetAdditional: storeState.quantity?.cladding?.claddingSheetAdditional ? Number(storeState.quantity.cladding.claddingSheetAdditional) : undefined,
        claddingNumberOfCladdingPurlinBoltsAdditional: storeState.quantity?.cladding?.numberOfCladdingPurlinBoltsAdditional ? Number(storeState.quantity.cladding.numberOfCladdingPurlinBoltsAdditional) : undefined,

        // QuantityMezzanine fields
        mezzanineTotalMezzanineAreaQuantity: storeState.quantity?.mezzanine?.totalMezzanineAreaQuantity ? Number(storeState.quantity.mezzanine.totalMezzanineAreaQuantity) : undefined,
        mezzanineConcreteFlashingAdditional: storeState.quantity?.mezzanine?.concreteFlashingAdditional ? Number(storeState.quantity.mezzanine.concreteFlashingAdditional) : undefined,
        mezzanineDeckSheetQuantityAdditional: storeState.quantity?.mezzanine?.deckSheetQuantityAdditional ? Number(storeState.quantity.mezzanine.deckSheetQuantityAdditional) : undefined,
        mezzanineShearStudsQuantityAdditional: storeState.quantity?.mezzanine?.shearStudsQuantityAdditional ? Number(storeState.quantity.mezzanine.shearStudsQuantityAdditional) : undefined,

        // QuantityStair fields
        stairTotalWeightofStringerBeamsAdditional: storeState.quantity?.stair?.totalWeightofStringerBeamsAdditional ? Number(storeState.quantity.stair.totalWeightofStringerBeamsAdditional) : undefined,
        stairTotalWeightofStepsAdditional: storeState.quantity?.stair?.totalWeightofStepsAdditional ? Number(storeState.quantity.stair.totalWeightofStepsAdditional) : undefined,

        // QuantityAdditionalBolts fields
        additionalPurlinBoltQuantity: storeState.quantity?.additionalBolts?.purlinBoltQuantity ? Number(storeState.quantity.additionalBolts.purlinBoltQuantity) : undefined,
        additionalJointBolt1Quantity: storeState.quantity?.additionalBolts?.jointBolt1Quantity ? Number(storeState.quantity.additionalBolts.jointBolt1Quantity) : undefined,
        additionalJointBolt2Quantity: storeState.quantity?.additionalBolts?.jointBolt2Quantity ? Number(storeState.quantity.additionalBolts.jointBolt2Quantity) : undefined,
        additionalJointBolt3Quantity: storeState.quantity?.additionalBolts?.jointBolt3Quantity ? Number(storeState.quantity.additionalBolts.jointBolt3Quantity) : undefined,
        additionalFoundationBoltQuantity: storeState.quantity?.additionalBolts?.foundationBoltQuantity ? Number(storeState.quantity.additionalBolts.foundationBoltQuantity) : undefined,
        additionalAnchorBoltQuantity: storeState.quantity?.additionalBolts?.anchorBoltQuantity ? Number(storeState.quantity.additionalBolts.anchorBoltQuantity) : undefined,

        // CanopyItem fields
        canopy0Length: storeState.canopy.canopies[0]?.length,
        canopy0Width: storeState.canopy.canopies[0]?.width,
        canopy0MaterialConsumptionKgPerSqft: storeState.canopy.canopies[0]?.materialConsumptionKgPerSqft,
        canopy0NumberOfPurlins: storeState.canopy.canopies[0]?.numberOfPurlins,
        canopy0NumberOfBeams: storeState.canopy.canopies[0]?.numberOfBeams,
        canopy0Height: storeState.canopy.canopies[0]?.height,
        canopy0CanopySideCoveringHeight: storeState.canopy.canopies[0]?.canopySideCoveringHeight,

        // MezzanineFloor fields (MEZ_1)
        mez0LengthM: storeState.mezzanine.floors[0]?.lengthM,
        mez0WidthM: storeState.mezzanine.floors[0]?.widthM,
        mezzanineMaterialConsumptionKgPerSqft: storeState.mezzanine.floors[0]?.materialConsumptionKgPerSqft,
        mez0BeamsMidPrimary: storeState.mezzanine.floors[0]?.beamsMidPrimary,
        mez0JointsMidPrimary: storeState.mezzanine.floors[0]?.jointsMidPrimary,
        mez0BeamsEndPrimary: storeState.mezzanine.floors[0]?.beamsEndPrimary,
        mez0JointsEndPrimary: storeState.mezzanine.floors[0]?.jointsEndPrimary,
        mez0InternalColumnsMidPrimary: storeState.mezzanine.floors[0]?.internalColumnsMidPrimary,
        mez0InternalColumnsEndPrimary: storeState.mezzanine.floors[0]?.internalColumnsEndPrimary,
        mez0BeamsSecondary: storeState.mezzanine.floors[0]?.beamsSecondary,

        // MezzanineFloorExt fields (EXT_1)
        mezExt0LengthM: storeState.mezzanine.extensions[0]?.lengthM,
        mezExt0WidthM: storeState.mezzanine.extensions[0]?.widthM,
        mezExt0BeamsMidPrimary: storeState.mezzanine.extensions[0]?.beamsMidPrimary,
        mezExt0JointsMidPrimary: storeState.mezzanine.extensions[0]?.jointsMidPrimary,
        mezExt0BeamsEndPrimary: storeState.mezzanine.extensions[0]?.beamsEndPrimary,
        mezExt0JointsEndPrimary: storeState.mezzanine.extensions[0]?.jointsEndPrimary,
        mezExt0ExtendedColumnsMidPrimary: storeState.mezzanine.extensions[0]?.extendedColumnsMidPrimary,
        mezExt0ExtendedColumnsEndPrimary: storeState.mezzanine.extensions[0]?.extendedColumnsEndPrimary,
        mezExt0BeamsSecondary: storeState.mezzanine.extensions[0]?.beamsSecondary,

        // AreaDeduction
        areaDeduction0AreaM2: storeState.stair.areaDeductions[0]?.areaM2,
        areaDeduction0Numbers: storeState.stair.areaDeductions[0]?.numbers,

        // StairItem fields (STAIR_1)
        stair0Length: storeState.stair.stairs[0]?.length,
        stair0Width: storeState.stair.stairs[0]?.width,
        stair0Height: storeState.stair.stairs[0]?.height,
        stair0NumberOfMidLanding: storeState.stair.stairs[0]?.numberOfMidLanding,
        stair0UnitWeightOfStringer: storeState.stair.stairs[0]?.unitWeightOfStringer,

        // BoltType fields
        boltTypePurlinFlangeBraceNumberOfBolts: storeState.joint.purlinFlangeBraceNumberOfBolts,
        boltTypeCladdingPurlinsNumberOfBolts: storeState.joint.claddingPurlinsNumberOfBolts,
        boltTypeCanopyNumberOfBolts: storeState.joint.canopyNumberOfBolts,
        boltTypeSecondaryBeamsNumberOfBolts: storeState.joint.secondaryBeamsNumberOfBolts,

        // Roof Joint Bolts
        jointHNumberOfBolts: storeState.joint.jointBoltRoof?.find((j) => j.roofJointId === 'H')?.numberOfBolts,
        jointLNumberOfBolts: storeState.joint.jointBoltRoof?.find((j) => j.roofJointId === 'L')?.numberOfBolts,
        jointH1NumberOfBolts: storeState.joint.jointBoltRoof?.find((j) => j.roofJointId === 'H_1')?.numberOfBolts,
        jointINumberOfBolts: storeState.joint.jointBoltRoof?.find((j) => j.roofJointId === 'I')?.numberOfBolts,
        jointI1NumberOfBolts: storeState.joint.jointBoltRoof?.find((j) => j.roofJointId === 'I_1')?.numberOfBolts,
        jointBNumberOfBolts: storeState.joint.jointBoltRoof?.find((j) => j.roofJointId === 'B')?.numberOfBolts,
        jointB1NumberOfBolts: storeState.joint.jointBoltRoof?.find((j) => j.roofJointId === 'B_1')?.numberOfBolts,
        jointB2NumberOfBolts: storeState.joint.jointBoltRoof?.find((j) => j.roofJointId === 'B_2')?.numberOfBolts,
        jointANumberOfBolts: storeState.joint.jointBoltRoof?.find((j) => j.roofJointId === 'A')?.numberOfBolts,
        jointA1NumberOfBolts: storeState.joint.jointBoltRoof?.find((j) => j.roofJointId === 'A_1')?.numberOfBolts,
        jointCNumberOfBolts: storeState.joint.jointBoltRoof?.find((j) => j.roofJointId === 'C')?.numberOfBolts,
        jointC1NumberOfBolts: storeState.joint.jointBoltRoof?.find((j) => j.roofJointId === 'C_1')?.numberOfBolts,

        // Mezzanine Joint Bolts
        jointMNumberOfBolts: storeState.joint.jointBoltMezzanine?.find((j) => j.mezzanineJointId === 'M')?.numberOfBolts,
        jointONumberOfBolts: storeState.joint.jointBoltMezzanine?.find((j) => j.mezzanineJointId === 'O')?.numberOfBolts,

        // Foundation Bolts
        foundationFB4NumberOfBolts: storeState.joint.foundationBoltRoof?.find((j) => j.foundationJointId === 'FB4')?.numberOfBolts,
        foundationFB5NumberOfBolts: storeState.joint.foundationBoltRoof?.find((j) => j.foundationJointId === 'FB5')?.numberOfBolts,
        foundationFB6NumberOfBolts: storeState.joint.foundationBoltRoof?.find((j) => j.foundationJointId === 'FB6')?.numberOfBolts,

        // Accessories fields
        ridgeQuantityManual: storeState.accessories.ridgeQuantityManual ? storeState.accessories.ridgeQuantity : undefined,
        gutterQuantityManual: storeState.accessories.gutterQuantityManual ? storeState.accessories.gutterQuantity : undefined,
        downTakeQuantityManual: storeState.accessories.downTakeQuantityManual ? storeState.accessories.downTakeQuantity : undefined,
        dripTrimQuantityManual: storeState.accessories.dripTrimQuantityManual ? storeState.accessories.dripTrimQuantity : undefined,
        gableEndFlashingQuantityManual: storeState.accessories.gableEndFlashingQuantityManual ? storeState.accessories.gableEndFlashingQuantity : undefined,
        cornerFlashQuantityManual: storeState.accessories.cornerFlashQuantityManual ? storeState.accessories.cornerFlashQuantity : undefined,
        rollingShutterLength: storeState.accessories.rollingShutterLength,
        rollingShutterWidth: storeState.accessories.rollingShutterWidth,
        rollingShutterNos: storeState.accessories.rollingShutterNos,
        louverLength: storeState.accessories.louverLength,
        louverWidth: storeState.accessories.louverWidth,
        louverNos: storeState.accessories.louverNos,
        skyLightLength: storeState.accessories.skyLightLength,
        skyLightWidth: storeState.accessories.skyLightWidth,
        skyLightNos: storeState.accessories.skyLightNos,
        wallLightLength: storeState.accessories.wallLightLength,
        wallLightWidth: storeState.accessories.wallLightWidth,
        wallLightNos: storeState.accessories.wallLightNos,
        turboVentilatorNos: storeState.accessories.turboVentilatorNos,
        handrailWeightKg: storeState.accessories.handrailWeightKg,
        doorHeight: storeState.accessories.doorHeight,
        doorWidth: storeState.accessories.doorWidth,
        doorNos: storeState.accessories.doorNos,
        windowHeight: storeState.accessories.windowHeight,
        windowWidth: storeState.accessories.windowWidth,
        windowNos: storeState.accessories.windowNos,
        partitionQuantity: storeState.accessories.partitionQuantity,
      })

      const rateByItem = new Map((ratesPage?.data ?? []).map((r) => [r.item, r]))
      const payload = buildAmountPayload(calculatedQuantities, rateByItem, storeState.amount)
      const updatedAmount = await upsertAmount.mutateAsync({ jobId, payload })
      useQuotationStore.setState({ amount: updatedAmount })
      setSaved()
      successToast('Amount saved successfully')
    } catch (err) {
      resetSaveStatus()
      toast.error('Failed to save amount')
      throw err
    }
  }

  /**
   * Persists Step 12 quantity data via an idempotent upsert.
   * Requires the Step 1 `jobId`.
   */
  const submitQuantity = async () => {
    if (!jobId) {
      toast.error('Save the project details first')
      throw new Error('Cannot save quantity before the job is created')
    }
    try {
      setSaving()
      const storeState = useQuotationStore.getState()
      const calcs = {
        pebRoof: calculatePebQuantities({
          roof: storeState.roof,
          joint: storeState.joint,
          jointBoltRoofs: storeState.joint?.jointBoltRoof,
          foundationBoltRoof: storeState.joint?.foundationBoltRoof,
        }),
        cladding: calculateCladdingQuantities({ roof: storeState.roof }),
        canopy: calculateCanopyQuantities({ canopy: storeState.canopy, joint: storeState.joint }),
        accessories: calculateAccessoriesQuantities({ accessories: storeState.accessories, roof: storeState.roof }),
        mezzanine: calculateMezzanineQuantities({ mezzanine: storeState.mezzanine, joint: storeState.joint, jointBoltMezzanines: storeState.joint?.jointBoltMezzanine, stair: storeState.stair }),
        stair: calculateStairQuantities({ stair: storeState.stair, mezzanine: storeState.mezzanine }),
        additionalBolts: calculateAdditionalBoltsQuantities({}),
      }

      const payload = buildFullQuantityPayload(calcs, storeState.quantity, storeState.quantityDrafts)

      const updatedQuantity = await upsertQuantity.mutateAsync({ jobId, payload })
      useQuotationStore.setState({ quantity: updatedQuantity })
      setSaved()
      successToast('Quantity saved successfully')
    } catch (err) {
      resetSaveStatus()
      toast.error('Failed to save quantity')
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

    // Step 7 (Load): persist the load, then advance. No validation gate — every
    // load field is optional.
    if (currentStep === 7) {
      try {
        await submitLoad()
        goStep(8)
      } catch {
        // Error toast already shown; stay on Step 7.
      }
      return
    }

    // Step 8 (Joint): persist the joint, then advance. No validation gate —
    // every joint field is optional.
    if (currentStep === 8) {
      try {
        await submitJoint()
        goStep(9)
      } catch {
        // Error toast already shown; stay on Step 8.
      }
      return
    }

    // Step 9 (Spec): persist the spec, then advance to the Rate Master step.
    if (currentStep === 9) {
      try {
        await submitSpec()
        goStep(10)
      } catch {
        // Error toast already shown; stay on Step 9.
      }
      return
    }

    // Step 10 (Rate Master): no wizard-level persistence — rows are saved
    // independently in the table. Just advance to the Amount step.
    if (currentStep === 10) {
      goStep(11)
      return
    }

    // Step 11 (Amount): upsert the canonical 36 items then advance to Quantity.
    if (currentStep === 11) {
      try {
        await submitAmount()
        goStep(12)
      } catch {
        // Error toast already shown; stay on Step 11.
      }
      return
    }

    // Final step (Quantity): upsert all quantity sections then finalise.
    if (isLast) {
      try {
        await submitQuantity()
        resetQuotation()
        navigate('/')
      } catch {
        // Error toast already shown; stay on Step 12.
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
    } else if (currentStep === 8) {
      try { await submitJoint() } catch { /* error toast already shown */ }
    } else if (currentStep === 9) {
      try { await submitSpec() } catch { /* error toast already shown */ }
    } else if (currentStep === 11) {
      try { await submitAmount() } catch { /* error toast already shown */ }
    } else if (currentStep === 12) {
      try { await submitQuantity() } catch { /* error toast already shown */ }
    } else {
      successToast('Draft saved')
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
