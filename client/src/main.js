// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'

import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
Vue.config.productionTip = false
import "./elementUI"
// 解决移动端300ms延迟问题
if (typeof window !== 'undefined') {
  const Fastclick = require('fastclick');
  Fastclick.attach(document.body);
}
/* eslint-disable no-new */
export function createApp (context) {
  const store = createStore()
  const router = createRouter()
  sync(store, router)
  const app = new Vue({
    router,
    store,
    context,
    render: h => h(App)
  })
  return { store, router, app }
}
