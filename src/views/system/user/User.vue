<template>
  <!-- 查询区域 -->
  <el-row>
    <el-col :span="24">
      <el-form
        class="query-form-inline"
        label-position="right"
        label-width="70px"
        :model="userQueryForm"
        ref="userQueryFormRef"
        :inline="true"
        @keyup.enter="listUsers"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="userQueryForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="flag"
        >
          <el-select
            v-model="userQueryForm.flag"
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
            @click="listUsers"
          >查询
          </el-button>
          <el-button @click="() => this.$refs.userQueryFormRef.resetFields()">重置
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
          :data="users.data"
          row-key="id"
          border
          stripe
          show-header
          height="400px"
          :header-cell-style="{background:'#ddd'}"
          ref="userTableRef"
        >
          <el-table-column type="selection" />
          <el-table-column
            prop="username"
            label="用户名"
            sortable
            align="center"
            min-width="160px"
          />
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
                type="primary"
                size="small"
                @click="assignRoles(scope.row)"
              >分配角色</el-button>
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
          @listUsers="listUsers"
        />
        <UserEdit
          :dialog="dialog"
          @listUsers="listUsers"
          :userUpdateRow="userUpdateRow.data"
        />
        <AssignRole
          :dialog="dialog"
          :userId="assignRoleId.value"
          @changeDialogVisible="changeDialogVisible"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { getCurrentInstance, inject, watch } from '@vue/runtime-core'
import { InfoFilled } from '@element-plus/icons-vue'
import ViewUIPlus from 'view-ui-plus';
import UserAdd from './UserAdd.vue';
import UserEdit from './UserEdit.vue';
import AssignRole from './AssignRole.vue'
import '@/assets/css/mainStyle.css'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'User',
  setup() {
    const axios = inject('axios')
    const { proxy } = getCurrentInstance()
    const ElMessage = inject('ElMessage')

    let userQueryForm = reactive({
    })
    let paginationForm = reactive({
      currentPage: 1,
      pageSize: 10,
    })
    let users = reactive({
      data: []
    })
    let dialog = reactive({
      addDialogVisible: false,
      editDialogVisible: false,
      assignDialogVisible: false
    })
    let userUpdateRow = reactive({
      data: {}
    })
    let assignRoleId = reactive({
      value: ''
    })


    function listUsers() {
      dialog.addDialogVisible = false
      dialog.editDialogVisible = false
      users.data = []
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/user/pageUsers', {
        params: {
          flag: userQueryForm.flag,
          username: userQueryForm.username,
          currentPage: paginationForm.currentPage,
          pageSize: paginationForm.pageSize
        }
      }).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          users.data.push.apply(users.data, response.data.data.records)
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
    listUsers();

    watch([() => paginationForm.currentPage, () => paginationForm.pageSize], () => {
      listUsers()
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

          listUsers()
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

    function assignRoles(row) {
      dialog.assignDialogVisible = true
      assignRoleId.value = row.id
    }

    function changeDialogVisible() {
      dialog.assignDialogVisible = false
    }

    return {
      userQueryForm,
      paginationForm,
      users,
      userUpdateRow,
      assignRoleId,
      dialog,
      InfoFilled,

      deleteUser,
      multipleDeleteUser,
      updateUser,
      listUsers,
      assignRoles,
      changeDialogVisible
    }
  },
  components: {
    UserAdd,
    UserEdit,
    AssignRole
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