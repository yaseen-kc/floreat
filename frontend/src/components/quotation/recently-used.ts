import { getAccessoriesByJobId } from '@/api/quotation/accessories/getAccessories'
import { getCanopyByJobId } from '@/api/quotation/canopy/getCanopy'
import { getJointByJobId } from '@/api/quotation/joint/getJoint'
import { getLoadByJobId } from '@/api/quotation/load/getLoad'
import { getMezzanineByJobId } from '@/api/quotation/mezz/getMezz'
import { getQuotationByJobId } from '@/api/quotation/quotation/getQuotation'
import { getRoofByJobId } from '@/api/quotation/roof/getRoof'
import { getSpecByJobId } from '@/api/quotation/spec/getSpec'
import { getStairByJobId } from '@/api/quotation/stair/getStairs'
import { getRates } from '@/api/quotation/rate/getRate'
import type { Job } from '@/api/quotation/jobs/getJobs'
import {
  createDefaultAccessories,
  createDefaultCanopy,
  createDefaultJoint,
  createDefaultLoad,
  createDefaultMezzanine,
  createDefaultQuotation,
  createDefaultRoof,
  createDefaultRoofSections,
  createDefaultSpec,
  createDefaultStair,
  createDefaultProjectInfo,
  useQuotationStore,
} from '@/stores/quotation-store'
import { mapAccessoriesResponseToDraft } from '@/utils/hydrateAccessories'
import { mapCanopyResponseToDraft } from '@/utils/hydrateCanopy'
import { mapJointResponseToDraft } from '@/utils/hydrateJoint'
import { mapLoadResponseToDraft } from '@/utils/hydrateLoad'
import { mapMezzanineResponseToDraft } from '@/utils/hydrateMezzanine'
import { mapQuotationResponseToDraft } from '@/utils/hydrateQuotation'
import { mapRoofResponseToDraft } from '@/utils/hydrateRoof'
import { mapSpecResponseToDraft } from '@/utils/hydrateSpec'
import { mapStairResponseToDraft } from '@/utils/hydrateStair'
import { mergeRatesWithDefaults } from '@/utils/hydrateRate'

export type RecentlyUsedStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

type Token = string | null

interface StepAdapter {
  apply: (job: Job, token: Token) => Promise<void>
}

function applyProjectInfo(job: Job): void {
  useQuotationStore.setState({ projectInfo: createDefaultProjectInfo() })
  useQuotationStore.getState().setProjectInfo({
    projectNo: job.projectNo,
    subject: job.subject,
    refNo: job.refNo,
    date: job.date,
    designedByName: job.designedByName,
    designedByMobile: job.designedByMobile,
    clientName: job.clientName ?? '',
    estimationEngineerName: job.estimationEngineerName ?? '',
    estimationEngineerMobile: job.estimationEngineerMobile ?? '',
    headOfSalesName: job.headOfSalesName ?? '',
    headOfSalesMobile: job.headOfSalesMobile ?? '',
    firmName: job.firmName ?? '',
    buildingUsage: job.buildingUsage,
    numberOfBuilding: job.numberOfBuilding,
    frameType: job.frameType,
    configuration: job.configuration,
  })
}

const adapters: Partial<Record<RecentlyUsedStep, StepAdapter>> = {
  1: { apply: async (job) => applyProjectInfo(job) },
  2: {
    apply: async (job, token) => {
      const data = await getRoofByJobId(token, job.id)
      const mapped = mapRoofResponseToDraft(data)
      useQuotationStore.setState({ roof: createDefaultRoof(), roofSectionsEnabled: createDefaultRoofSections() })
      useQuotationStore.getState().setRoof(mapped.roof)
      useQuotationStore.setState({ roofSectionsEnabled: mapped.roofSectionsEnabled })
    },
  },
  3: {
    apply: async (job, token) => {
      const data = await getMezzanineByJobId(token, job.id)
      useQuotationStore.setState({ mezzanine: data ? mapMezzanineResponseToDraft(data) : createDefaultMezzanine() })
    },
  },
  4: {
    apply: async (job, token) => {
      const data = await getStairByJobId(token, job.id)
      useQuotationStore.setState({ stair: data ? mapStairResponseToDraft(data) : createDefaultStair() })
    },
  },
  5: {
    apply: async (job, token) => {
      const data = await getCanopyByJobId(token, job.id)
      useQuotationStore.setState({ canopy: data ? mapCanopyResponseToDraft(data) : createDefaultCanopy() })
    },
  },
  6: {
    apply: async (job, token) => {
      const data = await getAccessoriesByJobId(token, job.id)
      useQuotationStore.setState({ accessories: data ? mapAccessoriesResponseToDraft(data) : createDefaultAccessories() })
    },
  },
  7: {
    apply: async (job, token) => {
      const data = await getLoadByJobId(token, job.id)
      useQuotationStore.setState({ load: data ? mapLoadResponseToDraft(data) : createDefaultLoad() })
    },
  },
  8: {
    apply: async (job, token) => {
      const data = await getJointByJobId(token, job.id)
      useQuotationStore.setState({ joint: createDefaultJoint() })
      if (data) useQuotationStore.getState().setJoint(mapJointResponseToDraft(data))
    },
  },
  9: {
    apply: async (job, token) => {
      const data = await getSpecByJobId(token, job.id)
      useQuotationStore.setState({ spec: data ? mapSpecResponseToDraft(data) : createDefaultSpec() })
    },
  },
  10: {
    apply: async (job, token) => {
      const data = await getRates(token, job.id, 1, 100)
      useQuotationStore.setState({ rateRows: mergeRatesWithDefaults(data.data) })
    },
  },
  13: {
    apply: async (job, token) => {
      const data = await getQuotationByJobId(token, job.id)
      useQuotationStore.setState({ quotation: data ? mapQuotationResponseToDraft(data) : createDefaultQuotation() })
    },
  },
}

export function getRecentlyUsedAdapter(step: RecentlyUsedStep): StepAdapter | undefined {
  return adapters[step]
}

export function applyRecentlyUsedProjectInfo(job: Job): void {
  applyProjectInfo(job)
}
