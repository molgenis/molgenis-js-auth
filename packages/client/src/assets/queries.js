import gql from 'graphql-tag'

export const REGISTERED_USERS_QUERY = gql`
      query {
        registeredUsers {
          id
          email
          firstName
          lastName
          roles
        }
      }
    `

export const ROLES_QUERY = gql`query {
    roles {
      id
      name
      isSuperRole
    }
  }`
