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
      <b-button
        :disabled="!selectedRow || superUserRoleSelected"
        @click="confirmDeleteRole"
        variant="primary"
        ><b-icon-journal-minus /> Delete Role</b-button
      >
      <b-button :disabled="!selectedRow" variant="primary"
        ><b-icon-journal-text /> Edit Members</b-button
      >
    </b-button-group>
    <b-button class="ml-3" variant="primary" v-b-modal.modal-create-role
      ><b-icon-journal-plus /> Create New Role</b-button
    >

    <create-role-modal @ok="createRole"/>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import CreateRoleModal from './CreateRoleModal.vue'

const ROLES_QUERY = gql`query {
      roles {
        id
        name
        isSuperRole
      }
    }`

export default {
  components: { CreateRoleModal },
  data () {
    return {
      selectedRow: null,
      tableFields: [
        'name'
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
            this.deleteRole(this.selectedRow.id)
          }
        })
    },
    async deleteRole (roleId) {
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
          const users = store.readQuery({ query: ROLES_QUERY }).roles
          store.writeQuery({
            query: ROLES_QUERY,
            data: { roles: users.filter(it => it.id !== roleId) }
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
    }
  },
  computed: {
    superUserRoleSelected () {
      return this.selectedRow && this.selectedRow.isSuperRole
    }
  },
  apollo: {
    roles: ROLES_QUERY
  }
}
</script>
