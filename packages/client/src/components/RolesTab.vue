<template>
  <div>
    <b-overlay :show="$apollo.loading" no-fade>
      <b-table
        hover
        selectable
        select-mode="single"
        :items="rolesWithMembers"
        :fields="tableFields"
        @row-selected="selectRow"
        show-empty
        empty-text="No roles found..."
      >
        <template #cell(members)="data">
          <span
            v-for="member in data.item.members"
            :key="member.id"
            class="badges mr-1 mb-1"
          >
            <b-tag variant="light" @remove="removeMember(data.item, member.id)">
              {{ member.firstName }} {{ member.lastName }} ({{ member.email }})
            </b-tag>
          </span>
        </template>
      </b-table>

      <b-button-group>
        <b-button
          :disabled="!selectedRow || superUserRoleSelected"
          @click="confirmDeleteRole"
          variant="primary"
        >
          <b-icon-journal-minus /> Delete Role
        </b-button>
        <b-button
          :disabled="!selectedRow"
          variant="primary"
          v-b-modal.modal-edit-members
        >
          <b-icon-journal-text /> Edit Members
        </b-button>
      </b-button-group>

      <b-button class="ml-3" variant="primary" v-b-modal.modal-create-role>
        <b-icon-journal-plus /> Create New Role
      </b-button>
    </b-overlay>

    <create-role-modal @ok="createRole" />
    <member-selection-modal
      v-if="selectedRow"
      :role="selectedRow.name"
      :initial-selection="selectedRow.members.map((member) => member.email)"
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
    removeMember (role, memberId) {
      this.updateRoleMembers(
        role.name,
        role.members.filter(member => member.id !== memberId).map(member => member.id)
      )
    },
    editMembers (memberEmails) {
      this.updateRoleMembers(
        this.selectedRow.name,
        memberEmails.map(email => this.registeredUsers.find(user => user.email === email).id)
      )
    },
    async updateRoleMembers (roleName, userIds) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($roleName: String!, $userIds: [String]!) {
            updateRoleMembers(roleName: $roleName, userIds: $userIds) {
              id
              roles
            }
          }
        `,
        variables: {
          roleName,
          userIds
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
