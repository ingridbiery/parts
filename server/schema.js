const { createPubSub } = require('graphql-yoga')
const { GraphQLError } = require('graphql')
const { ORDER_STATUSES } = require('./orderStatus')

const pubSub = createPubSub()

const typeDefs = /* GraphQL */ `
  scalar DateTime
  
  type Part {
    id: Int!
    partNumber: String!
    name: String!
    price: Float!
    inventory: Inventory
  }

  type Inventory {
    id: Int!
    quantity: Int!
  }

  type Contractor {
    id: Int!
    name: String!
  }

  type Order {
    id: Int!
    orderedAmount: Int!
    status: String!
    createdAt: DateTime!
    part: Part!
    contractor: Contractor!
  }

  type Query {
    parts: [Part!]!
    contractors: [Contractor!]!
    orders(contractorId: Int): [Order!]!
  }

  type Mutation {
    createOrder(partId: Int!, orderedAmount: Int!, contractorId: Int!): Order!
    updateOrderStatus(id: Int!, status: String!): Order!
  }

  type Subscription {
    orderCreated: Order!
    orderUpdated: Order!
  }
`

function makeResolvers(prisma) {
  return {
    DateTime: {
      serialize(value) {
        return value instanceof Date ? value.toISOString() : value
      }
    },
    Query: {
      parts: () => prisma.part.findMany({ include: { inventory: true } }),
      contractors: () => prisma.contractor.findMany(),
      orders: (_, { contractorId }) =>
        prisma.order.findMany({
          where: contractorId ? { contractorId } : {},
          orderBy: { createdAt: 'desc' },
          include: { part: true, contractor: true },
        }),
    },

    Mutation: {
      createOrder: async (_, { partId, orderedAmount, contractorId }) => {
        if (orderedAmount <= 0) {
          throw new GraphQLError('orderedAmount must be greater than 0')
        }

        const inventory = await prisma.inventory.findUnique({ where: { partId } })
        if (!inventory || inventory.quantity < orderedAmount) {
          throw new GraphQLError('Not enough inventory to place this order')
        }

        const order = await prisma.order.create({
          data: { partId, orderedAmount, contractorId, status: 'PENDING' },
          include: { part: true, contractor: true },
        })
        pubSub.publish('orderCreated', { orderCreated: order })
        return order
      },

      updateOrderStatus: async (_, { id, status }) => {
        if (!ORDER_STATUSES.includes(status)) {
          throw new Error(`Invalid status: ${status}`)
        }
        const order = await prisma.order.update({
          where: { id },
          data: { status },
          include: { part: true, contractor: true },
        })
        pubSub.publish('orderUpdated', { orderUpdated: order })
        return order
      },
    },

    Subscription: {
      orderCreated: {
        subscribe: () => pubSub.subscribe('orderCreated'),
        resolve: (payload) => payload.orderCreated,
      },
      orderUpdated: {
        subscribe: () => pubSub.subscribe('orderUpdated'),
        resolve: (payload) => payload.orderUpdated,
      },
    },
  }
}

module.exports = { typeDefs, makeResolvers }