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
    <b-button class="ml-3" variant="primary"
      ><b-icon-journal-plus /> Create New Role</b-button
    >
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
    deleteRole (roleId) {
      console.log("deleting role " + roleId)
    }
  },
  computed: {
    superUserRoleSelected () {
      return this.selectedRow && this.selectedRow.name === 'SU'
    }
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
