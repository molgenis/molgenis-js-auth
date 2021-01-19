<template>
  <b-modal
    id="modal-edit-roles"
    centered
    lazy
    :title="'Edit roles of ' + email"
    @ok="onOk"
    @show="reset"
  >
    <b-overlay :show="$apollo.loading" no-fade>
      <b-form-checkbox-group
        v-if="roles"
        stacked
        name="role-selection"
        :options="roles"
        value-field="name"
        text-field="name"
        v-model="selection"
      />
    </b-overlay>
  </b-modal>
</template>

<script>
import { ROLES_QUERY } from '@/assets/queries.js'

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
    onOk: function () {
      if (this.selectionChanged) {
        if (this.isPromotedToSuperUser) {
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
      this.$emit('ok', this.selection)
    }
  },
  computed: {
    superRoleNames () {
      return this.roles.map(role => {
        if (role.isSuperRole) {
          return role.name
        }
      })
    },
    selectionChanged () {
      return this.selection !== this.initialSelection
    },
    isPromotedToSuperUser () {
      return this.superRoleNames.some(name => !this.initialSelection.includes(name) && this.selection.includes(name))
    }
  },
  apollo: {
    roles: ROLES_QUERY
  }
}
</script>
