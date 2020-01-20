import Vue from 'vue'
import VueRouter from 'vue-router'
const upload = () => import('../components/upload')
const imgfile = () => import('../components/imgfile')
const share = () => import('../components/share')
// 1.安装VueRouter
Vue.use(VueRouter)
// 2.配置路由信息
const routes = [
  {
    path: '/',
    redirect: '/upload'
  },
  {
    path: '/upload',
    component: upload
  },
  {
    path: '/imgfile',
    component: imgfile
  },
	{
	  path: '/share',
	  component: share
	},
]

// 3.创建路由对象
const router = new VueRouter({
  mode: 'history',
  routes
})

// 4.导出
export default router