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
    title: String,
    initialSelection: Array
  },
  methods: {
    reset: function () {
      this.selection = this.initialSelection
    },
    onOk: function () {
      if (this.selectionChanged && !this.initialSelection.includes('SU') && this.selection.includes('SU')) {
        this.$bvModal.msgBoxConfirm('Are you sure you want to make this user a Super User?', {
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
    },
    emitOk () {
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
