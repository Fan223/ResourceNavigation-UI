<template>
  <!-- 查询区域 -->
  <el-row>
    <el-col :span="24">
      <el-form
        class="query-form-inline"
        label-position="right"
        label-width="70px"
        :model="roleQueryForm"
        ref="roleQueryFormRef"
        :inline="true"
        @keyup.enter="listRoles"
      >
        <el-form-item
          label="角色名称"
          prop="name"
        >
          <el-input
            v-model="roleQueryForm.name"
            placeholder="请输入名称"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="角色编码"
          prop="code"
        >
          <el-input
            v-model="roleQueryForm.code"
            placeholder="请输入角色编码"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="flag"
        >
          <el-select
            v-model="roleQueryForm.flag"
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
            @click="listRoles"
          >查询
          </el-button>
          <el-button @click="() => this.$refs.roleQueryFormRef.resetFields()">重置
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
            v-if="hasAuth('role:add')"
            type="primary"
            size="small"
            @click="dialog.addDialogVisible = true"
          >新增</el-button>
          <el-popconfirm
            v-if="hasAuth('menu:delete')"
            confirm-button-text="确定"
            cancel-button-text="取消"
            title="确定删除吗?"
            :icon="InfoFilled"
            icon-color="#626AEF"
            @confirm="multipleDeleteRole"
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
          class="data-content-table"
          :data="roles.data"
          row-key="id"
          border
          stripe
          show-header
          :max-height="tableMaxHeight"
          :header-cell-style="{background:'#ddd'}"
          ref="roleTableRef"
        >
          <el-table-column type="selection" />
          <el-table-column
            prop="name"
            label="名称"
            sortable
            align="center"
            min-width="160px"
          />
          <el-table-column
            prop="code"
            label="角色编码"
            min-width="120px"
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
            min-width="240px"
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            sortable
            align="center"
            min-width="180px"
          />
          <el-table-column
            v-if="hasAuth('roleMenu:assignPermission') || hasAuth('role:update') || hasAuth('role:delete')"
            label="操作"
            align="center"
            min-width="240px"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                v-if="hasAuth('roleMenu:assignPermission') && (hasAuth('ROLE_root') || (scope.row.id !== 'root' && scope.row.id !== 'base'))"
                type="primary"
                size="small"
                @click="assignPermissions(scope.row)"
              >分配权限</el-button>
              <el-button
                v-if="hasAuth('role:update') && (hasAuth('ROLE_root') || (scope.row.id !== 'root' && scope.row.id !== 'base'))"
                type="primary"
                size="small"
                @click="updateRole(scope.row)"
              >编辑</el-button>
              <el-popconfirm
                v-if="hasAuth('role:delete') && (hasAuth('ROLE_root') || (scope.row.id !== 'root' && scope.row.id !== 'base'))"
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
        <el-pagination
          class="data-pagination"
          v-model:current-page="paginationForm.currentPage"
          v-model:page-size="paginationForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginationForm.total"
        />
        <RoleAdd
          :dialog="dialog"
          @listRoles="listRoles"
        />
        <RoleEdit
          :dialog="dialog"
          @listRoles="listRoles"
          :roleUpdateRow="roleUpdateRow.data"
        />
        <AssignPermission
          :dialog="dialog"
          :roleId="assignRoleId.value"
          @changeDialogVisible="changeDialogVisible"
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
import RoleAdd from './RoleAdd.vue';
import RoleEdit from './RoleEdit.vue';
import AssignPermission from './AssignPermission.vue'
import '@/assets/css/mainStyle.css'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Role',
  setup() {
    const axios = inject('axios')
    const { proxy } = getCurrentInstance()
    const ElMessage = inject('ElMessage')

    let roleQueryForm = reactive({

    })
    let paginationForm = reactive({
      currentPage: 1,
      pageSize: 10,
    })
    let roles = reactive({
      data: []
    })
    let dialog = reactive({
      addDialogVisible: false,
      editDialogVisible: false,
      assignDialogVisible: false
    })
    let roleUpdateRow = reactive({
      data: {}
    })
    let assignRoleId = reactive({
      value: ''
    })
    let tableMaxHeight = ref(window.innerHeight - 310)


    function listRoles() {
      dialog.addDialogVisible = false
      dialog.editDialogVisible = false
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/role/pageRoles', {
        params: {
          flag: roleQueryForm.flag,
          name: roleQueryForm.name,
          code: roleQueryForm.code,
          currentPage: paginationForm.currentPage,
          pageSize: paginationForm.pageSize
        }
      }).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          roles.data = []
          roles.data.push.apply(roles.data, response.data.data.records)
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
    listRoles();

    watch([() => paginationForm.currentPage, () => paginationForm.pageSize], () => {
      listRoles()
    })


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

    function multipleDeleteRole() {
      let ids = proxy.$refs.roleTableRef.getSelectionRows().map(select => select.id)

      if (ids.length > 0) {
        deleteRole(ids)
      } else {
        ElMessage({
          message: '未选中任何行',
          type: 'error'
        })
      }
    }

    function updateRole(row) {
      dialog.editDialogVisible = true
      roleUpdateRow.data = row
    }

    function assignPermissions(row) {
      dialog.assignDialogVisible = true
      assignRoleId.value = row.id
    }

    function changeDialogVisible() {
      dialog.assignDialogVisible = false
    }

    return {
      roleQueryForm,
      paginationForm,
      roles,
      roleUpdateRow,
      assignRoleId,
      dialog,
      InfoFilled,
      tableMaxHeight,

      deleteRole,
      multipleDeleteRole,
      updateRole,
      listRoles,
      assignPermissions,
      changeDialogVisible
    }
  },
  components: {
    RoleAdd,
    RoleEdit,
    AssignPermission
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