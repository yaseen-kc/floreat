import { prisma } from '../lib/prisma.js'

async function main() {
  const canopy = await prisma.canopy.findFirst({ include: { canopies: true } })
  console.log(JSON.stringify(canopy?.canopies, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
