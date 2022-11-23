import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
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
        {
          path: '/menu',
          name: 'Menu',
          component: () => import('@/views/menu/Menu.vue')
        }
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
    }
  ]
})

export default router