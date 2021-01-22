const { rule, shield, deny, allow } = require('graphql-shield')

const isSu = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return ctx.user && ctx.user.roles && ctx.user.roles.includes('SU')
  }
)

module.exports = shield(
  {
    Query: {
      "me": allow,
      "application": allow,
      "*": isSu
    },
    Mutation: {
      "*": isSu
    }
  },
  { 
    allowExternalErrors: true 
  }
)
