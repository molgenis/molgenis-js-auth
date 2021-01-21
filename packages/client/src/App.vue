<template>
  <div>
    <div id="app" class="container mt-1">
      <b-navbar type="dark" variant="dark" class="mb-4">
        <b-navbar-brand v-if="application">
          {{ application.name }}
        </b-navbar-brand>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-text v-if="username" class="mr-4">
              <b-icon-person-fill /> {{ me && me.email }}
            </b-nav-text>
            <b-button
              size="m"
              variant="primary"
              href="/logout"
            >
              Log out
            </b-button>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
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
  data () {
    return {
      username: ''
    }
  },
  created () {
    // TODO fetch username from /user endpoint
    this.username = 'Bofke'
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

.container {
  margin-top: 0px;
}
</style>
