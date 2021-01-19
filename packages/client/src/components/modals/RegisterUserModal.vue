<template>
  <b-modal
    id="modal-register-user"
    centered
    lazy
    scrollable
    size="lg"
    title="Register User"
    @ok="onOk"
    @show="reset"
    :ok-disabled="!selectedUserId"
  >
    <b-input-group>
      <b-input-group-prepend is-text>
        <b-icon-search />
      </b-input-group-prepend>
      <b-form-input
        type="search"
        v-model="searchQuery"
        placeholder="Search users..."
      ></b-form-input>
    </b-input-group>
    <b-table
      ref="table"
      v-if="searchQuery"
      hover
      :items="rows"
      :fields="tableFields"
      selectable
      select-mode="single"
      @row-selected="selectRow"
    >
      <template #cell(registered)="data">
        <span v-if="!data.item.registered">
          <b-icon-x font-scale="1.8" />
        </span>
        <span v-if="data.item.registered">
          <b-icon-check font-scale="1.8" />
        </span>
      </template>
    </b-table>
  </b-modal>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data () {
    return {
      searchQuery: '',
      tableFields: [
        { key: 'email' },
        { key: 'firstName' },
        { key: 'lastName' },
        { key: 'registered', tdClass: 'personRegistered' }
      ],
      selectedUserId: null
    }
  },
  computed: {
    rows () {
      if (this.searchQuery === '') {
        return null
      } else {
        var users = []
        if (this.users && this.users.length > 0) {
          users = Object.assign([], this.users)
          users.forEach((user) => {
            if (user.registered) {
              user = this.setRowVariant(user)
            }
          })
        }
        return users
      }
    }
  },
  methods: {
    reset () {
      this.searchQuery = ''
      this.selectedUserId = null
      this.users = null
    },
    onOk () {
      this.$emit('ok', this.selectedUserId)
    },
    selectRow (rows) {
      var selected = []
      rows.forEach((user, index) => {
        if (user.registered) {
          this.$refs.table.unselectRow(index)
        } else {
          selected.push(user)
        }
      })
      if (selected.length > 0) {
        this.selectedUserId = selected[0]['id']
      }
    },
    setRowVariant (item) {
      return (item._rowVariant = 'row-disabled')
    }
  },
  apollo: {
    users: {
      query: gql`
        query SearchUsers($searchQuery: String!) {
          users(searchQuery: $searchQuery) {
            id
            email
            firstName
            lastName
            registered
          }
        }
      `,
      variables () {
        return {
          searchQuery: this.searchQuery
        }
      },
      skip () {
        return !this.searchQuery
      },
      debounce: 500
    }
  }
}
</script>

<style>
.table-hover .table-row-disabled:hover {
  cursor: not-allowed !important;
  background: #ffffff;
  color: #b0b0b0;
}
.table .table-row-disabled {
  color: #b0b0b0;
}
.personRegistered {
  vertical-align: center;
  text-align: center;
}
</style>
