<template>
  <!-- 查询区域 -->
  <el-row>
    <el-col :span="24">
      <el-form
        class="query-form-inline"
        label-position="right"
        label-width="70px"
        :model="resourceQueryForm"
        ref="resourceQueryFormRef"
        :inline="true"
        @keyup.enter="listresources"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="resourceQueryForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="flag"
        >
          <el-select
            v-model="resourceQueryForm.flag"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              label="正常"
              value="Y"
            />
            <el-option
              label="禁用"
              value="N"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="query-form-inline-button">
          <el-button
            size="small"
            type="primary"
            @click="listresources"
          >查询
          </el-button>
          <el-button @click="() => this.$refs.resourceQueryFormRef.resetFields()">重置
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
          <el-button
            v-if="hasAuth('user:add')"
            type="primary"
            size="small"
            @click="dialog.addDialogVisible = true"
          >新增</el-button>
          <el-popconfirm
            v-if="hasAuth('user:delete')"
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
          :data="resources.data"
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
            min-width="120px"
          />
          <el-table-column
            prop="roleNames"
            label="角色"
            sortable
            align="center"
            min-width="180px"
          >
            <template #default="scope">
              <el-tag
                v-for="roleName in scope.row.roleNames"
                :key="roleName"
                size="small"
                type="info"
              >
                {{ roleName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="avatar"
            label="头像"
            align="center"
            sortable
          />
          <el-table-column
            prop="flag"
            label="状态"
            align="center"
          >
            <template #default="scope">
              <el-tag
                v-if="scope.row.flag === 'N'"
                size="small"
                type="danger"
              >禁用</el-tag>
              <el-tag
                v-else-if="scope.row.flag === 'Y'"
                size="small"
                type="success"
              >正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            sortable
            align="center"
            min-width="180px"
          />
          <el-table-column
            v-if="hasAuth('user:update') || hasAuth('user:delete')"
            label="操作"
            align="center"
            min-width="240px"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                v-if="hasAuth('user:update')"
                type="primary"
                size="small"
                @click="updateUser(scope.row)"
              >编辑</el-button>
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
                    v-if="hasAuth('user:delete')"
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
        <UserAdd
          :dialog="dialog"
          @pageResources="pageResources"
        />
        <UserEdit
          :dialog="dialog"
          @pageResources="pageResources"
          :userUpdateRow="userUpdateRow.data"
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
import UserAdd from './ResourceAdd.vue';
import UserEdit from './ResourceEdit.vue';
import '@/assets/css/mainStyle.css'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Resource',
  setup() {
    const axios = inject('axios')
    const { proxy } = getCurrentInstance()
    const ElMessage = inject('ElMessage')

    let resourceQueryForm = reactive({
    })
    let paginationForm = reactive({
      currentPage: 1,
      pageSize: 10,
    })
    let resources = reactive({
      data: []
    })
    let dialog = reactive({
      addDialogVisible: false,
      editDialogVisible: false,
    })
    let userUpdateRow = reactive({
      data: {}
    })
    let tableMaxHeight = ref(window.innerHeight - 310)


    function pageResources() {
      dialog.addDialogVisible = false
      dialog.editDialogVisible = false
      dialog.assignDialogVisible = false
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/user/pageResources', {
        params: {
          flag: resourceQueryForm.flag,
          username: resourceQueryForm.username,
          currentPage: paginationForm.currentPage,
          pageSize: paginationForm.pageSize
        }
      }).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          resources.data = []
          resources.data.push.apply(resources.data, response.data.data.records)
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
    pageResources();

    watch([() => paginationForm.currentPage, () => paginationForm.pageSize], () => {
      pageResources()
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

          pageResources()
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

    function updateUser(row) {
      dialog.editDialogVisible = true
      userUpdateRow.data = row
    }

    return {
      resourceQueryForm,
      paginationForm,
      resources,
      userUpdateRow,
      dialog,
      InfoFilled,
      tableMaxHeight,

      deleteUser,
      multipleDeleteUser,
      updateUser,
      pageResources,
    }
  },
  components: {
    UserAdd,
    UserEdit
  }
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
