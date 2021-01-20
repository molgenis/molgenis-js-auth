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
              <b-icon-person-fill /> {{ username }}
            </b-nav-text>
            <b-button
              size="sm"
              variant="primary"
              class="my-2 my-sm-0"
              @click="logout"
            >
              Log out
            </b-button>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <message-container />
      <b-tabs content-class="mt-3">
        <b-tab active>
          <template v-slot:title> <b-icon-people-fill /> Users </template>
          <users-tab />
        </b-tab>
        <b-tab title="Roles">
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
  methods: {
    logout () {
      // TODO user /logout endpoint
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
