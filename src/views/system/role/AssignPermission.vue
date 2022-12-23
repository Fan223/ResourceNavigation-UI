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
import { useStore } from 'vuex';

export default {
  name: 'AssignPermission',
  props: ['dialog', 'roleId'],
  setup(props, context) {
    const axios = inject('axios')
    const ElMessage = inject('ElMessage')
    const { proxy } = getCurrentInstance()
    const store = useStore()


    let assignMenusTree = reactive({
      data: []
    })
    let assignPermissionForm = reactive({
      strictly: true,
      menuIds: []
    })

    function listMenusTree() {
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/menu/listMenusTree', { params: { flag: 'Y' } }).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          assignMenusTree.data = []
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
    if (store.state.menu.authorities.indexOf('roleMenu:assignPermission') > -1) {
      listMenusTree();
    }

    function listMenusByRoleId() {
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/roleMenu/listMenuIds/' + props.roleId).then(response => {
        assignPermissionForm.strictly = false

        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          proxy.$refs.assignMenusTreeRef.setCheckedKeys(response.data.data)
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
