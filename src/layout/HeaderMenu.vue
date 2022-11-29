<template>
  <el-row>
    <el-col :span="6">
      <el-button
        @click="collapsedAside"
        :icon="Fold"
        v-if="!this.$store.state.isCollapsed"
        class="header-collapse-button"
      >
      </el-button>
      <el-button
        @click="collapsedAside"
        :icon="Expand"
        v-if="this.$store.state.isCollapsed"
        class="header-collapse-button"
      >
      </el-button>
    </el-col>

    <el-col :span="18">
      <el-avatar
        :size="40"
        :src="this.$store.state.url"
        class="header-avatar"
      />
    </el-col>
  </el-row>
</template>

<script>
import { useStore } from 'vuex'
import { Fold, Expand } from '@element-plus/icons-vue'

export default {
  name: 'HeaderMenu',
  setup() {
    const store = useStore()

    function collapsedAside() {
      store.state.isCollapsed = !store.state.isCollapsed
    }

    return {
      collapsedAside,
      Fold,
      Expand
    }
  }
}
</script>

<style scoped>
.el-col {
  height: 50px;
}
.header-collapse-button {
  border: none;
  height: 49px;
  width: 45px;
  margin-bottom: 3px;
  font-size: 20px;
}
.header-collapse-button:hover {
  background-color: #ccc;
  color: black;
}
.header-avatar {
  float: right;
  margin-right: 40px;
  margin-top: 5px;
}
</style>