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
    { partNumber: 'PN-1001', name: 'Dilithium Crystal Housing', quantity: 150, price: 10.99 },
    { partNumber: 'PN-1002', name: 'Warp Core Assembly', quantity: 10, price: 1000.0 },
    { partNumber: 'PN-1003', name: 'Antimatter Injector', quantity: 500, price: 29.98 },
    { partNumber: 'PN-1004', name: 'Plasma Conduit', quantity: 250, price: 48.75 },
    { partNumber: 'PN-1005', name: 'Electro-Plasma System Relay', quantity: 1000, price: 1.99 },
    { partNumber: 'PN-1006', name: 'Impulse Drive Coil', quantity: 50, price: 499.99 },
    { partNumber: 'PN-1007', name: 'Matter/Antimatter Reaction Chamber', quantity: 20, price: 1200.00 },
    { partNumber: 'PN-1008', name: 'Isolinear Chip', quantity: 350, price: 25.49 },
    { partNumber: 'PN-1009', name: 'Biofilter Unit', quantity: 200, price: 19.98 },
    { partNumber: 'PN-1010', name: 'Stem Bolt (Box of 100)', quantity: 80, price: 80.99 },
  ]

  const createdParts = []
  for (const p of parts) {
    const part = await prisma.part.create({
      data: {
        partNumber: p.partNumber,
        name: p.name,
        price: p.price,
        inventory: { create: { quantity: p.quantity } },
      },
    })
    createdParts.push(part)
  }

  const contractorNames = ['Contractor-A', 'Contractor-B', 'Contractor-C']
  const createdContractors = []
  for (const name of contractorNames) {
    const contractor = await prisma.contractor.create({ data: { name } })
    createdContractors.push(contractor)
  }

  let orderCount = 0
  for (const [index, part] of createdParts.entries()) {
    const status = ORDER_STATUSES[index % ORDER_STATUSES.length]
    const orderedAmount = 10 + index * 5
    const contractor = createdContractors[index % createdContractors.length]

    await prisma.order.create({
      data: {
        partId: part.id,
        orderedAmount,
        status,
        contractorId: contractor.id
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