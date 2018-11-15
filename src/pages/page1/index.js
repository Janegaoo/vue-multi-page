// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import _ from 'lodash'
import App from './App'
import Router from 'vue-router'
import routes from '@/router/router'
import store from '@/store/index.js'

import 'element-ui/lib/theme-chalk/index.css'

import {Plugin1, Plugin2} from '@/classes/plugins'

import ElementUI, { Message, MessageBox } from 'element-ui'
/*通过以上分析我们可以知道，在我们以后编写插件的时候可以有两种方式。
一种是将这个插件的逻辑封装成一个对象最后将最后在install编写业务代码暴露给Vue对象。这样做的好处是可以添加任意参数在这个对象上方便将install函数封装得更加精简，可拓展性也比较高。
还有一种则是将所有逻辑都编写成一个函数暴露给Vue。
其实两种方法原理都一样，无非第二种就是将这个插件直接当成install函数来处理。
个人觉得第一种方式比较合理。*/

  Vue.use(Plugin1, '参数1', '参数2');
  Vue.use(Plugin2, '参数A', '参数B');

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
