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
    <b-table
      hover
      :items="rows"
      :fields="tableFields"
      selectable
      select-mode="single"
      @row-selected="selectRow"
    ></b-table>
  </b-modal>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data () {
    return {
      searchQuery: '',
      tableFields: [
        'email',
        'firstName',
        'lastName'
      ],
      selectedUserId: null
    }
  },
  computed: {
    rows () {
      if (this.searchQuery === '') {
        return null
      } else {
        return this.users
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
      this.selectedUserId = rows[0]['id']
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
  }
}
</script>
