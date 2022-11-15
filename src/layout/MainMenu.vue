<template>
  <!-- 主布局 -->
  <Layout class="layout">

    <!-- 侧边栏和（顶部、主体） -->
    <Layout>

      <!-- 侧边栏 -->
      <Sider
        hide-trigger
        collapsible
        :width="200"
        :collapsed-width="78"
        v-model="this.$store.state.isCollapsed"
        class="layout-sider"
      >
        <SiderMenu />
      </Sider>

      <!-- 顶部和主体 -->
      <Layout>
        <Header class="layout-header">
          <HeaderMenu />
        </Header>
        <Content class="layout-content">
          <router-view> </router-view>
        </Content>
      </Layout>
    </Layout>

    <!-- 底部 -->
    <span class="layout-footer">Copyright © 2022 凡（Fan223）</span>
    <!-- <Footer class="layout-footer">
      <FooterMenu />
    </Footer> -->
  </Layout>
</template>

<script>
import SiderMenu from './SiderMenu.vue';
import HeaderMenu from './HeaderMenu.vue';
// import FooterMenu from './FooterMenu.vue';

export default {
  name: 'MainMenu',
  components: {
    SiderMenu,
    HeaderMenu,
    // FooterMenu
  },
}
</script>

<style scoped>
.layout {
  height: 100vh;
}
.layout-sider {
  background-color: #001529;
}
.layout-header {
  height: 50px;
  line-height: 50px;
  min-height: 50px;
  min-width: 220px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  padding: 0;
}
.layout-content {
  min-width: 220px;
  min-height: 400px;
  padding: 0;
}
.layout-footer {
  height: 30px;
  line-height: 30px;
  max-height: 30px;
  min-height: 30px;
  min-width: 420px;
  text-align: center;
  background: skyblue;
  color: white;
}
</style>