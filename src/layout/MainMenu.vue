<template>
  <!-- 主布局 -->
  <el-container class="layout">

    <!-- 侧边栏和( 顶部、主体 ) -->
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
        <Tabs />
        <el-main>
          <router-view> </router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- 底部 -->
    <!-- <el-footer height="25px">
      <FooterMenu />
    </el-footer> -->
  </el-container>
</template>

<script>
import AsideMenu from './AsideMenu.vue';
import HeaderMenu from './HeaderMenu.vue';
// import FooterMenu from './FooterMenu.vue';
import Tabs from './Tabs.vue';

export default {
  name: 'MainMenu',
  components: {
    AsideMenu,
    HeaderMenu,
    // FooterMenu,
    Tabs
  },
}
</script>

<style scoped>
.layout {
  height: 100vh;
  min-height: 520px;
  min-width: 520px;
}
.el-header {
  height: 50px;
  line-height: 50px;
  padding: 0;
}
.el-tabs {
  height: 41px;
  border-top: 1px solid #ddd;
}
.el-main {
  padding: 0;
  background-color: #f0f2f5;
}
/* .el-footer {
  text-align: center;
  background-color: #002140;
  color: white;
} */
</style>