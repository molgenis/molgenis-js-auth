<template>
  <div id="app" class="container">
    <application-title class="mb-4" />
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
</template>

<script>
import UsersTab from './components/UsersTab'
import ApplicationTitle from './components/ApplicationTitle.vue'
import RolesTab from './components/RolesTab.vue'
import MessageContainer from './components/MessageContainer.vue'

export default {
  name: 'app',
  components: {
    ApplicationTitle,
    UsersTab,
    RolesTab,
    MessageContainer
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
