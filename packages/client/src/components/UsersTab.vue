<template>
  <div>
    <b-table
      hover
      selectable
      select-mode="single"
      :items="registeredUsers"
      @row-selected="selectRow"
      :fields="tableFields"
    ></b-table>
    <b-button-group>
      <b-button :disabled="!selectedRow" @click="unregisterUser"
        >Unregister User</b-button
      >
      <b-button :disabled="!selectedRow" v-b-modal.modal-edit-roles
        >Edit Roles</b-button
      >
    </b-button-group>
    <b-button class="ml-3" v-b-modal.modal-register-user
      >Register User</b-button
    >

    <role-selection-modal
      v-if="selectedRow"
      :title="roleEditTitle"
      :initial-selection="selectedRow.roles"
      @ok="editRoles"
    />
    <register-user-modal @ok="registerUser" />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import RoleSelectionModal from './RoleSelectionModal'
import RegisterUserModal from './RegisterUserModal.vue'

export default {
  components: {
    RoleSelectionModal,
    RegisterUserModal
  },
  data () {
    return {
      selectedRow: null,
      tableFields: [
        'email',
        'firstName',
        'lastName',
        {
          key: 'roles',
          formatter: value => {
            return value.join(', ')
          }
        }
      ]
    }
  },
  computed: {
    roleEditTitle () {
      return (
        this.selectedRow &&
        `Edit Roles of ${this.selectedRow.firstName} ${this.selectedRow.lastName}`
      )
    }
  },
  methods: {
    selectRow (row) {
      this.selectedRow = row[0]
    },
    async editRoles (roles) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($userId: String!, $roles: [String]!) {
            updateUserRoles(userId: $userId, roles: $roles) {
              id
              roles
            }
          }
        `,
        variables: {
          userId: this.selectedRow.id,
          roles
        }
      })
    },
    async registerUser (userId) {
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
    async unregisterUser () {
      const userId = this.selectedRow['id']
      await this.$apollo.mutate({
        mutation: gql`
          mutation($userId: String!) {
            unregister(userId: $userId) {
              id
            }
          }
        `,
        variables: {
          userId
        }
      })
    }
  },
  apollo: {
    registeredUsers: gql`
      query {
        registeredUsers {
          id
          email
          firstName
          lastName
          roles
        }
      }
    `
  }
}
</script>
