import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import './mock/index.js';  // 该项目所有请求使用mockjs模拟
import './login.js' 
import './ui.js' 
import axios from 'axios'
import service from './utils/fetch'

Vue.prototype.$http = service
Vue.prototype.$axios = axios

Vue.config.productionTip = false;
var vm=new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


 