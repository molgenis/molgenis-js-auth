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
      <b-button
        :disabled="!selectedRow"
        @click="confirmUnregisterUser"
        variant="primary"
        ><b-icon-person-dash-fill /> Unregister User</b-button
      >
      <b-button
        :disabled="!selectedRow"
        v-b-modal.modal-edit-roles
        variant="primary"
        ><b-icon-person-lines-fill /> Edit Roles</b-button
      >
    </b-button-group>
    <b-button class="ml-3" v-b-modal.modal-register-user variant="primary"
      ><b-icon-person-plus-fill /> Register User</b-button
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

const REGISTERED_USERS_QUERY = gql`
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
    selectedEmail () {
      return this.selectedRow && this.selectedRow.email
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
    confirmUnregisterUser () {
      const userId = this.selectedRow.id
      this.$bvModal.msgBoxConfirm('Are you sure you want to unregister ' + this.selectedRow.email + '?', {
        centered: true,
        okVariant: 'danger'
      })
        .then((ok) => {
          if (ok) {
            this.unregisterUser(userId)
          }
        })
    },
    async registerUser (userId) {
      await this.$apollo.mutate({
        mutation: gql`mutation ($userId: String!) {
          register(userId: $userId) {
            id
            email
            firstName
            lastName
            roles
          }
        }`,
        variables: {
          userId
        },
        update: (store, { data: { register } }) => {
          const users = store.readQuery({ query: REGISTERED_USERS_QUERY }).registeredUsers
          store.writeQuery({ query: REGISTERED_USERS_QUERY, data: { registeredUsers: [...users, register] } })
        }
      })
    },
    async unregisterUser (userId) {
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
        },
        update: (store) => {
          const users = store.readQuery({ query: REGISTERED_USERS_QUERY }).registeredUsers
          store.writeQuery({
            query: REGISTERED_USERS_QUERY,
            data: { registeredUsers: users.filter(it => it.id !== userId) }
          })
        }
      })
    }
  },
  apollo: {
    registeredUsers: REGISTERED_USERS_QUERY
  }
}
</script>
