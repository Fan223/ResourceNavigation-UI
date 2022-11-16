<template>
  <el-menu :collapse="this.$store.state.isCollapsed">
    <el-menu-item index="root">
      <el-icon>
        <Menu />
      </el-icon>
      <template #title>Root</template>
    </el-menu-item>

    <ChildMenu :asideMenus="asideMenus"></ChildMenu>
  </el-menu>
</template>

<script>
import { reactive } from '@vue/reactivity'
import ChildMenu from './ChildMenu';

export default {
  name: 'AsideMenu',
  setup() {

    let asideMenus = reactive([
      {
        id: "1",
        parentId: "",
        name: "系统管理",
        icon: "<Menu />",
        children: [
          {
            id: "1-1",
            parentId: "1",
            name: "菜单管理",
            icon: "<Menu />",
            children: []
          },
          {
            id: "1-2",
            parentId: "2",
            name: "用户管理",
            icon: "<Menu />",
            children: []
          }
        ]
      },
      {
        id: "2",
        parentId: "",
        name: "日志管理",
        icon: "<Menu />",
        children: []
      }
    ])

    function hasChildren(asideMenu) {
      console.log(asideMenu);

      return false;
    }

    return {
      asideMenus,
      hasChildren
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
</style>