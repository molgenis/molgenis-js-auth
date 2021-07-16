<template>
  <b-modal
    id="modal-edit-members"
    centered
    lazy
    :title="'Edit members of ' + role"
    @ok="confirmOk"
    @show="reset"
  >
    <b-overlay :show="$apollo.loading" no-fade>
      <b-form-checkbox-group
        v-if="registeredUsers"
        stacked
        name="member-selection"
        :options="registeredUsers"
        value-field="email"
        text-field="email"
        v-model="selection"
      />
    </b-overlay>
  </b-modal>
</template>

<script>
import { REGISTERED_USERS_QUERY } from '@{{ site.baseurl }}/assets/images/queries.js'

export default {
  data () {
    return {
      selection: this.initialSelection
    }
  },
  props: {
    isSuperRole: Boolean,
    role: String,
    initialSelection: Array
  },
  methods: {
    reset: function () {
      this.selection = this.initialSelection
    },
    confirmOk: function () {
      if (this.selectionChanged) {
        if (this.isSuperRole && this.isPromotedToSuperUser) {
          this.$bvModal.msgBoxConfirm('You are promoting one or more users to super user. Are you sure?', {
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
    selectionChanged () {
      return this.selection !== this.initialSelection
    },
    isPromotedToSuperUser () {
      return this.registeredUsers.some(user => !this.initialSelection.includes(user.email) && this.selection.includes(user.email))
    }
  },
  apollo: {
    registeredUsers: REGISTERED_USERS_QUERY
  }
}
</script>
