import type { FastifyReply, FastifyRequest } from 'fastify'
import { restoreBatch } from '../services/soft-delete.service.js'

export async function restore(request: FastifyRequest, reply: FastifyReply) {
  const { batchId } = request.params as { batchId: string }
  try { return reply.send(await restoreBatch(batchId)) }
  catch (err: any) { if (err?.code === 'P2025') return reply.status(404).send({ error: 'Deleted batch not found' }); throw err }
}
