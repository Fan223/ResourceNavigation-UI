<template>
  <el-menu
    background-color="#001529"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse="this.$store.state.isCollapsed"
    :default-active="this.$store.state.menu.activeTabName"
  >

    <el-menu-item
      index="Title"
      @click="this.$router.go(0)"
      style="background-color: #002140"
    >
      <el-icon>
        <Menu />
      </el-icon>
      <template #title>Root</template>
    </el-menu-item>

    <router-link to="/home">
      <el-menu-item index="Home">
        <el-icon>
          <Menu />
        </el-icon>
        <template #title>首页</template>
      </el-menu-item>
    </router-link>

    <ChildMenu :asideMenus="this.$store.state.menu.menus"></ChildMenu>
  </el-menu>
</template>

<script>
import ChildMenu from './ChildMenu';

export default {
  name: 'AsideMenu',
  components: {
    ChildMenu
  }
}
</script>

<style scoped>
.el-menu {
  border: none;
}
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