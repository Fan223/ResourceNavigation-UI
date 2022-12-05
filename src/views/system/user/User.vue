<template>
  <el-row>
    <el-col :span="6">
      <b>用户管理</b>
    </el-col>
    <el-col :span="18">
      <div class="main-header-button">
        <el-button
          v-if="hasAuth('user:add')"
          type="primary"
          size="small"
          @click="dialog.addDialogVisible = true"
        >新增</el-button>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          title="确定删除吗?"
          :icon="InfoFilled"
          icon-color="#626AEF"
          @confirm="multipleDeleteUser"
        >
          <template #reference>
            <el-button
              v-if="hasAuth('user:delete')"
              type="danger"
              size="small"
            >批量删除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-col>
  </el-row>

  <el-table
    :data="users.data"
    row-key="id"
    border
    stripe
    empty-text="加载中..."
    show-header
    height="400px"
    :header-cell-style="{background:'#ddd'}"
    ref="userTableRef"
    class="user-table"
  >
    <el-table-column type="selection" />
    <el-table-column
      prop="username"
      label="用户名"
      sortable
      align="center"
      width="150px"
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
      width="100px"
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
      width="180px"
    />
    <el-table-column
      v-if="hasAuth('user:update') || hasAuth('user:delete')"
      label="操作"
      align="center"
      width="240px"
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
</template>

<script>
import { reactive } from '@vue/reactivity'
import { getCurrentInstance, inject } from '@vue/runtime-core'
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

      axios.get('/resNav/user/listUsers').then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          users.data.push.apply(users.data, response.data.data)
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
.el-table {
  margin-top: 3px;
}
</style>