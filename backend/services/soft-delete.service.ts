import { randomUUID } from 'node:crypto'
import { prisma } from '../lib/prisma.js'

export type DeleteContext = { deletedBy?: string; deletionBatchId?: string }
export const activeWhere = { deletedAt: null } as const
export const newDeletionBatchId = () => randomUUID()
export const deletionData = (context: DeleteContext = {}) => ({
  deletedAt: new Date(),
  deletedBy: context.deletedBy ?? null,
  deletionBatchId: context.deletionBatchId ?? newDeletionBatchId(),
})

export function softDelete(model: any, where: any, context: DeleteContext = {}) {
  return model.update({ where, data: deletionData(context) })
}

export function softDeleteMany(model: any, where: any, context: DeleteContext = {}) {
  return model.updateMany({ where: { ...where, deletedAt: null }, data: deletionData(context) })
}

export async function replaceChildren(tx: any, model: string, foreignKey: string, foreignId: string, rows: any[]) {
  await tx[model].updateMany({
    where: { [foreignKey]: foreignId, deletedAt: null },
    data: deletionData(),
  })
  if (rows.length) await tx[model].createMany({ data: rows.map((row) => ({ ...row, [foreignKey]: foreignId })) })
}

const jobChildren = ['roof', 'mezzanine', 'stair', 'canopy', 'load', 'accessories', 'joint', 'spec', 'quantity', 'amount', 'quotation']

export async function softDeleteJob(id: string, userId: string) {
  const batchId = newDeletionBatchId()
  return prisma.$transaction(async (tx: any) => {
    const job = await tx.job.findFirst({ where: { id, userId, deletedAt: null }, select: { id: true } })
    if (!job) throw Object.assign(new Error('Job not found'), { code: 'P2025' })
    const data = deletionData({ deletedBy: userId, deletionBatchId: batchId })
    await tx.job.update({ where: { id }, data })
    for (const model of jobChildren) await tx[model].updateMany({ where: { jobId: id, deletedAt: null }, data })
    await tx.rate.updateMany({ where: { jobId: id, deletedAt: null }, data })
    const parents = {
      roof: await tx.roof.findFirst({ where: { jobId: id }, select: { id: true } }),
      mezzanine: await tx.mezzanine.findFirst({ where: { jobId: id }, select: { id: true } }),
      stair: await tx.stair.findFirst({ where: { jobId: id }, select: { id: true } }),
      canopy: await tx.canopy.findFirst({ where: { jobId: id }, select: { id: true } }),
      joint: await tx.joint.findFirst({ where: { jobId: id }, select: { id: true } }),
      spec: await tx.spec.findFirst({ where: { jobId: id }, select: { id: true } }),
      quantity: await tx.quantity.findFirst({ where: { jobId: id }, select: { id: true } }),
    }
    const childFilters: Array<[string, string, string | undefined]> = [
      ['sidewall', 'roofId', parents.roof?.id], ['mezzanineFloor', 'mezzanineId', parents.mezzanine?.id],
      ['mezzanineFloorExtension', 'mezzanineId', parents.mezzanine?.id], ['stairItem', 'stairId', parents.stair?.id],
      ['areaDeduction', 'stairId', parents.stair?.id], ['canopyItem', 'canopyId', parents.canopy?.id],
      ['jointBoltRoof', 'jointId', parents.joint?.id], ['jointBoltMezzanine', 'jointId', parents.joint?.id],
      ['foundationBoltRoof', 'jointId', parents.joint?.id], ['specProduct', 'specId', parents.spec?.id],
      ['quantityPebRoof', 'quantityId', parents.quantity?.id], ['quantityCladding', 'quantityId', parents.quantity?.id],
      ['quantityCanopy', 'quantityId', parents.quantity?.id], ['quantityAccessories', 'quantityId', parents.quantity?.id],
      ['quantityMezzanine', 'quantityId', parents.quantity?.id], ['quantityStair', 'quantityId', parents.quantity?.id],
      ['quantityAdditionalBolts', 'quantityId', parents.quantity?.id],
    ]
    for (const [model, key, value] of childFilters) if (value) await tx[model].updateMany({ where: { [key]: value, deletedAt: null }, data })
    return batchId
  })
}

export async function restoreBatch(batchId: string) {
  const data = { deletedAt: null, deletedBy: null, deletionBatchId: null }
  return prisma.$transaction(async (tx: any) => {
    const models = ['job', ...jobChildren, 'rate', 'sidewall', 'canopyItem', 'jointBoltRoof', 'jointBoltMezzanine', 'foundationBoltRoof', 'mezzanineFloor', 'mezzanineFloorExtension', 'quantityPebRoof', 'quantityCladding', 'quantityCanopy', 'quantityAccessories', 'quantityMezzanine', 'quantityStair', 'quantityAdditionalBolts', 'specProduct', 'stairItem', 'areaDeduction']
    let count = 0
    for (const model of models) count += (await tx[model].updateMany({ where: { deletionBatchId: batchId }, data })).count
    if (!count) throw Object.assign(new Error('Deleted batch not found'), { code: 'P2025' })
    return { count }
  })
}
