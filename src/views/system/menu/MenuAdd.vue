<template>
  <el-dialog
    v-model="props.dialog.addDialogVisible"
    title="添加菜单"
    width="50%"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
    @close="this.$refs.menuAddFormRef.resetFields()"
  >
    <el-form
      label-position="right"
      label-width="80px"
      :model="menuAddForm"
      ref="menuAddFormRef"
    >
      <el-form-item
        label="上级菜单"
        prop="parentId"
      >
        <el-tree-select
          placeholder="请选择上级菜单"
          v-model="menuAddForm.parentId"
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
        <el-input
          v-model="menuAddForm.name"
          placeholder="请输入名称"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="路径"
        prop="path"
      >
        <el-input
          v-model="menuAddForm.path"
          placeholder="请输入路径"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="权限编码"
        prop="permission"
      >
        <el-input
          v-model="menuAddForm.permission"
          placeholder="请输入权限编码"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="组件路径"
        prop="component"
      >
        <el-input
          v-model="menuAddForm.component"
          placeholder="请输入组件路径"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="图标"
        prop="icon"
      >
        <el-input
          v-model="menuAddForm.icon"
          placeholder="请输入图标"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="类型"
        prop="type"
      >
        <el-radio-group v-model="menuAddForm.type">
          <el-radio :label=1>目录</el-radio>
          <el-radio :label=2>菜单</el-radio>
          <el-radio :label=3>按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="状态"
        prop="flag"
      >
        <el-radio-group v-model="menuAddForm.flag">
          <el-radio label='Y'>正常</el-radio>
          <el-radio label='N'>禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="排序号"
        prop="orderNum"
      >
        <el-input-number
          v-model="menuAddForm.orderNum"
          :min="1"
          label="排序号"
        >1</el-input-number>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.dialog.addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addMenu"
        >
          确 认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
import ViewUIPlus from 'view-ui-plus';

export default {
  name: 'MenuAdd',
  props: ['menusTree', 'dialog'],
  setup(props, context) {
    const axios = inject('axios')
    const ElMessage = inject('ElMessage')

    let menuAddForm = reactive({
      flag: 'Y',
      orderNum: 1,
      parentId: '',
      type: 1
    })

    function addMenu() {
      ViewUIPlus.LoadingBar.start()

      axios.post('/resNav/menu/addMenu', menuAddForm).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish()
          ElMessage({
            message: response.data.msg,
            type: 'success'
          })

          context.emit('listMenusTree')
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
      addMenu,
      props,
      menuAddForm,
    }
  }
}
</script>

<style>
</style>