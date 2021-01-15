<template>
  <div>
    <b-table
      hover
      selectable
      select-mode="single"
      :items="rolesWithMembers"
      :fields="tableFields"
      @row-selected="selectRow"
    >
      <template #cell(members)="data">
        <span
          v-for="member in data.item.members"
          :key="member.id"
          class="badges mr-1"
        >
          <b-badge variant="light">
            {{ member.firstName }} {{ member.lastName }} ({{ member.email }})
          </b-badge>
        </span>
      </template>
    </b-table>
    <b-button-group>
      <b-button
        :disabled="!selectedRow || superUserRoleSelected"
        @click="confirmDeleteRole"
        variant="primary"
        ><b-icon-journal-minus /> Delete Role</b-button
      >
      <b-button
        :disabled="!selectedRow"
        variant="primary"
        v-b-modal.modal-edit-members
        ><b-icon-journal-text /> Edit Members</b-button
      >
    </b-button-group>
    <b-button class="ml-3" variant="primary" v-b-modal.modal-create-role
      ><b-icon-journal-plus /> Create New Role</b-button
    >
    <create-role-modal @ok="createRole" />
    <member-selection-modal
      v-if="selectedRow"
      :role="selectedRow.name"
      :initial-selection="selectedRow.members.map(member => member.email)"
      @ok="editMembers"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import CreateRoleModal from '@/components/modals/CreateRoleModal.vue'
import MemberSelectionModal from '@/components/modals/MemberSelectionModal.vue'
import { ROLES_QUERY, REGISTERED_USERS_QUERY } from '@/assets/queries.js'

export default {
  components: {
    CreateRoleModal,
    MemberSelectionModal
  },
  data () {
    return {
      selectedRow: null,
      tableFields: [
        'name',
        'members'
      ]
    }
  },
  methods: {
    selectRow: function (row) {
      this.selectedRow = row[0]
    },
    confirmDeleteRole () {
      this.$bvModal.msgBoxConfirm('Are you sure you want to delete role ' + this.selectedRow.name + '?', {
        centered: true,
        okVariant: 'danger'
      })
        .then((ok) => {
          if (ok) {
            this.deleteRole()
          }
        })
    },
    async deleteRole () {
      const roleId = this.selectedRow.id
      const roleName = this.selectedRow.name

      await this.$apollo.mutate({
        mutation: gql`
          mutation($roleId: String!) {
            deleteRole(roleId: $roleId)
          }
        `,
        variables: {
          roleId
        },
        update: (store) => {
          const roles = store.readQuery({ query: ROLES_QUERY }).roles
          store.writeQuery({
            query: ROLES_QUERY,
            data: {
              roles: roles.filter(it => it.id !== roleId)
            }
          })
          const users = store.readQuery({ query: REGISTERED_USERS_QUERY }).registeredUsers
          store.writeQuery({
            query: REGISTERED_USERS_QUERY,
            data: {
              registeredUsers: users.map(user => (
                { ...user, roles: user.roles.filter(it => it !== roleName) }
              ))
            }
          })
        }
      })
    },
    async createRole (roleName) {
      await this.$apollo.mutate({
        mutation: gql`mutation ($roleName: String!) {
          createRole(name: $roleName) {
            id
            name
            isSuperRole
          }
        }`,
        variables: {
          roleName
        },
        update: (store, { data: { createRole } }) => {
          const roles = store.readQuery({ query: ROLES_QUERY }).roles
          store.writeQuery({ query: ROLES_QUERY, data: { roles: [...roles, createRole] } })
        }
      })
    },
    async editMembers (memberEmails) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($roleName: String!, $userIds: [String]!) {
            updateRoleMembers(roleName: $roleName, userIds: $userIds) {
              id
              firstName
              lastName
              email
              roles
            }
          }
        `,
        variables: {
          roleName: this.selectedRow.name,
          userIds: memberEmails.map(email => this.registeredUsers.find(user => user.email === email).id)
        }
      })
    }
  },
  computed: {
    superUserRoleSelected () {
      return this.selectedRow && this.selectedRow.isSuperRole
    },
    rolesWithMembers () {
      const roles = this.roles && this.roles.map(role => (
        { ...role,
          members: this.registeredUsers && this.registeredUsers.filter(user => user.roles.includes(role.name))
        }
      ))
      return roles || []
    }
  },
  apollo: {
    roles: ROLES_QUERY,
    registeredUsers: REGISTERED_USERS_QUERY
  }
}
</script>
