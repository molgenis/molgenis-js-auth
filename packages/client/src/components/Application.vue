<template>
  <div class="application" v-if="application">
    <h1>{{ application.name }}</h1>
    <code>{{ application.id }}</code>
    <h2>Roles</h2>
    <ul>
      <li v-for="role in application.roles" :key="role.id">
        <span :class="{super: role.isSuperRole, default: role.isDefault}">{{role.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    application: gql`query {
      application {
        id
        name
        roles {
          id
          name
          isSuperRole
          isDefault
        }
      }
    }`
  }
}
</script>
<style scoped>
  span.default {
    font-style: italic;
  }
  span.super {
    font-weight: bold;
  }
</style>
