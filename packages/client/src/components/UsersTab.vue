<template>
  <div>
    <b-overlay :show="$apollo.loading" no-fade>
      <b-table
        hover
        selectable
        select-mode="single"
        :items="registeredUsers"
        @row-selected="selectRow"
        :fields="tableFields"
        show-empty
        empty-text="No users found..."
      >
        <template v-if="roles" #cell(roles)="data">
          <span v-for="role in data.item.roles" :key="role" class="badges mr-1">
            <b-tag
              v-if="isSuperRole(role)"
              variant="warning"
              @remove="removeRole(data.item, role)"
            >
              {{ role }}
            </b-tag>
            <b-tag v-else variant="light" @remove="removeRole(data.item, role)">
              {{ role }}
            </b-tag>
          </span>
        </template>
      </b-table>

      <b-button-group>
        <b-button
          :disabled="!selectedRow"
          @click="confirmUnregisterUser"
          variant="primary"
        >
          <b-icon-person-dash-fill /> Unregister User
        </b-button>
        <b-button
          :disabled="!selectedRow"
          v-b-modal.modal-edit-roles
          variant="primary"
        >
          <b-icon-person-lines-fill /> Edit Roles
        </b-button>
      </b-button-group>

      <b-button class="ml-3" v-b-modal.modal-register-user variant="primary">
        <b-icon-person-plus-fill /> Register User
      </b-button>
    </b-overlay>

    <role-selection-modal
      v-if="selectedRow"
      :email="selectedRow.email"
      :initial-selection="selectedRow.roles"
      @ok="editRoles"
    />
    <register-user-modal @ok="registerUser" />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import RoleSelectionModal from '@/components/modals/RoleSelectionModal'
import RegisterUserModal from '@/components/modals/RegisterUserModal.vue'
import { REGISTERED_USERS_QUERY, ROLES_QUERY } from '@/assets/queries.js'

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
          },
          thClass: 'fixedWidth'
        }
      ]
    }
  },
  methods: {
    selectRow (row) {
      this.selectedRow = row[0]
    },
    isSuperRole (roleName) {
      const role = this.roles.find(role => role.name === roleName)
      return role && role.isSuperRole
    },
    removeRole (user, roleName) {
      this.updateUserRoles(
        user.id,
        user.roles.filter(role => role !== roleName)
      )
    },
    editRoles (roles) {
      this.updateUserRoles(this.selectedRow.id, roles)
    },
    async updateUserRoles (userId, roles) {
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
          userId,
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
    registeredUsers: REGISTERED_USERS_QUERY,
    roles: ROLES_QUERY
  }
}
</script>

<style scoped>
.fixedWidth{
  color: red
}
</style>
