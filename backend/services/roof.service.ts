/**
 * Roof service — encapsulates database operations for the Roof model and its sub-sections.
 */
import { prisma } from '../lib/prisma.js'
import { z } from 'zod'
import { upsertRoofSectionsSchema, updateRoofSchema } from '../schemas/roof.schema.js'

/** Includes all sub-relations when querying a Roof. */
const roofInclude = {
  member: true,
  purlin: true,
  covering: true,
  flangeBrace: true,
  polycarbonate: true,
  windBracing: true,
  claddingOpening: true,
  fasciaBoard: true,
  sideExtension: true,
  roofMaterialStrengthOrGuide: true,
  sidewalls: true,
} as const

/** Creates a new Roof record with all sub-relations included in the response. */
export function createRoof(data: Parameters<typeof prisma.roof.create>[0]['data']) {
  return prisma.roof.create({ data, include: roofInclude })
}

/** Finds a Roof by its ID, including all sub-relations. Returns null if not found. */
export function getRoofById(id: string) {
  return prisma.roof.findUnique({ where: { id }, include: roofInclude })
}

/** Finds a Roof by its associated Job ID. Returns null if not found. */
export function getRoofByJobId(jobId: string) {
  return prisma.roof.findUnique({ where: { jobId }, include: roofInclude })
}

type UpdateRoofData = z.infer<typeof updateRoofSchema>
type Sections = z.infer<typeof upsertRoofSectionsSchema>

/** Updates a Roof and upserts any provided sub-sections in a single transaction. */
export async function updateRoof(id: string, data: UpdateRoofData, sections?: Sections) {
  await prisma.$transaction(async (tx) => {
    if (Object.keys(data).length > 0) {
      await tx.roof.update({ where: { id }, data })
    }

    if (!sections) return

    if (sections.member) {
      await tx.roofMember.upsert({
        where: { roofId: id },
        create: { roofId: id, ...sections.member },
        update: sections.member,
      })
    }
    if (sections.purlin) {
      await tx.roofPurlin.upsert({
        where: { roofId: id },
        create: { roofId: id, ...sections.purlin },
        update: sections.purlin,
      })
    }
    if (sections.sidewalls) {
      for (const sw of sections.sidewalls) {
        await tx.sidewall.upsert({
          where: { roofId_side: { roofId: id, side: sw.side } },
          create: { roofId: id, ...sw },
          update: { wallType: sw.wallType, thickness: sw.thickness, height: sw.height },
        })
      }
    }
    if (sections.covering) {
      await tx.roofCovering.upsert({
        where: { roofId: id },
        create: { roofId: id, ...sections.covering },
        update: sections.covering,
      })
    }
    if (sections.flangeBrace) {
      await tx.roofFlangeBrace.upsert({
        where: { roofId: id },
        create: { roofId: id, ...sections.flangeBrace },
        update: sections.flangeBrace,
      })
    }
    if (sections.polycarbonate) {
      await tx.roofPolycarbonate.upsert({
        where: { roofId: id },
        create: { roofId: id, ...sections.polycarbonate },
        update: sections.polycarbonate,
      })
    }
    if (sections.windBracing) {
      await tx.roofWindBracing.upsert({
        where: { roofId: id },
        create: { roofId: id, ...sections.windBracing },
        update: sections.windBracing,
      })
    }
    if (sections.claddingOpening) {
      await tx.roofCladdingOpening.upsert({
        where: { roofId: id },
        create: { roofId: id, ...sections.claddingOpening },
        update: sections.claddingOpening,
      })
    }
    if (sections.fasciaBoard) {
      await tx.roofFasciaBoard.upsert({
        where: { roofId: id },
        create: { roofId: id, ...sections.fasciaBoard },
        update: sections.fasciaBoard,
      })
    }
    if (sections.sideExtension) {
      await tx.roofSideExtension.upsert({
        where: { roofId: id },
        create: { roofId: id, ...sections.sideExtension },
        update: sections.sideExtension,
      })
    }
    if (sections.roofMaterialStrengthOrGuide) {
      await tx.roofMaterialStrengthOrGuide.upsert({
        where: { roofId: id },
        create: { roofId: id, ...sections.roofMaterialStrengthOrGuide },
        update: sections.roofMaterialStrengthOrGuide,
      })
    }
  })

  return getRoofById(id)
}

/** Deletes a Roof by ID. Cascades to all sub-models. Throws if not found. */
export function deleteRoof(id: string) {
  return prisma.roof.delete({ where: { id } })
}
