<template>
  <el-dialog
    v-model="props.dialog.editDialogVisible"
    title="修改菜单"
    width="50%"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
    @close="this.$refs.menuUpdateFormRef.resetFields()"
  >
    <el-form
      label-position="right"
      label-width="80px"
      :model="props.menuUpdateRow"
      ref="menuUpdateFormRef"
    >
      <el-form-item
        label="上级菜单"
        prop="parentId"
      >
        <el-tree-select
          placeholder="请选择上级菜单"
          v-model="props.menuUpdateRow.parentId"
          value-key="id"
          :data="props.menusTree"
          check-strictly
          :render-after-expand="false"
          show-checkbox
          :props="{ label: 'name', children: 'children' }"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input v-model="props.menuUpdateRow.name" />
      </el-form-item>
      <el-form-item
        label="路径"
        prop="path"
      >
        <el-input v-model="props.menuUpdateRow.path" />
      </el-form-item>
      <el-form-item
        label="权限编码"
        prop="permission"
      >
        <el-input v-model="props.menuUpdateRow.permission" />
      </el-form-item>
      <el-form-item
        label="组件"
        prop="component"
      >
        <el-input v-model="props.menuUpdateRow.component" />
      </el-form-item>
      <el-form-item
        label="图标"
        prop="icon"
      >
        <el-input v-model="props.menuUpdateRow.icon" />
      </el-form-item>
      <el-form-item
        label="类型"
        prop="type"
      >
        <el-radio-group v-model="props.menuUpdateRow.type">
          <el-radio :label=1>目录</el-radio>
          <el-radio :label=2>菜单</el-radio>
          <el-radio :label=3>按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="状态"
        prop="flag"
      >
        <el-radio-group v-model="props.menuUpdateRow.flag">
          <el-radio label='Y'>正常</el-radio>
          <el-radio label='N'>禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="排序号"
        prop="orderNum"
      >
        <el-input-number
          v-model="props.menuUpdateRow.orderNum"
          :min="1"
          label="排序号"
        >1</el-input-number>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.dialog.editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updateMenu"
        >
          确 认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getCurrentInstance, inject } from '@vue/runtime-core'
import ViewUIPlus from 'view-ui-plus';

export default {
  name: 'MenuEdit',
  props: ['menusTree', 'dialog', 'menuUpdateRow'],
  setup(props, context) {
    const axios = inject('axios')
    const ElMessage = inject('ElMessage')
    const { proxy } = getCurrentInstance()

    function updateMenu() {
      ViewUIPlus.LoadingBar.start();

      axios.put('/resNav/menu/updateMenu', props.menuUpdateRow).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();
          ElMessage({
            message: response.data.msg,
            type: 'success'
          })

          context.emit('listMenusTree')
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

    return {
      props,
      updateMenu,
    }
  }
}
</script>

<style>
</style>