<template>
  <!-- 主布局 -->
  <el-container class="layout">

    <!-- 侧边栏和（顶部、主体） -->
    <el-container>

      <!-- 侧边栏 -->
      <el-aside
        width="auto"
        :collapsed-width="78"
        v-model="this.$store.state.isCollapsed"
      >
        <AsideMenu />
      </el-aside>

      <!-- 顶部和主体 -->
      <el-container>
        <el-header height="50px">
          <HeaderMenu />
        </el-header>
        <el-main>
          <router-view> </router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- 底部 -->
    <el-footer height="30px">
      <FooterMenu />
    </el-footer>
  </el-container>
</template>

<script>
import AsideMenu from './AsideMenu.vue';
import HeaderMenu from './HeaderMenu.vue';
import FooterMenu from './FooterMenu.vue';

export default {
  name: 'MainMenu',
  components: {
    AsideMenu,
    HeaderMenu,
    FooterMenu
  },
}
</script>

<style scoped>
.layout {
  height: 100vh;
}
.el-aside {
  background-color: #001529;
}
.el-header {
  height: 50px;
  line-height: 50px;
  min-height: 50px;
  min-width: 220px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  padding: 0;
}
.el-main {
  min-width: 220px;
  min-height: 400px;
  padding: 0;
}
.el-footer {
  line-height: 30px;
  max-height: 30px;
  min-height: 30px;
  min-width: 420px;
  text-align: center;
  background: skyblue;
  color: white;
}
</style>