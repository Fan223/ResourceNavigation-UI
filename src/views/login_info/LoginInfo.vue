<template>
  <!-- 查询区域 -->
  <el-row>
    <el-col :span="24">
      <el-form
        class="query-form-inline"
        label-position="right"
        label-width="70px"
        :model="loginInfoQueryForm"
        ref="loginInfoQueryFormRef"
        :inline="true"
        @keyup.enter="pageLoginInfos"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="loginInfoQueryForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="IP地址"
          prop="ipAddress"
        >
          <el-input
            v-model="loginInfoQueryForm.ipAddress"
            placeholder="请输入IP地址"
            clearable
          />
        </el-form-item>
        <el-form-item class="query-form-inline-button">
          <el-button
            size="small"
            type="primary"
            @click="pageLoginInfos"
          >查询
          </el-button>
          <el-button @click="() => this.$refs.loginInfoQueryFormRef.resetFields()">重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>

  <!-- 结果区域 -->
  <div class="data-content">
    <el-row class="data-content-header">
      <el-col
        :span="6"
        class="data-content-header-text"
      >
        <b>查询结果</b>
      </el-col>
      <el-col :span="18">
        <div class="data-content-header-button">
          <el-popconfirm
            v-if="hasAuth('loginInfo:delete')"
            confirm-button-text="确定"
            cancel-button-text="取消"
            title="确定删除吗?"
            :icon="InfoFilled"
            icon-color="#626AEF"
            @confirm="multipleDeleteUser"
          >
            <template #reference>
              <el-button
                type="danger"
                size="small"
              >批量删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </el-col>
    </el-row>

    <!-- 数据 -->
    <el-row>
      <el-col :span="23">
        <el-table
          :data="loginInfos.data"
          row-key="id"
          border
          stripe
          show-header
          :max-height="tableMaxHeight"
          :header-cell-style="{background:'#ddd'}"
          ref="userTableRef"
        >
          <el-table-column type="selection" />
          <el-table-column
            prop="username"
            label="用户名"
            sortable
            align="center"
            min-width="100px"
          />
          <el-table-column
            prop="operateSystem"
            label="操作系统"
            sortable
            align="center"
            min-width="120px"
          />
          <el-table-column
            prop="browser"
            label="浏览器"
            sortable
            align="center"
            min-width="100px"
          />
          <el-table-column
            prop="ipAddress"
            label="IP地址"
            align="center"
            sortable
            min-width="140px"
          />
          <el-table-column
            prop="countryZhCnName"
            label="国家"
            align="center"
          />
          <el-table-column
            prop="subdivisionZhCnName"
            label="省份"
            align="center"
          />
          <el-table-column
            prop="cityZhCnName"
            label="城市"
            align="center"
          />
          <el-table-column
            prop="latitude"
            label="纬度"
            align="center"
            min-width="100px"
          />
          <el-table-column
            prop="longitude"
            label="经度"
            align="center"
            min-width="100px"
          />
          <el-table-column
            prop="updateTime"
            label="最近登录时间"
            sortable
            align="center"
            min-width="180px"
          />
          <el-table-column
            v-if="hasAuth('loginInfo:delete')"
            label="操作"
            align="center"
            min-width="80px"
            fixed="right"
          >
            <template #default="scope">
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                title="确定删除吗?"
                :icon="InfoFilled"
                icon-color="#626AEF"
                @confirm="deleteUser(scope.row)"
              >
                <template #reference>
                  <el-button
                    v-if="hasAuth('loginInfo:delete')"
                    type="danger"
                    size="small"
                  >删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="data-pagination"
          v-model:current-page="paginationForm.currentPage"
          v-model:page-size="paginationForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginationForm.total"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { getCurrentInstance, inject, watch } from '@vue/runtime-core'
import { InfoFilled } from '@element-plus/icons-vue'
import ViewUIPlus from 'view-ui-plus';
import '@/assets/css/mainStyle.css'

export default {
  name: 'LoginInfo',
  setup() {
    const axios = inject('axios')
    const { proxy } = getCurrentInstance()
    const ElMessage = inject('ElMessage')

    let loginInfoQueryForm = reactive({
    })
    let paginationForm = reactive({
      currentPage: 1,
      pageSize: 10,
    })
    let loginInfos = reactive({
      data: []
    })
    let tableMaxHeight = ref(window.innerHeight - 310)


    function pageLoginInfos() {
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/loginInfo/pageLoginInfos', {
        params: {
          username: loginInfoQueryForm.username,
          ipAddress: loginInfoQueryForm.ipAddress,
          currentPage: paginationForm.currentPage,
          pageSize: paginationForm.pageSize
        }
      }).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          loginInfos.data = []
          loginInfos.data.push.apply(loginInfos.data, response.data.data.records)
          paginationForm.total = response.data.data.total
        } else {
          ViewUIPlus.LoadingBar.error();
          ElMessage({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }
    pageLoginInfos();

    watch([() => paginationForm.currentPage, () => paginationForm.pageSize], () => {
      pageLoginInfos()
    })

    function deleteUser(row) {
      let ids = row.id ? [row.id] : row
      ViewUIPlus.LoadingBar.start();

      axios.delete('/resNav/user/deleteUser', { data: { ids: ids } }).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();
          ElMessage({
            message: response.data.msg,
            type: 'success'
          })

          pageLoginInfos()
          proxy.refreshNavMenus()
        } else {
          ViewUIPlus.LoadingBar.error();
          ElMessage({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }

    function multipleDeleteUser() {
      let ids = proxy.$refs.userTableRef.getSelectionRows().map(select => select.id)

      if (ids.length > 0) {
        deleteUser(ids)
      } else {
        ElMessage({
          message: '未选中任何行',
          type: 'error'
        })
      }
    }

    return {
      loginInfoQueryForm,
      paginationForm,
      loginInfos,
      InfoFilled,
      tableMaxHeight,

      deleteUser,
      multipleDeleteUser,
      pageLoginInfos,
    }
  },
}
</script>

<style scoped>
.el-col {
  margin: 0 auto;
}
:deep(.query-form-inline .el-form-item__label) {
  font-weight: bold;
}
.el-select,
.el-input {
  width: 200px;
}
</style>
