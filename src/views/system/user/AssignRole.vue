<template>
  <el-dialog
    v-model="props.dialog.assignDialogVisible"
    title="分配角色"
    width="50%"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
    @open="listRolesByUserId"
    @close="this.$refs.assignRoleFormRef.resetFields()"
  >

    <el-form
      :model="assignRoleForm"
      ref="assignRoleFormRef"
    >
      <el-form-item>
        <el-select
          placeholder="请选择角色"
          v-model="assignRoleForm.roleIds"
          multiple
          clearable
        >
          <el-option
            v-for="role in roles.data"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.dialog.assignDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="assignRoles"
        >
          确 认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getCurrentInstance, inject, reactive } from '@vue/runtime-core'
import ViewUIPlus from 'view-ui-plus';

export default {
  name: 'AssignRole',
  props: ['dialog', 'userId'],
  setup(props, context) {
    const axios = inject('axios')
    const ElMessage = inject('ElMessage')
    const { proxy } = getCurrentInstance()

    let roles = reactive({
      data: []
    })
    let assignRoleForm = reactive({
      roleIds: ''
    })

    function listRoles() {
      roles.data = []
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/role/pageRoles', {
        params: {
          flag: 'Y',
          currentPage: 1,
          pageSize: 50
        }
      }).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          roles.data.push.apply(roles.data, response.data.data.records)
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

    function listRolesByUserId() {
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/userRole/listRolesByUserId/' + props.userId).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          let roleIds = response.data.data.map(role => role.id)
          assignRoleForm.roleIds = roleIds
        } else {
          ViewUIPlus.LoadingBar.error();
          ElMessage({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }

    function assignRoles() {
      axios.post('/resNav/userRole/assignRoles/' + props.userId, assignRoleForm).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish()
          ElMessage({
            message: response.data.msg,
            type: 'success'
          })

          context.emit('changeDialogVisible')
          proxy.refreshNavMenus()
        } else {
          ViewUIPlus.LoadingBar.error()
          ElMessage({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }

    return {
      props,
      roles,
      listRolesByUserId,
      assignRoleForm,
      assignRoles
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 80%;
}
</style>