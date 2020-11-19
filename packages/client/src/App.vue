<template>
  <div id="app" class="container">
    <application-title class="mb-4" />
    <b-tabs content-class="mt-3">
      <b-tab title="Users" active>
        <users-tab/>
      </b-tab>
      <b-tab title="Roles">
        <roles-tab/>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import UsersTab from './components/UsersTab'
import ApplicationTitle from './components/ApplicationTitle.vue'
import RolesTab from './components/RolesTab.vue'

export default {
  name: 'app',
  components: {
    ApplicationTitle,
    UsersTab,
    RolesTab
  },
  methods: {
    getNameFromParts (user) {
      return [user.firstName, user.lastName].filter(it => !!it).join(' ')
    },
    async register (userId) {
      await this.$apollo.mutate({
        mutation: gql`mutation ($userId: String!) {
          register(userId: $userId) {
            id
            roles
            registered
          }
        }`,
        variables: {
          userId
        }
      })
    },
    async unregister (userId) {
      await this.$apollo.mutate({
        mutation: gql`mutation ($userId: String!) {
          unregister(userId: $userId) {
            id
            roles
            registered
          }
        }`,
        variables: {
          userId
        }
      })
    }
  },
  data () {
    return {
      searchQuery: 'Fleur'
    }
  },
  apollo: {
    users: {
      query: gql`query SearchUsers($searchQuery: String!) {
        users(searchQuery: $searchQuery){
          id
          email
          name
          firstName
          lastName
          registered
          roles
        }
      }`,
      variables () {
        return {
          searchQuery: this.searchQuery
        }
      }
    },
    registeredUsers: gql`query {
      registeredUsers {
        id
        email
        name
        firstName
        lastName
        registered
        roles
      }
    }`
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
