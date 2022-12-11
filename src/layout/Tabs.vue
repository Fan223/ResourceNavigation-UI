<template>
  <el-tabs
    v-model="this.$store.state.menu.activeTabName"
    type="card"
    @tab-remove="removeTab"
    @tab-click="routerToTab"
  >
    <el-tab-pane
      :label="this.$store.state.menu.homeTab.title"
      :name="this.$store.state.menu.homeTab.name"
    >
    </el-tab-pane>

    <el-tab-pane
      v-for="tab in this.$store.state.menu.tabs"
      :key="tab.name"
      :label="tab.title"
      :name="tab.name"
      closable
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Tabs',
  setup() {
    const store = useStore()
    const router = useRouter()

    function removeTab(targetName) {
      let activeTabName = store.state.menu.activeTabName
      let tabs = store.state.menu.tabs

      // 假如移除的tab是当前tab, 获取下一个激活的tab为移除tab的右一个或左一个tab, 假如不存在则为首页
      if (activeTabName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeTabName = nextTab.name;
            } else {
              activeTabName = store.state.menu.homeTab.name
            }
          }
        });
      }
      // 重新设置tab
      store.state.menu.activeTabName = activeTabName;
      store.state.menu.tabs = tabs.filter(tab => tab.name !== targetName);
      router.push({ name: activeTabName })
    }

    function routerToTab(tab) {
      store.state.menu.activeTabName = tab.props.name
      router.push({ name: tab.props.name })
    }

    return {
      removeTab,
      routerToTab,
    }
  }
}
</script>

<style scoped>
</style>
