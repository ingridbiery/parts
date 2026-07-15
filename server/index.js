const { createYoga, createSchema } = require('graphql-yoga')
const { createServer } = require('node:http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const prisma = require('./prisma')
const { typeDefs, makeResolvers } = require('./schema')

const schema = createSchema({
  typeDefs,
  resolvers: makeResolvers(prisma),
})

const yoga = createYoga({ schema })
const server = createServer(yoga)

const wsServer = new WebSocketServer({
  server,
  path: yoga.graphqlEndpoint, // same path: /graphql
})

useServer({ schema }, wsServer)

server.listen(4000, () => {
  console.log('GraphQL + WS server: http://localhost:4000/graphql')
})