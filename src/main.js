import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

/* eslint-disable  no-unused-vars */
import vConsole from 'vconsole'

Vue.config.productionTip = false

import 'assets/stylus/index.styl'

fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('assets/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
