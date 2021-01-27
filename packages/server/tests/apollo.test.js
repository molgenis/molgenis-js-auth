const apollo = require('../src/apollo')

const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const fs = require("fs")
const path = require("path")
const { graphql } = require('graphql')
const { applyMiddleware } = require('graphql-middleware')
const permissions = require('../src/apollo/permissions')

let schemaWithMiddleware

beforeAll(() => {
  const typeDefs = fs.readFileSync(path.join(__dirname, "../src/apollo/schema.graphql"), "utf8")
  const schema = makeExecutableSchema({ typeDefs })
  addMockFunctionsToSchema({ schema })
  schemaWithMiddleware = applyMiddleware(schema, permissions)
})

const Queries = {
  GET_REGISTERED_USERS: `
    query {
      registeredUsers {
        email
        roles
      }
    }
    `,
  GET_ME: `
    query {
      me {
        email
        roles
      }
    }
    `,
    GET_APPLICATION: `
    query {
      application {
        name
      }
    }
    `
}

describe('permissions', () => {
  describe('fallback', () => {
    it('denies access to anonymous', async () => {
      const mockContext = {}
  
      const result = await graphql(
        schemaWithMiddleware,
        Queries.GET_REGISTERED_USERS,
        null,
        mockContext,
      )
  
      expect(result.data.registeredUsers).toBeFalsy()
      expect(result.errors).toBeTruthy()
      expect(result.errors.length).toBe(1)
      expect(result.errors[0].message).toEqual(
        expect.stringContaining('Not Authorised!')
      )
    })
  
    it('denies access to non-SU', async () => {
      const mockContext = {
        user: {
          roles: ['ROLE1']
        }
      }
  
      const result = await graphql(
        schemaWithMiddleware,
        Queries.GET_REGISTERED_USERS,
        null,
        mockContext,
      )
  
      expect(result.data.registeredUsers).toBeFalsy()
      expect(result.errors).toBeTruthy()
      expect(result.errors.length).toBe(1)
      expect(result.errors[0].message).toEqual(
        expect.stringContaining('Not Authorised!')
      )
    })
  
    it('allows access to SU', async () => {
      const mockContext = {
        user: {
          roles: ['SU']
        }
      }
  
      const result = await graphql(
        schemaWithMiddleware,
        Queries.GET_REGISTERED_USERS,
        null,
        mockContext,
      )
  
      expect(result.data.registeredUsers).toBeTruthy()
      expect(result.errors).toBeFalsy()
    })
  })

  describe('me', () => {
    it('allows access to anonymous', async () => {
      const mockContext = { }
  
      const result = await graphql(
        schemaWithMiddleware,
        Queries.GET_ME,
        null,
        mockContext,
      )
  
      expect(result.data.me).toBeTruthy()
      expect(result.errors).toBeFalsy()
    })

    it('allows access to non-SU', async () => {
      const mockContext = {
        user: {
          roles: ['ROLE1']
        }
      }
  
      const result = await graphql(
        schemaWithMiddleware,
        Queries.GET_ME,
        null,
        mockContext,
      )
  
      expect(result.data.me).toBeTruthy()
      expect(result.errors).toBeFalsy()
    })
  })

  describe('application', () => {
    it('allows access to anonymous', async () => {
      const mockContext = { }
  
      const result = await graphql(
        schemaWithMiddleware,
        Queries.GET_APPLICATION,
        null,
        mockContext,
      )
  
      expect(result.data.application).toBeTruthy()
      expect(result.errors).toBeFalsy()
    })

    it('allows access to non-SU', async () => {
      const mockContext = {
        user: {
          roles: ['ROLE1']
        }
      }
  
      const result = await graphql(
        schemaWithMiddleware,
        Queries.GET_APPLICATION,
        null,
        mockContext,
      )
      expect(result.data.application).toBeTruthy()
      expect(result.errors).toBeFalsy()
    })
  })
})
