const resolvers = require('../src/apollo/resolvers')

describe('User', () => {
  describe('roles', () => {
    it('only includes role names of this application', () => {
      const user = { 
        registrations: [
          {
            applicationId: 'other',
            roles: [ 'SU' ]
          },
          {
            applicationId: 'this',
            roles: [ 'ROLE1', 'ROLE2' ]
          }
        ]
       }
    
      const expected = ['ROLE1', 'ROLE2']
    
      expect(resolvers.User.roles(user, null, { applicationId: 'this' })).toEqual(expected)
    })

    it('skips null roles', () => {
      const user = { 
        registrations: [
          {
            applicationId: 'this',
            roles: null
          }
        ]
       }

      expect(resolvers.User.roles(user, null, { applicationId: 'this' })).toEqual([])
    })
  })

  describe('registered', () => {
    it('returns true if the user is registered to this application', () => {
      const user = { 
        registrations: [
          {
            applicationId: 'this'
          },
          {
            applicationId: 'other'
          }
        ]
       }

       expect(resolvers.User.registered(user, null, { applicationId: 'this' })).toEqual(true)
    })

    it('returns false if the user is not registered to this application', () => {
      const user = { 
        registrations: [
          {
            applicationId: 'other'
          }
        ]
       }

       expect(resolvers.User.registered(user, null, { applicationId: 'this' })).toEqual(false)
    })
  })
})

describe('Query', () => {
  describe('me', () => {
    it('looks up the user in the Fusion API', async () => {
      const henk = { name: 'henk' }
      const getUser = jest.fn(userId => Promise.resolve(henk) )
      const user = { sub: 'henk' }
      const dataSources = { 
        fusionAPI: { 
            getUser
        }
      }

      expect(await resolvers.Query.me(null, null, { dataSources, user })).toBe(henk)
      expect(getUser).toHaveBeenCalledWith('henk')
    })
  })
})

describe('Mutation', () => {
  describe('updateRoleMembers', () => {
    it('updates user registrations with the Fusion API', async () => {
      const users = {
        user1: { // should end up with ROLE1 and ROLE2
          id: 'user1',
          name: 'user1',
          registrations: [
            {
              applicationId: 'this',
              roles: ['ROLE2']
            },
            {
              applicationId: 'other',
              roles: []
            }
          ]
        },
        user2: { // should be unchanged
          id: 'user2',
          name: 'user2',
          registrations: [
            {
              applicationId: 'this',
              roles: ['ROLE2']
            }
          ]
        },
        user3: { // should end up with ROLE2
          id: 'user3',
          name: 'user3',
          registrations: [
            {
              applicationId: 'this',
              roles: ['ROLE1', 'ROLE2']
            }
          ]
        }
      }
      const searchUsers = jest.fn(appId => { return { users: [users.user1, users.user2, users.user3] }})
      const updateRegistration = jest.fn((userId, applicationId, updatedRoles) => {})
      const getUser = jest.fn(userId => Promise.resolve(users[userId]) )

      const dataSources = { 
        fusionAPI: { 
            searchUsers,
            updateRegistration,
            getUser
        }
      }
      
      expect(await resolvers.Mutation.updateRoleMembers(
        null, 
        { roleName: 'ROLE1', userIds: ['user1'] }, 
        { dataSources: dataSources, applicationId: 'this' } )
      ).toEqual([users.user1, users.user3])

      expect(searchUsers).toHaveBeenCalledWith('registrations.applicationId:this')
      expect(updateRegistration).toHaveBeenCalledTimes(2)
      expect(updateRegistration).toHaveBeenNthCalledWith(1, 'user1', 'this', ['ROLE2', 'ROLE1'])
      expect(updateRegistration).toHaveBeenNthCalledWith(2, 'user3', 'this', ['ROLE2'])
    })
  })
})