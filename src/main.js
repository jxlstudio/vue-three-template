import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Buefy from 'buefy'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faDownload, faSquare, faEye, faCube, faPlus, faMinus, faUndoAlt, faRulerCombined, faCircle, faTh, faShareSquare, faFilePdf } from '@fortawesome/free-solid-svg-icons'
// import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSpinner, faDownload, faSquare, faEye, faCube, faPlus, faMinus, faUndoAlt, faRulerCombined, faCircle, faTh, faShareSquare, faFilePdf)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Buefy)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
