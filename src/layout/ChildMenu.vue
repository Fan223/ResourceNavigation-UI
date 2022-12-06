<template>
  <template
    v-for="asideMenu in asideMenus"
    :key="asideMenu.id"
  >
    <!-- 有 children, 就显示子菜单, 有小箭头 -->
    <el-sub-menu
      v-if="asideMenu.children && asideMenu.children.length > 0"
      :index="asideMenu.permission"
    >
      <template #title>
        <el-icon>
          <location />
        </el-icon>
        <span> {{ asideMenu.name }} </span>
      </template>
      <!-- 递归调用 -->
      <ChildMenu :asideMenus="asideMenu.children"></ChildMenu>
    </el-sub-menu>

    <!-- 没有 children, 就显示为单菜单, 没有小箭头 -->
    <router-link
      v-else
      :to="asideMenu.path"
    >
      <el-menu-item
        :index="asideMenu.permission"
        @click="addTab(asideMenu)"
      >
        <el-icon>
          <Menu />
        </el-icon>
        <template #title> {{asideMenu.name}} </template>
      </el-menu-item>
    </router-link>
  </template>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'ChildMenu',
  props: ['asideMenus'],
  setup() {
    const store = useStore()

    function addTab(asideMenu) {
      store.commit('ADD_TAB', asideMenu)
    }

    return {
      addTab
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
