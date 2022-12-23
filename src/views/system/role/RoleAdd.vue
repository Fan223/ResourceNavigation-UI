<template>
  <el-dialog
    v-model="props.dialog.addDialogVisible"
    title="添加角色"
    width="50%"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
    @close="this.$refs.roleAddFormRef.resetFields()"
  >
    <el-form
      label-position="right"
      label-width="80px"
      :model="roleAddForm"
      ref="roleAddFormRef"
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model="roleAddForm.name"
          clearable
          placeholder="请输入名称"
        />
      </el-form-item>
      <el-form-item
        label="角色编码"
        prop="code"
      >
        <el-input
          v-model="roleAddForm.code"
          clearable
          placeholder="请输入角色编码"
        />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="flag"
      >
        <el-radio-group v-model="roleAddForm.flag">
          <el-radio label='Y'>正常</el-radio>
          <el-radio label='N'>禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          type="textarea"
          v-model="roleAddForm.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.dialog.addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addRole"
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
  name: 'RoleAdd',
  props: ['dialog'],
  setup(props, context) {
    const axios = inject('axios')
    const ElMessage = inject('ElMessage')

    let roleAddForm = reactive({
      flag: 'Y',
    })

    function addRole() {
      ViewUIPlus.LoadingBar.start()

      axios.post('/resNav/role/addRole', roleAddForm).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish()
          ElMessage({
            message: response.data.msg,
            type: 'success'
          })

          context.emit('listRoles')
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
      addRole,
      props,
      roleAddForm,
    }
  }
}
</script>

<style>
</style>
