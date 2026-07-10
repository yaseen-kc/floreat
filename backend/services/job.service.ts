/**
 * Job service — encapsulates database operations for the Job model.
 * Every operation is scoped by `userId` (the Clerk id / request.userId) so a
 * user can only ever see or mutate their own jobs (tenant isolation, C1).
 */
import { prisma } from '../lib/prisma.js'

type JobCreateData = Parameters<typeof prisma.job.create>[0]['data']
type JobUpdateData = Parameters<typeof prisma.job.update>[0]['data']

/** Creates a new job owned by `userId`. Requires the User row to exist (syncUser). */
export function createJob(userId: string, data: Omit<JobCreateData, 'userId' | 'user'>) {
  return prisma.job.create({ data: { ...data, userId } as JobCreateData })
}

/** Returns a paginated list of the user's jobs ordered by most recent first. */
export async function getJobs(userId: string, page: number, pageSize: number) {
  const [data, total] = await Promise.all([
    prisma.job.findMany({
      where: { userId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.job.count({ where: { userId } }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a single job owned by `userId`. Returns null if not found or not owned. */
export function getJobById(id: string, userId: string) {
  return prisma.job.findFirst({ where: { id, userId } })
}

/**
 * Partially updates a job owned by `userId`. Throws a P2025-coded error when the
 * job does not exist or is not owned by the user (mapped to 404 by the controller).
 */
export async function updateJob(id: string, userId: string, data: JobUpdateData) {
  const { count } = await prisma.job.updateMany({ where: { id, userId }, data })
  if (count === 0) throw Object.assign(new Error('Job not found'), { code: 'P2025' })
  return prisma.job.findUniqueOrThrow({ where: { id } })
}

/**
 * Deletes a job owned by `userId`. Throws a P2025-coded error when the job does
 * not exist or is not owned by the user (mapped to 404 by the controller).
 */
export async function deleteJob(id: string, userId: string) {
  const { count } = await prisma.job.deleteMany({ where: { id, userId } })
  if (count === 0) throw Object.assign(new Error('Job not found'), { code: 'P2025' })
}
