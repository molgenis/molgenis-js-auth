<template>
  <b-modal
    id="modal-edit-members"
    centered
    lazy
    :title="'Edit members of ' + role"
    @ok="onOk"
    @show="reset"
  >
    <b-form-checkbox-group
      v-if="registeredUsers"
      stacked
      name="member-selection"
      :options="registeredUsers"
      value-field="email"
      text-field="email"
      v-model="selection"
    />
  </b-modal>
</template>

<script>
import { REGISTERED_USERS_QUERY } from '@/assets/queries.js'

export default {
  data () {
    return {
      selection: this.initialSelection
    }
  },
  props: {
    role: String,
    initialSelection: Array
  },
  methods: {
    reset: function () {
      this.selection = this.initialSelection
    },
    onOk: function () {
      if (this.selectionChanged) {
        this.$emit('ok', this.selection.filter(Boolean))
      }
    }
  },
  computed: {
    selectionChanged () {
      return this.selection !== this.initialSelection
    }
  },
  apollo: {
    registeredUsers: REGISTERED_USERS_QUERY
  }
}
</script>
