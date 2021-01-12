<template>
  <div>
    <b-table
      hover
      selectable
      select-mode="single"
      :items="roles"
      :fields="tableFields"
      @row-selected="selectRow"
    ></b-table>
    <b-button-group>
      <b-button :disabled="!selectedRow" @click="deleteRow"
        >Delete Role</b-button
      >
      <b-button :disabled="!selectedRow" @click="editRoles"
        >Edit Members</b-button
      >
    </b-button-group>
    <b-button class="ml-3">Create New Role</b-button>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data () {
    return {
      selectedRow: null,
      tableFields: [
        'name',
        'description'
      ]
    }
  },
  methods: {
    selectRow: function (row) {
      this.selectedRow = row[0]
    },
    deleteRow: function () {
      const start = this.items.indexOf(this.selectedRow)
      this.items.splice(start, 1)
    },
    editRoles: function () {},
    registerUser: function () {}
  },
  apollo: {
    roles: gql`query {
      roles {
        id
        name
        description
      }
    }`
  }
}
</script>
