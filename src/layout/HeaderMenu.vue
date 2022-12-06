<template>
  <el-row>
    <el-col :span="6">
      <el-button
        @click="changeCollapsed"
        :icon="Fold"
        v-if="!this.$store.state.isCollapsed"
        class="header-collapse-button"
      >
      </el-button>
      <el-button
        @click="changeCollapsed"
        :icon="Expand"
        v-if="this.$store.state.isCollapsed"
        class="header-collapse-button"
      >
      </el-button>
    </el-col>

    <el-col :span="18">
      <el-dropdown
        class="header-avatar"
        trigger="click"
      >
        <span>
          <el-avatar
            :size="40"
            :src="this.$store.state.url"
          />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="logout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import { Fold, Expand } from '@element-plus/icons-vue'
import { inject } from '@vue/runtime-core'
import { useStore } from 'vuex'
import ViewUIPlus from 'view-ui-plus';
import { useRouter } from 'vue-router';

export default {
  name: 'HeaderMenu',
  setup() {
    const axios = inject('axios')
    const store = useStore()
    const ElMessage = inject('ElMessage')
    const router = useRouter()

    function logout() {
      axios.post('/resNav/logout').then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish()
          ElMessage({
            message: response.data.msg,
            type: 'success'
          })

          localStorage.removeItem('JWT');
          router.push('/login')
        } else {
          ViewUIPlus.LoadingBar.error()
          ElMessage({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }

    function changeCollapsed() {
      store.state.isCollapsed = !store.state.isCollapsed
    }

    return {
      Fold,
      Expand,
      logout,
      changeCollapsed,
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
  background-color: #fff;
  color: #515a6e;
}
.header-avatar {
  float: right;
  margin-right: 40px;
  margin-top: 5px;
}
</style>