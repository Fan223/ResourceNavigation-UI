<template>
  <el-menu :collapse="this.$store.state.isCollapsed">
    <router-link to="/home">
      <el-menu-item index="root">
        <el-icon>
          <Menu />
        </el-icon>
        <template #title>Root</template>
      </el-menu-item>
    </router-link>

    <ChildMenu :asideMenus="asideMenus.data"></ChildMenu>
  </el-menu>
</template>

<script>
import { reactive } from '@vue/reactivity'
import ChildMenu from './ChildMenu';
import { inject } from '@vue/runtime-core';

export default {
  name: 'AsideMenu',
  setup() {
    const axios = inject('axios')
    let asideMenus = reactive({
      data: []
    })

    function listMenu() {
      axios.get('/resNav/menu/pageMenus').then(
        response => {
          asideMenus.data = response.data.data.records
        }
      )
    }

    listMenu();

    return {
      asideMenus,
    }
  },
  components: {
    ChildMenu
  }
}
</script>

<style scoped>
.el-menu:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
.el-menu--collapse {
  height: 100%;
}
a {
  text-decoration: none;
}
</style>