<template>
  <div>
    <div id="app" class="container mt-1">
      <b-navbar type="dark" variant="dark" class="mb-5">
        <b-navbar-brand v-if="application">
          {{ application.name }}
        </b-navbar-brand>
        <b-nav-text>Permissions</b-nav-text>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-text v-if="me" class="mr-4">
              <b-icon-person-fill /> {{ me.email }}
            </b-nav-text>
            <b-button v-if="me" variant="primary" href="/logout">
              Log out
            </b-button>
            <b-button v-else variant="primary" href="/login"> Log in </b-button>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <div v-if="me">
        <div v-if="me.roles.includes('SU')">
          <message-container />
          <b-tabs content-class="mt-3">
            <b-tab active class="pt-2">
              <template v-slot:title> <b-icon-people-fill /> Users </template>
              <users-tab />
            </b-tab>
            <b-tab title="Roles" class="pt-2">
              <template v-slot:title> <b-icon-journals /> Roles </template>
              <roles-tab />
            </b-tab>
          </b-tabs>
        </div>
        <b-alert v-else show variant="danger">
          You have insufficient permissions to view this content.
        </b-alert>
      </div>
    </div>
  </div>
</template>

<script>
import UsersTab from './components/UsersTab'
import RolesTab from './components/RolesTab.vue'
import MessageContainer from './components/MessageContainer.vue'
import gql from 'graphql-tag'

export default {
  name: 'app',
  components: {
    UsersTab,
    RolesTab,
    MessageContainer
  },
  apollo: {
    application: gql`query {
      application {
        name
      }
    }`,
    me: gql`{
      me {
        email
        roles
      }
    }`
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.badges {
  font-size: 20px;
}
</style>
