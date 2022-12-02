<template>
  <el-dialog
    v-model="props.dialog.assignDialogVisible"
    title="分配权限"
    width="50%"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
    @open="listMenusByRoleId"
    @close="this.$refs.assignPermissionFormRef.resetFields()"
  >

    <el-form
      :model="assignPermissionForm"
      ref="assignPermissionFormRef"
    >
      <el-form-item prop="strictly">
        <el-tree
          :data="assignMenusTree.data"
          :render-after-expand="false"
          show-checkbox
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          :check-strictly="assignPermissionForm.strictly"
          empty-text="加载中..."
          highlight-current
          default-expand-all
          ref="assignMenusTreeRef"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.dialog.assignDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="assignPermissions"
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
  props: ['dialog', 'roleId'],
  setup(props, context) {
    const axios = inject('axios')
    const ElMessage = inject('ElMessage')
    const { proxy } = getCurrentInstance()


    let assignMenusTree = reactive({
      data: []
    })
    let assignPermissionForm = reactive({
      strictly: true,
      menuIds: []
    })

    function listMenusTree() {
      assignMenusTree.data = []
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/menu/listMenusTree', { params: { flag: 'Y', type: 0 } }).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          assignMenusTree.data.push.apply(assignMenusTree.data, response.data.data)
        } else {
          ViewUIPlus.LoadingBar.error();
          ElMessage({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }
    listMenusTree()

    function listMenusByRoleId() {
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/roleMenu/listMenusByRoleId', { params: { roleId: props.roleId } }).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          let checkedIds = response.data.data.map(menu => menu.id)
          proxy.$refs.assignMenusTreeRef.setCheckedKeys(checkedIds)
          assignPermissionForm.strictly = false
        } else {
          ViewUIPlus.LoadingBar.error();
          ElMessage({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }

    function assignPermissions() {
      assignPermissionForm.menuIds = proxy.$refs.assignMenusTreeRef.getCheckedKeys()
        .concat(proxy.$refs.assignMenusTreeRef.getHalfCheckedKeys())

      axios.post('/resNav/roleMenu/assignPermissions/' + props.roleId, assignPermissionForm).then(response => {
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
      listMenusByRoleId,
      assignMenusTree,
      assignPermissionForm,
      assignPermissions
    }
  }
}
</script>

<style>
</style>