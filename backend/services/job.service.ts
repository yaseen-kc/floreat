/**
 * Job service — encapsulates database operations for the Job model.
 */
import { prisma } from '../lib/prisma.js'

/** Creates a new job record. */
export function createJob(data: Parameters<typeof prisma.job.create>[0]['data']) {
  return prisma.job.create({ data })
}

/** Returns a paginated list of jobs ordered by most recent first. */
export async function getJobs(page: number, pageSize: number) {
  const [data, total] = await Promise.all([
    prisma.job.findMany({ skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.job.count(),
  ])
  return { data, total, page, pageSize }
}

/** Finds a single job by ID. Returns null if not found. */
export function getJobById(id: string) {
  return prisma.job.findUnique({ where: { id } })
}

/** Partially updates a job by ID. Throws if not found. */
export function updateJob(id: string, data: Parameters<typeof prisma.job.update>[0]['data']) {
  return prisma.job.update({ where: { id }, data })
}

/** Deletes a job by ID. Throws if not found. */
export function deleteJob(id: string) {
  return prisma.job.delete({ where: { id } })
}
