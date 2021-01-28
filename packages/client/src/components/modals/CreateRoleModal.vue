<template>
  <b-modal
    id="modal-create-role"
    centered
    lazy
    title="Create role"
    @ok="onOk"
    @shown="reset"
    :ok-disabled="!roleName"
  >
    <b-form-input
      ref="roleField"
      type="text"
      v-model="roleName"
      placeholder="Enter a role name..."
    ></b-form-input>
  </b-modal>
</template>

<script>
export default {
  data () {
    return {
      roleName: ''
    }
  },
  methods: {
    reset: function () {
      this.roleName = ''
      this.$refs.roleField.focus()
    },
    onOk: function () {
      this.$emit('ok', this.roleName)
    }
  },
  computed: {
    selectionChanged () {
      return this.selection !== this.initialSelection
    }
  }
}
</script>
