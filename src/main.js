// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import JobDetail from './components/JobDetail/JobDetail'
import {AlertPlugin, ToastPlugin, ConfirmPlugin} from 'vux'
import tools from './utils/tools'
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(VueRouter)
Vue.use(VueResource)
// Vue.http.options.root = 'http://localhost:8765/api/user'
Vue.http.options.root = tools.apiHost

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/jobdetail/:job_id',
    component: JobDetail
  }
]

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
