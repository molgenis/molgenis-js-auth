<template>
  <b-overlay :show="$apollo.loading" no-fade>
    <h1 v-if="application">{{application.name}}</h1>
  </b-overlay>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    application: gql`query {
      application {
        name
      }
    }`
  }
}
</script>
