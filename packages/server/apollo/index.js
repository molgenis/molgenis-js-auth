const { ApolloServer } = require('apollo-server-express')
const resolvers = require("./resolvers")
const permissions = require('./permissions')
const FusionAPI = require("./FusionAPI")
const { applyMiddleware } = require('graphql-middleware')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const fs = require("fs")
const path = require("path")
const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8")

const dataSources = () => ({
  fusionAPI: new FusionAPI()
})

const context = ({ req }) => ({
  token: process.env.FUSION_API_TOKEN,
  applicationId: process.env.CLIENT_ID,
  user: req.openid.user
})

const schema = applyMiddleware(makeExecutableSchema({ typeDefs, resolvers }), permissions)
const apollo = new ApolloServer({ schema, dataSources, context })

module.exports = apollo