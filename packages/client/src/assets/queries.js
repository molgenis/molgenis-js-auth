import gql from 'graphql-tag'

export const REGISTERED_USERS_QUERY = gql`
      query RegisteredUsers {
        registeredUsers {
          id
          email
          firstName
          lastName
          roles
        }
      }
    `

export const ROLES_QUERY = gql`query Roles {
    roles {
      id
      name
      isSuperRole
    }
  }`
