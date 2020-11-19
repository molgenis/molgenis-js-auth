<template>
    <h1 v-if="application">{{application.name}}</h1>
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
