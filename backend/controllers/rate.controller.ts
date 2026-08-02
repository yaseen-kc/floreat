/** HTTP handlers for job-specific rate operations. */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createRateSchema, updateRateSchema, paginationSchema } from '../schemas/rate.schema.js'
import * as rateService from '../services/rate.service.js'
import { sendError } from '../utils/response.js'

const params = (request: FastifyRequest) => request.params as { jobId: string; id: string }

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const result = createRateSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try { return reply.status(201).send(await rateService.createRate(params(request).jobId, result.data)) }
  catch (err: any) { if (err?.code === 'P2002') return sendError(reply, 409, 'A rate with this item already exists for this job'); throw err }
}

export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await rateService.getRates(params(request).jobId, result.data.page, result.data.pageSize))
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { jobId, id } = params(request)
  const rate = await rateService.getRateById(jobId, id)
  if (!rate) return sendError(reply, 404, 'Rate not found')
  return reply.send(rate)
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId, id } = params(request)
  const result = updateRateSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try { return reply.send(await rateService.updateRate(jobId, id, result.data)) }
  catch (err: any) {
    if (err?.code === 'P2002') return sendError(reply, 409, 'A rate with this item already exists for this job')
    if (err?.code === 'P2025') return sendError(reply, 404, 'Rate not found')
    throw err
  }
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId, id } = params(request)
  try { await rateService.deleteRate(jobId, id); return reply.status(204).send() }
  catch (err: any) { if (err?.code === 'P2025') return sendError(reply, 404, 'Rate not found'); throw err }
}
