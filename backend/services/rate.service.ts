/** Job-owned rate operations. Every query is scoped by jobId. */
import { prisma } from '../lib/prisma.js'
import { deriveRateBreakdown } from '@floreat/shared/calc'
import type { BulkRateInput, CreateRateInput, UpdateRateInput } from '../schemas/rate.schema.js'
import { computeJobAmount } from './amount-calc.helper.js'

const toNum = (v: unknown): number | undefined => (v == null ? undefined : Number(v))

function computeBreakdown(row: Partial<CreateRateInput> & Record<string, unknown>) {
  return deriveRateBreakdown({
    material: toNum(row.material), fabrication: toNum(row.fabrication),
    transportation: toNum(row.transportation), installation: toNum(row.installation),
    loadingUnloading: toNum(row.loadingUnloading), overheads: toNum(row.overheads),
    others: toNum(row.others), marginPercentage: toNum(row.marginPercentage),
  })
}

async function refreshAmount(jobId: string) {
  const computed = await computeJobAmount(jobId)
  if (!computed) return
  await prisma.amount.upsert({
    where: { jobId },
    create: { jobId, ...computed, calculationVersion: 'amount-v1', sourceUpdatedAt: new Date(), rateVersion: 1, isStale: false },
    update: { ...computed, calculationVersion: 'amount-v1', sourceUpdatedAt: new Date(), rateVersion: 1, isStale: false },
  })
}

export async function createRate(jobId: string, data: CreateRateInput) {
  const rate = await prisma.rate.create({ data: { jobId, ...data, ...computeBreakdown(data) } })
  await refreshAmount(jobId)
  return rate
}

export async function replaceRates(jobId: string, data: BulkRateInput) {
  const rates = await prisma.$transaction(async (tx) => {
    await tx.rate.deleteMany({ where: { jobId } })
    for (const row of data.rates) {
      await tx.rate.create({ data: { jobId, ...row, ...computeBreakdown(row) } })
    }
    return tx.rate.findMany({ where: { jobId }, orderBy: { createdAt: 'asc' } })
  })
  await refreshAmount(jobId)
  return rates
}

export async function getRates(jobId: string, page: number, pageSize: number) {
  const where = { jobId }
  const [rows, total] = await Promise.all([
    prisma.rate.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.rate.count({ where }),
  ])
  return { data: rows, total, page, pageSize }
}

export function getRateById(jobId: string, id: string) {
  return prisma.rate.findFirst({ where: { id, jobId } })
}

export async function updateRate(jobId: string, id: string, data: UpdateRateInput) {
  const existing = await prisma.rate.findFirst({ where: { id, jobId } })
  if (!existing) throw Object.assign(new Error('Record not found'), { code: 'P2025' })
  const breakdown = computeBreakdown({
    material: data.material !== undefined ? data.material : toNum(existing.material),
    fabrication: data.fabrication !== undefined ? data.fabrication : toNum(existing.fabrication),
    transportation: data.transportation !== undefined ? data.transportation : toNum(existing.transportation),
    installation: data.installation !== undefined ? data.installation : toNum(existing.installation),
    loadingUnloading: data.loadingUnloading !== undefined ? data.loadingUnloading : toNum(existing.loadingUnloading),
    overheads: data.overheads !== undefined ? data.overheads : toNum(existing.overheads),
    others: data.others !== undefined ? data.others : toNum(existing.others),
    marginPercentage: data.marginPercentage !== undefined ? data.marginPercentage : toNum(existing.marginPercentage),
  })
  const rate = await prisma.rate.update({ where: { id }, data: { ...data, ...breakdown } })
  await refreshAmount(jobId)
  return rate
}

export async function deleteRate(jobId: string, id: string) {
  const existing = await prisma.rate.findFirst({ where: { id, jobId } })
  if (!existing) throw Object.assign(new Error('Record not found'), { code: 'P2025' })
  const rate = await prisma.rate.delete({ where: { id } })
  await refreshAmount(jobId)
  return rate
}
