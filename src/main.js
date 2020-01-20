import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
// import  './directives'
// 一键复制
　　import VueClipboard from 'vue-clipboard2'
　　Vue.use( VueClipboard )
// 灯箱效果
import gallery from 'img-vuer'
Vue.use(gallery, {
  swipeThreshold: 150, // default 100
  isIndexShow: true, // show image index, default true
  useCloseButton: true, // trigger gallery close with close button, default true
  preload: true, // preload images in the same group, default true
})

Vue.config.productionTip = false
Vue.use(ElementUI);
// 导入axios
axios.defaults.baseURL = 'http://upload.loole.tech'
Vue.prototype.$http = axios
//然后再修改原型链

new Vue({
  render: h => h(App),	
  router
}).$mount('#app')
