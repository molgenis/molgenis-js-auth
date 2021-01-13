import Vue from 'vue'
import App from './App.vue'
import { createProvider } from './vue-apollo'
import {
  BootstrapVue,
  BIcon,
  BIconSearch,
  BIconCheck,
  BIconX,
  BIconPersonPlusFill,
  BIconPersonDashFill,
  BIconPersonLinesFill,
  BIconPeopleFill,
  BIconJournals,
  BIconJournalPlus,
  BIconJournalMinus,
  BIconJournalText
} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.component('BIcon', BIcon)
Vue.component('BIconSearch', BIconSearch)
Vue.component('BIconCheck', BIconCheck)
Vue.component('BIconX', BIconX)
Vue.component('BIconPersonPlusFill', BIconPersonPlusFill)
Vue.component('BIconPersonDashFill', BIconPersonDashFill)
Vue.component('BIconPersonLinesFill', BIconPersonLinesFill)
Vue.component('BIconPeopleFill', BIconPeopleFill)
Vue.component('BIconJournals', BIconJournals)
Vue.component('BIconJournalPlus', BIconJournalPlus)
Vue.component('BIconJournalMinus', BIconJournalMinus)
Vue.component('BIconJournalText', BIconJournalText)

new Vue({
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
