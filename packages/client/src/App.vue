<template>
  <div id="app">
    <application></application>
    <h1>Find users</h1>
    <input type="text" v-model.lazy="searchQuery"/>
    <table v-if="users">
      <caption>Users</caption>
      <thead>
        <th id="email">Email</th>
        <th id="name">Name</th>
        <th id="roles">Roles</th>
        <th id="register"></th>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{user.email}}</td>
          <td>{{user.name || getNameFromParts(user)}}</td>
          <td>{{user.roles.join(",") || "-"}}</td>
          <td v-if="!user.registered"><button @click="register(user.id)">Register</button></td>
        </tr>
      </tbody>
    </table>
    <h1>Registered users</h1>
    <table v-if="registeredUsers">
      <caption>Users</caption>
      <thead>
        <th id="email">Email</th>
        <th id="name">Name</th>
        <th id="roles">Roles</th>
        <th id="register"></th>
      </thead>
      <tbody>
        <tr v-for="user in registeredUsers" :key="user.id">
          <td>{{user.email}}</td>
          <td>{{user.name || getNameFromParts(user)}}</td>
          <td>{{user.roles.join(",") || "-"}}</td>
          <td><button @click="unregister(user.id)">x</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Application from './components/Application'

export default {
  name: 'app',
  components: {
    Application
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
