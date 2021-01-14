<template>
  <b-modal
    id="modal-edit-roles"
    centered
    lazy
    :title="'Edit roles of ' + email"
    @ok="onOk"
    @show="reset"
  >
    <b-form-checkbox-group
      v-if="application"
      stacked
      name="role-selection"
      :options="application.roles"
      value-field="name"
      text-field="name"
      v-model="selection"
    />
  </b-modal>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data () {
    return {
      selection: this.initialSelection
    }
  },
  props: {
    email: String,
    initialSelection: Array
  },
  methods: {
    reset: function () {
      this.selection = this.initialSelection
    },
    isPromotedToSuperUser () {
      return this.superRoleNames.some(name => !this.initialSelection.includes(name) && this.selection.includes(name))
    },
    onOk: function () {
      if (this.selectionChanged) {
        if (this.isPromotedToSuperUser()) {
          this.$bvModal.msgBoxConfirm('Are you sure you want to make ' + this.email + ' a super user?', {
            centered: true,
            okVariant: 'danger'
          })
            .then((ok) => {
              if (ok) {
                this.emitOk()
              }
            })
        } else {
          this.emitOk()
        }
      }
    },
    emitOk () {
      if (this.selectionChanged) {
        this.$emit('ok', this.selection.filter(Boolean))
      }
    },
    selectionChanged () {
      return this.selection !== this.initialSelection
    }
  },
  computed: {
    superRoleNames () {
      return this.application.roles.map(role => {
        if (role.isSuperRole) {
          return role.name
        }
      }).filter(Boolean)
    }
  },
  apollo: {
    application: gql`query {
      application {
        roles {
          name
          isSuperRole
        }
      }
    }`
  }
}
</script>
