// 引入 Vue Router
import { createRouter, createWebHashHistory } from 'vue-router'
// 引入 Vuex
import store from '../store'
// 引入 axios
import axios from '../axios'
// 引入饿了么UI消息通知
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
      name: 'Root',
      component: () => import('@/layout/MainMenu.vue'),
      children: [
        { 
          path: '/home',
          name: 'Home',
          component: () => import('@/views/Home.vue')
        },
      ],
    },
    {
      path: '/index',
      name: 'Index',
      component: () => import('@/views/Index.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    // 404路由, 当匹配不到路由, 就会匹配已经有的 404 路由, 可解决动态路由刷新时未加载对应路由报警告
    {
      path: '/:catchAll(.*)',
      name: '404',
      component: () => import('@/views/404.vue')
  }
  ]
})

// 全局前置守卫
router.beforeEach((to, from ,next) => {
  let hasRoute = store.state.menu.hasRoute;

  if (to.path === '/login') {
    next()
  } else if(!localStorage.getItem('JWT')) {
    ElMessage({
      message: '请先登录',
      type: 'error'
    })
    next('/login')
  } else if (!hasRoute){
    axios.get('/resNav/auth/listNavMenus').then(response => {
      // 拿到 menus 菜单列表
      store.commit('SET_MENUS', response.data.data.menus);
      // 拿到 authorities 权限列表
      store.commit('SET_AUTHORITIES', response.data.data.authorities);
  
      // 动态绑定路由
      response.data.data.menus.forEach(menu => {
        if (menu.children && menu.children.length > 0) {
          transToRouter(menu)
        } else {
          let route = menuToRouter(menu);
          if (route) {
            router.addRoute('Root', route);
          }
        }
      });

      store.commit('CHANGE_ROUTE_STATUS', true);
      next(to.path)
    })
  } else {
    next()
  }
})

function transToRouter(menu) {
  if(menu.children && menu.children.length > 0) {
    menu.children.forEach(child => {
      transToRouter(child)
    })
  } else {
    let route = menuToRouter(menu);
    if (route) {
      router.addRoute('Root', route)
    }
  }
}

function menuToRouter(menu) {
  if(!menu.component){
    return null;
  } else {
    return {
      path: menu.path,
      name: menu.permission,
      component: () => import('@/views' + menu.component +'.vue'),
      meta: {
        title: menu.name,
        icon: menu.icon
      }
    }
  }
}

export default router