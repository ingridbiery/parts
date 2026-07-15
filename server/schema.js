const { createPubSub } = require('graphql-yoga')

const pubSub = createPubSub()

const typeDefs = /* GraphQL */ `
  type Order {
    id: Int!
    partName: String!
    quantity: Int!
    status: String!
    createdAt: String!
  }

  type Query {
    orders: [Order!]!
  }

  type Mutation {
    createOrder(partName: String!, quantity: Int!): Order!
    updateOrderStatus(id: Int!, status: String!): Order!
  }

  type Subscription {
    orderCreated: Order!
    orderUpdated: Order!
  }
`

function makeResolvers(prisma) {
  return {
    Query: {
      orders: () => prisma.order.findMany({ orderBy: { createdAt: 'desc' } }),
    },
    Mutation: {
      createOrder: async (_, { partName, quantity }) => {
        const order = await prisma.order.create({ data: { partName, quantity } })
        pubSub.publish('orderCreated', { orderCreated: order })
        return order
      },
      updateOrderStatus: async (_, { id, status }) => {
        const order = await prisma.order.update({ where: { id }, data: { status } })
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