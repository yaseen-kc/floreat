/**
 * Roof controller — handles HTTP request/response logic for roof endpoints.
 * Delegates business logic to the roof service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createRoofSchema, updateRoofSchema, upsertRoofSectionsSchema } from '../schemas/roof.schema.js'
import * as roofService from '../services/roof.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/roofs — creates a new roof for a job. */
export async function create(request: FastifyRequest, reply: FastifyReply) {
  const result = createRoofSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const roof = await roofService.createRoof(result.data)
  return reply.status(201).send(roof)
}

/** GET /api/roofs/:id — returns a single roof by ID. */
export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const roof = await roofService.getRoofById(id)
  if (!roof) return sendError(reply, 404, 'Roof not found')
  return reply.send(roof)
}

/** GET /api/roofs/by-job/:jobId — returns the roof associated with a job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const roof = await roofService.getRoofByJobId(jobId)
  if (!roof) return sendError(reply, 404, 'Roof not found')
  return reply.send(roof)
}

const updateBodySchema = updateRoofSchema.merge(upsertRoofSectionsSchema)

/** PUT /api/roofs/:id — partially updates a roof and upserts any provided sub-sections. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const result = updateBodySchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })

  const { member, purlin, sidewalls, covering, flangeBrace, polycarbonate,
    windBracing, claddingOpening, fasciaBoard, sideExtension,
    roofMaterialStrengthOrGuide, ...roofData } = result.data

  const sections = { member, purlin, sidewalls, covering, flangeBrace, polycarbonate,
    windBracing, claddingOpening, fasciaBoard, sideExtension, roofMaterialStrengthOrGuide }

  try {
    const roof = await roofService.updateRoof(id, roofData, sections)
    return reply.send(roof)
  } catch {
    return sendError(reply, 404, 'Roof not found')
  }
}

/** DELETE /api/roofs/:id — deletes a roof and all its sub-sections. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  try {
    await roofService.deleteRoof(id)
    return reply.status(204).send()
  } catch {
    return sendError(reply, 404, 'Roof not found')
  }
}
