<template>
  <el-dialog
    v-model="props.dialog.dialogVisible"
    title="Notice"
    width="50%"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
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
        <el-input v-model="menuAddForm.name" />
      </el-form-item>
      <el-form-item
        label="路径"
        prop="path"
      >
        <el-input v-model="menuAddForm.path" />
      </el-form-item>
      <el-form-item
        label="权限编码"
        prop="permission"
      >
        <el-input v-model="menuAddForm.permission" />
      </el-form-item>
      <el-form-item
        label="组件"
        prop="component"
      >
        <el-input v-model="menuAddForm.component" />
      </el-form-item>
      <el-form-item
        label="图标"
        prop="icon"
      >
        <el-input v-model="menuAddForm.icon" />
      </el-form-item>
      <el-form-item
        label="类型"
        prop="type"
      >
        <el-radio-group v-model="menuAddForm.type">
          <el-radio :label=0>目录</el-radio>
          <el-radio :label=1>菜单</el-radio>
          <el-radio :label=2>按钮</el-radio>
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
        <el-button @click="props.dialog.dialogVisible = false">取 消</el-button>
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
import { getCurrentInstance, inject } from '@vue/runtime-core'

export default {
  name: 'MenuAdd',
  props: ['menusTree', 'dialog'],
  setup(props, context) {
    const axios = inject('axios')
    const { proxy } = getCurrentInstance()

    let menuAddForm = reactive({
      flag: 'Y',
      orderNum: 1,
      parentId: ''
    })

    function addMenu() {
      axios.post('/resNav/menu/addMenu', menuAddForm).then(() => {
        proxy.$refs.menuAddFormRef.resetFields()
        context.emit('listMenusTree')
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