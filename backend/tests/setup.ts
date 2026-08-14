import dotenv from 'dotenv'
import { beforeEach } from 'vitest'
import { prismaMock } from './mocks/prisma.js'
dotenv.config({ path: '.env.test' })

const softDeleteModels = [
  'job', 'rate', 'quotation', 'roof', 'sidewall', 'mezzanine', 'mezzanineFloor',
  'mezzanineFloorExtension', 'stair', 'stairItem', 'areaDeduction', 'canopy',
  'canopyItem', 'joint', 'jointBoltRoof', 'jointBoltMezzanine', 'foundationBoltRoof',
  'spec', 'specProduct', 'quantity', 'accessories', 'amount', 'load',
] as const

function legacyReadArgs(args: any): any {
  const where = args?.where ? { ...args.where } : args?.where
  if (where) delete where.deletedAt
  const include = args?.include && Object.fromEntries(Object.entries(args.include).map(([key, value]) => [key, (value as any)?.where ? true : value]))
  return { ...args, ...(where ? { where } : {}), ...(include ? { include } : {}) }
}

beforeEach(() => {
  prismaMock.$transaction.mockImplementation(async (callback: any) => callback(prismaMock as any) as any)
  for (const modelName of softDeleteModels) {
    const model = (prismaMock as any)[modelName]
    if (!model) continue
    model.findFirst.mockImplementation((args: any) => model.findUnique(legacyReadArgs(args)))
    model.update.mockImplementation((args: any) => model.delete(args))
  }
  ;(prismaMock.job as any).updateMany.mockImplementation((args: any) => (prismaMock.job as any).deleteMany(args))
})
