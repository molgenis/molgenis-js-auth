<template>
  <b-modal
    id="modal-register-user"
    centered
    lazy
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
        debounce="500"
        placeholder="Search users..."
      ></b-form-input>
    </b-input-group>
    <b-table ref="table"
      hover
      :items="rows"
      :fields="tableFields"
      selectable
      select-mode="single"
      @row-selected="selectRow"
    >
    <template #cell(registered)="data" >
      <span v-if="!data.item.registered" class="center">
        <b-icon-x font-scale="1.5"/>
      </span>
      <span v-if="data.item.registered" class="center">
        <b-icon-check font-scale="1.5"/>
      </span>
    </template>
    </b-table>
  </b-modal>
</template>

<style>
  .table-hover .table-row-disabled:hover {
    cursor: not-allowed !important;
    background: #ffffff;
    color: #808080;
  }
  .table .table-row-disabled {
    color: #808080;
  }
</style>

<script>
import gql from 'graphql-tag'
import { BIconCheck, BIconX } from 'bootstrap-vue'

export default {
  data () {
    return {
      searchQuery: '',
      tableFields: [
        'email',
        'firstName',
        'lastName',
        'registered'
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
      }
    }
  },
  components: {
    BIconCheck,
    BIconX
  }
}
</script>
