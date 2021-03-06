import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import qs from 'qs'
Vue.use(Router)
Vue.prototype.$axios=axios;
Vue.prototype.$qs=qs;
export default new Router({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/Login/Login.vue'),
    },{
      path: '/ZhuCe',
      component: () => import(/* webpackChunkName: "home" */ '../components/Login/ZhuCe.vue'),
    },{
      path: '/Login',
      component: () => import(/* webpackChunkName: "home" */ '../components/Login/Login.vue'),
    },
    {
      path: '/Home',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/test',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Test.vue'),
          meta: { title: '系统首页' }
        },{
          path: '/Brand',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Brand.vue'),
          meta: { title: '品牌管理' }
        },{
          path: '/ShopData',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/ShopData.vue'),
          meta: { title: '属性管理' }
        },{
          path: '/ShopAdd',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/ShopAdd.vue'),
          meta: { title: '商品新增' }
        },{
          path: '/Type',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Type.vue'),
          meta: { title: '分类管理' }
        },{
          path: '/ShopDuck',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/ShopDuck.vue'),
          meta: { title: '商品展示' }
        },{
          path: '/Menu',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Menu/Menu.vue'),
          meta: { title: '权限管理' }
        },{
          path: '/Role',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Menu/Role.vue'),
          meta: { title: '角色管理' }
        },{
          path: '/User',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Menu/User.vue'),
          meta: { title: '用户管理' }
        }

      ]
    }
  ]
})
