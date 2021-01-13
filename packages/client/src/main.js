import Vue from 'vue'
import App from './App.vue'
import { createProvider } from './vue-apollo'
import { BootstrapVue, BIcon, BIconSearch, BIconCheck, BIconX } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.component('BIcon', BIcon)
Vue.component('BIconSearch', BIconSearch)
Vue.component('BIconCheck', BIconCheck)
Vue.component('BIconX', BIconX)

new Vue({
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
