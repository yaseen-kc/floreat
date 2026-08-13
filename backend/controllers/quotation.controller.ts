/**
 * Quotation controller — handles HTTP request/response logic for quotation endpoints.
 * Delegates business logic to the quotation service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createQuotationSchema, updateQuotationSchema, paginationSchema } from '../schemas/quotation.schema.js'
import * as quotationService from '../services/quotation.service.js'
import { sendError } from '../utils/response.js'
import { isGlobalRole } from '../auth/authorization.js'

/** POST /api/jobs/:jobId/quotation — upserts a quotation for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createQuotationSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const quotation = await quotationService.upsertQuotation(jobId, result.data)
  return reply.status(200).send(quotation)
}

/** GET /api/quotations — returns a paginated list of all quotations. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await quotationService.getQuotations(request.userId, result.data.page, result.data.pageSize, isGlobalRole(request.role)))
}

/** GET /api/jobs/:jobId/quotation — returns the quotation for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const quotation = await quotationService.getQuotationByJobId(jobId)
  if (!quotation) return sendError(reply, 404, 'Quotation not found')
  return reply.send(quotation)
}

/** PUT /api/jobs/:jobId/quotation — partially updates the quotation for a job. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateQuotationSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const quotation = await quotationService.updateQuotation(jobId, result.data)
    return reply.send(quotation)
  } catch {
    return sendError(reply, 404, 'Quotation not found')
  }
}

/** DELETE /api/jobs/:jobId/quotation — deletes the quotation for a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await quotationService.deleteQuotation(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Quotation not found')
    throw err
  }
}

export async function transition(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const body = request.body as { status?: 'SUBMITTED' | 'APPROVED' | 'REJECTED'; comment?: string }
  if (!body?.status) return reply.status(400).send({ error: 'Status is required' })
  const isReview = request.url.includes('/review')
  if (isReview ? !['APPROVED', 'REJECTED'].includes(body.status) : body.status !== 'SUBMITTED') {
    return sendError(reply, 400, 'Invalid status for this workflow action')
  }
  try { return reply.send(await quotationService.transitionQuotation(jobId, request.userId, body.status, body.comment)) }
  catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Quotation not found')
    if (err?.code === 'INVALID_TRANSITION') return sendError(reply, 409, err.message)
    throw err
  }
}
