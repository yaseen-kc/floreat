/**
 * Amount controller — handles HTTP request/response logic for amount
 * endpoints. Delegates all business logic to the amount service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createAmountSchema, updateAmountSchema, paginationSchema } from '../schemas/amount.schema.js'
import * as amountService from '../services/amount.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/amount — upserts the amount for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createAmountSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const amount = await amountService.upsertAmount(jobId, result.data)
  return reply.status(200).send(amount)
}

/** GET /api/amounts — returns a paginated list of the user's amounts. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await amountService.getAmounts(request.userId, result.data.page, result.data.pageSize))
}

/** GET /api/jobs/:jobId/amount — returns the amount for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const amount = await amountService.getAmountByJobId(jobId)
  if (!amount) return sendError(reply, 404, 'Amount not found')
  return reply.send(amount)
}

/** PUT /api/jobs/:jobId/amount — replaces items for a job's amount. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateAmountSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const amount = await amountService.updateAmount(jobId, result.data)
    return reply.send(amount)
  } catch {
    return sendError(reply, 404, 'Amount not found')
  }
}

/** DELETE /api/jobs/:jobId/amount — deletes the amount for a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await amountService.deleteAmount(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Amount not found')
    throw err
  }
}
