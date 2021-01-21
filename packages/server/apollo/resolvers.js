module.exports = {
  Query: {
    me: async (_source, _args, { dataSources, user }) => 
      user && dataSources.fusionAPI.getUser(user.sub),
    application: async (_source, _args, { dataSources, applicationId }) => 
      dataSources.fusionAPI.getApplication(applicationId),
    registeredUsers: async (_source, _args, { dataSources, applicationId }) => {
      const response = await dataSources.fusionAPI.searchUsers(`registrations.applicationId:${applicationId}`)
      return response.users
    },
    users: async (_source, {searchQuery}, { dataSources }) => {
      const response = await dataSources.fusionAPI.searchUsers(searchQuery)
      return response.users
    },
    roles: async (_source, _args, { dataSources, applicationId }) => {
      const response = await dataSources.fusionAPI.getApplication(applicationId)
      return response.roles
    },
  },
  User: {
    roles: (user, _args, {applicationId}) => {
      return (user.registrations||[])
        .filter((reg)=>reg.applicationId === applicationId)
        .flatMap(reg => reg.roles)
        .filter(role => role != null)
    },
    registered: (user, _args, {applicationId}) => {
      return (user.registrations||[])
        .some((reg) => reg.applicationId === applicationId)
    }
  },
  Mutation: {
    register: async (_source, {userId}, {dataSources, applicationId}) => {
      await(dataSources.fusionAPI.register(userId, applicationId))
      return dataSources.fusionAPI.getUser(userId)
    },
    unregister: async(_source, {userId}, {dataSources, applicationId}) => {
      await(dataSources.fusionAPI.unregister(userId, applicationId))
      return dataSources.fusionAPI.getUser(userId)
    },
    updateUserRoles: async(_source, {userId, roles}, {dataSources, applicationId}) => {
      await(dataSources.fusionAPI.updateRegistration(userId, applicationId, roles))
      return dataSources.fusionAPI.getUser(userId)
    },
    createRole: async(_source, {name, isSuperRole}, {dataSources, applicationId}) => {
      return await(dataSources.fusionAPI.createRole(name, isSuperRole || false, applicationId))
    },
    deleteRole: async(_source, {roleId}, {dataSources, applicationId}) => {
      return await(dataSources.fusionAPI.deleteRole(roleId, applicationId))
    },
    updateRoleMembers: async(_source, {roleName, userIds}, {dataSources, applicationId}) => {
      const response = await dataSources.fusionAPI.searchUsers(`registrations.applicationId:${applicationId}`)
      const registeredUsers = response.users
      const result = []
      for (const user of registeredUsers) {
        const registration = user.registrations.find((reg)=>reg.applicationId === applicationId)
        const roles = registration.roles || []
        let updatedRoles = undefined
        if (!roles.includes(roleName) && userIds.includes(user.id)) {
          updatedRoles = [...roles, roleName]
        }
        if (roles.includes(roleName) && !userIds.includes(user.id)) {
          updatedRoles = roles.filter(it => it !== roleName)
        }
        if (updatedRoles !== undefined) {
          await dataSources.fusionAPI.updateRegistration(user.id, applicationId, updatedRoles)
          result.push(await dataSources.fusionAPI.getUser(user.id))
        }
      }
      return result
    },
  }
}