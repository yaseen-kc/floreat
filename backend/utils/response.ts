/**
 * Response utility helpers for consistent error formatting across the API.
 */
import { FastifyReply } from 'fastify'

/** Sends a standardized JSON error response with the given status code and message. */
export function sendError(reply: FastifyReply, statusCode: number, message: string) {
  return reply.status(statusCode).send({ error: message })
}
