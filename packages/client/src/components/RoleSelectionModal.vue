<template>
  <b-modal
    id="modal-edit-roles"
    centered
    lazy
    :title="title"
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
      v-model="selected"
    />
  </b-modal>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data () {
    return {
      selected: this.initialSelection
    }
  },
  props: {
    title: String,
    initialSelection: Array
  },
  methods: {
    reset: function () {
      this.selected = this.initialSelection
    },
    onOk: function () {
      if (this.selection !== this.initialSelection) {
        this.$emit('ok', this.selected.filter(Boolean))
      }
    }
  },
  apollo: {
    application: gql`query {
      application {
        roles {
          name
        }
      }
    }`
  }
}
</script>
