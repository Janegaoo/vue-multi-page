// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import _ from 'lodash'
import App from './App'
import Router from 'vue-router'
import routes from './routes/router'
import store from '@/store/index.js'

import 'element-ui/lib/theme-chalk/index.css'

import ElementUI, { Message, MessageBox } from 'element-ui'

  Vue.use(Router)

  const router = new Router({
    routes // (缩写) 相当于 routes: routes
  })

  // router.beforeEach(function(to,from,next){
  //   console.log(123)
  // });

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'small' })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  store,
  components: { App },
  template: '<App/>'
})
