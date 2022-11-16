<template>
  <template
    v-for="asideMenu in asideMenus"
    :key="asideMenu.id"
  >
    <!-- 有 children, 就显示子菜单，有小箭头 -->
    <el-sub-menu
      v-if="asideMenu.children && asideMenu.children.length > 0"
      :index="asideMenu.id"
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

    <!-- 没有 children, 就显示为单菜单，没有小箭头 -->
    <el-menu-item
      :index="asideMenu.id"
      v-else
    >
      <el-icon>
        <Menu />
      </el-icon>
      <template #title> {{asideMenu.name}} </template>
    </el-menu-item>
  </template>
</template>

<script>
export default {
  name: 'ChildMenu',
  props: ['asideMenus'],
}
</script>

<style>
</style>