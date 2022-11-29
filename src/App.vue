<template>
  <router-view> </router-view>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const store = useStore()

    router.isReady().then(() => {
      console.log(router.currentRoute.value);
      if (router.currentRoute.value.fullPath !== '/home' && router.currentRoute.value.fullPath !== '/login') {
        let addTab = {
          name: router.currentRoute.value.meta.title,
          permission: router.currentRoute.value.name
        }

        store.commit('ADD_TAB', addTab)
      }
    })
  }
}
</script>

<style>
/* 去除页面边距 */
body,
html {
  margin: 0;
  padding: 0;
}
</style>
