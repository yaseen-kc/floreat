/**
 * Rate controller — handles HTTP request/response logic for rate master-data
 * endpoints. Delegates business logic to the rate service layer. Rate is a
 * top-level master table, so it uses plain REST (`/rates`, `/rates/:id`).
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createRateSchema, updateRateSchema, paginationSchema } from '../schemas/rate.schema.js'
import * as rateService from '../services/rate.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/rates — creates a new rate master item. */
export async function create(request: FastifyRequest, reply: FastifyReply) {
  const result = createRateSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const rate = await rateService.createRate(result.data)
    return reply.status(201).send(rate)
  } catch (err: any) {
    if (err?.code === 'P2002') return sendError(reply, 409, 'A rate with this item already exists')
    throw err
  }
}

/** GET /api/rates — returns a paginated list of rate items. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await rateService.getRates(result.data.page, result.data.pageSize))
}

/** GET /api/rates/:id — returns a single rate item. */
export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const rate = await rateService.getRateById(id)
  if (!rate) return sendError(reply, 404, 'Rate not found')
  return reply.send(rate)
}

/** PUT /api/rates/:id — partially updates a rate item. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const result = updateRateSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const rate = await rateService.updateRate(id, result.data)
    return reply.send(rate)
  } catch (err: any) {
    if (err?.code === 'P2002') return sendError(reply, 409, 'A rate with this item already exists')
    return sendError(reply, 404, 'Rate not found')
  }
}

/** DELETE /api/rates/:id — deletes a rate item. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  try {
    await rateService.deleteRate(id)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Rate not found')
    throw err
  }
}
