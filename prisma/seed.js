require('dotenv/config')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
const { PrismaClient } = require('@prisma/client')
const { ORDER_STATUSES } = require('../server/orderStatus')

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const parts = [
    { partNumber: 'PN-1001', name: 'Dilithium Crystal Housing', quantity: 150 },
    { partNumber: 'PN-1002', name: 'Warp Core Assembly', quantity: 10 },
    { partNumber: 'PN-1003', name: 'Antimatter Injector', quantity: 500 },
    { partNumber: 'PN-1004', name: 'Plasma Conduit', quantity: 250 },
    { partNumber: 'PN-1005', name: 'Electro-Plasma System Relay', quantity: 1000 },
    { partNumber: 'PN-1006', name: 'Impulse Drive Coil', quantity: 50 },
    { partNumber: 'PN-1007', name: 'Matter/Antimatter Reaction Chamber', quantity: 20 },
    { partNumber: 'PN-1008', name: 'Isolienar Chip', quantity: 350 },
    { partNumber: 'PN-1009', name: 'Biofilter Unit', quantity: 200 },
    { partNumber: 'PN-1010', name: 'Stem Bolt (Box of 100)', quantity: 80 },
  ]

  const createdParts = []
  for (const p of parts) {
    const part = await prisma.part.create({
      data: {
        partNumber: p.partNumber,
        name: p.name,
        inventory: { create: { quantity: p.quantity } },
      },
    })
    createdParts.push(part)
  }

  let orderCount = 0
  for (const [index, part] of createdParts.entries()) {
    const status = ORDER_STATUSES[index % ORDER_STATUSES.length]
    const orderedAmount = 10 + index * 5

    await prisma.order.create({
      data: {
        partId: part.id,
        orderedAmount,
        status,
      },
    })
    orderCount++
  }

console.log(`Seed complete: ${createdParts.length} parts, ${orderCount} orders.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })