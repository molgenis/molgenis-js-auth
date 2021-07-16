<template>
  <div>
    <b-alert
      :show="showError"
      variant="danger"
      dismissible
      @dismissed="showError=false"
    >
     {{errorMessage}}
    </b-alert>
  </div>
</template>

<script>
import { EventBus } from '@{{ site.baseurl }}/assets/images/eventbus'

export default {
  data () {
    return {
      errorMessage: '',
      showError: false
    }
  },
  methods: {
    showErrorMessage (errorMessage) {
      this.errorMessage = errorMessage
      this.showError = true
    }
  },
  created () {
    EventBus.$on('error', this.showErrorMessage)
  }
}
</script>
