<template>
  <el-dialog
    v-model="props.dialog.assignDialogVisible"
    title="分配权限"
    width="50%"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
    @open="listMenusByRoleId"
  >

    <el-tree
      v-model="menuAddForm.parentId"
      :data="menusTree.data"
      check-strictly
      :render-after-expand="false"
      show-checkbox
      :props="{ label: 'name', children: 'children' }"
      clearable
      node-key="id"
      empty-text="加载中..."
      highlight-current
      default-expand-all
      ref="menusTreeRef"
    />

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.dialog.assignDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="assignMenu"
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
  name: 'AssignMenu',
  props: ['dialog', 'roleId'],
  setup(props) {
    const axios = inject('axios')
    const ElMessage = inject('ElMessage')
    const { proxy } = getCurrentInstance()

    let menusTree = reactive({
      data: []
    })
    let menuAddForm = reactive({
      parentId: []
    })

    function listMenusTree() {
      menusTree.data = []
      ViewUIPlus.LoadingBar.start();

      axios.get('/resNav/menu/listMenusTree').then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          menusTree.data.push.apply(menusTree.data, response.data.data)
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
      console.log(props.roleId);

      axios.get('/resNav/roleMenu/listMenusByRoleId', { params: { roleId: props.roleId } }).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();

          let checkedIds = response.data.data.map(menu => menu.id)

          proxy.$nextTick(() => proxy.$refs.menusTreeRef.setCheckedKeys(checkedIds))
        } else {
          ViewUIPlus.LoadingBar.error();
          ElMessage({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }

    function assignMenu() {
      console.log(proxy.$refs.menusTreeRef.getCheckedKeys());
    }

    return {
      props,
      listMenusByRoleId,
      menusTree,
      menuAddForm,
      assignMenu
    }
  }
}
</script>

<style>
</style>