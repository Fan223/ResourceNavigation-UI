<template>
  <el-row>
    <el-col :span="6">
      <b>角色管理</b>
    </el-col>
    <el-col :span="18">
      <div class="main-header-button">
        <el-button
          type="primary"
          size="small"
          @click="dialog.addDialogVisible = true"
        >新增</el-button>
        <el-button
          type="danger"
          size="small"
          @click="multipleDeleteRole"
        >批量删除</el-button>
      </div>
    </el-col>
  </el-row>

  <el-table
    :data="roles.data"
    row-key="id"
    border
    stripe
    default-expand-all
    empty-text="加载中..."
    show-header
    height="400px"
    :header-cell-style="{background:'#ddd'}"
    @selection-change="selectionChange"
  >
    <el-table-column type="selection" />
    <el-table-column
      prop="name"
      label="名称"
      sortable
      width="150px"
    />
    <el-table-column
      prop="code"
      label="角色编码"
      width="120px"
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
      prop="remark"
      label="备注"
      align="center"
    />
    <el-table-column
      prop="createTime"
      label="创建时间"
      sortable
      align="center"
      width="180px"
    />
    <el-table-column
      label="操作"
      align="center"
      width="240px"
      fixed="right"
    >
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="assignMenu(scope.row)"
        >分配权限</el-button>
        <el-button
          type="primary"
          size="small"
          @click="updateRole(scope.row)"
        >编辑</el-button>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          title="确定删除吗?"
          :icon="InfoFilled"
          icon-color="#626AEF"
          @confirm="deleteRole(scope.row)"
        >
          <template #reference>
            <el-button
              type="danger"
              size="small"
            >删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <RoleAdd
    :dialog="dialog"
    @listRoles="listRoles"
  />
  <RoleEdit
    :dialog="dialog"
    @listRoles="listRoles"
    :roleUpdateForm="roleUpdateForm.data"
  />
  <AssignMenu
    :dialog="dialog"
    :roleId="assignRoleId.value"
    @changeDialogVisible="changeDialogVisible"
  />
</template>

<script>
import { reactive } from '@vue/reactivity'
import { getCurrentInstance, inject } from '@vue/runtime-core'
import RoleAdd from './RoleAdd.vue';
import RoleEdit from './RoleEdit.vue';
import AssignMenu from './AssignMenu.vue'
import { InfoFilled } from '@element-plus/icons-vue'
import ViewUIPlus from 'view-ui-plus';
import '@/assets/css/mainStyle.css'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Role',
  setup() {
    const axios = inject('axios')
    const { proxy } = getCurrentInstance()
    const ElMessage = inject('ElMessage')

    let multipleSelection = reactive({
      value: []
    })
    let roles = reactive({
      data: []
    })
    let dialog = reactive({
      addDialogVisible: false,
      editDialogVisible: false,
      assignDialogVisible: false
    })
    let roleUpdateForm = reactive({
      data: {}
    })
    let assignRoleId = reactive({
      value: ''
    })


    function listRoles() {
      dialog.addDialogVisible = false
      dialog.editDialogVisible = false
      roles.data = []
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/role/listRoles').then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          roles.data.push.apply(roles.data, response.data.data)
        } else {
          ViewUIPlus.LoadingBar.error();
          ElMessage({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }
    listRoles();

    function deleteRole(row) {
      let ids = row.id ? [row.id] : row
      ViewUIPlus.LoadingBar.start();

      axios.delete('/resNav/role/deleteRole', { data: { ids: ids } }).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();
          ElMessage({
            message: response.data.msg,
            type: 'success'
          })

          listRoles()
          proxy.listNavMenus()
        } else {
          ViewUIPlus.LoadingBar.error();
          ElMessage({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }

    function selectionChange(val) {
      multipleSelection.value = val
    }

    function multipleDeleteRole() {
      let ids = multipleSelection.value.map(select => select.id);
      deleteRole(ids)
    }

    function updateRole(row) {
      dialog.editDialogVisible = true
      roleUpdateForm.data = row
    }

    function assignMenu(row) {
      dialog.assignDialogVisible = true
      assignRoleId.value = row.id
    }

    function changeDialogVisible() {
      dialog.assignDialogVisible = false
    }

    return {
      roles,
      listRoles,
      dialog,
      deleteRole,
      InfoFilled,
      selectionChange,
      multipleDeleteRole,
      updateRole,
      roleUpdateForm,
      assignMenu,
      assignRoleId,
      changeDialogVisible
    }
  },
  components: {
    RoleAdd,
    RoleEdit,
    AssignMenu
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 3px;
}
</style>