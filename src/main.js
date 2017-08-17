import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

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
  render: h => h(App)
})