<template>
  <div>
    <b-table hover selectable select-mode="single" :items="registeredUsers" @row-selected="selectRow" :fields="tableFields"></b-table>
    <b-button-group>
      <b-button :disabled="!selectedRow" @click="deleteRow">Unregister User</b-button>
      <b-button :disabled="!selectedRow" v-b-modal.modal-edit-roles>Edit Roles</b-button>
    </b-button-group>
    <b-button class="ml-3" @click="unregisterUser(selectedRow.id)">Register New User</b-button>

    <role-selection-modal  v-if="selectedRow" :title="roleEditTitle" :initial-selection="selectedRow.roles" @ok="editRoles"/>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import RoleSelectionModal from './RoleSelectionModal'

export default {
  components: {
    RoleSelectionModal
  },
  data () {
    return {
      selectedRow: null,
      tableFields: ['email', 'firstName', 'lastName', 'roles']
    }
  },
  computed: {
    roleEditTitle: function () {
      return this.selectedRow && `Edit Roles of ${this.selectedRow.firstName} ${this.selectedRow.lastName}`
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
    async editRoles (roles) {
      console.log("edit Roles")
      await this.$apollo.mutate({
        mutation: gql`mutation ($userId: String!, $roles: [String]!) {
          updateUserRoles(userId: $userId, roles: $roles){
            id
            roles
          }
        }`,
        variables: {
          userId: this.selectedRow.id,
          roles
        }
      })
    },
    registerUser: function () {},
    async unregisterUser (userId) {
      await this.$apollo.mutate({
        mutation: gql`mutation ($userId: String!) {
          unregister(userId: $userId) {
            id
          }
        }`,
        variables: {
          userId
        }
      })
    }
  },
  apollo: {
    registeredUsers: gql`query {
      registeredUsers {
        id
        email
        firstName
        lastName
        roles
      }
    }`
  }
}
</script>
