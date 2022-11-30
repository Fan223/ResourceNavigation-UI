<template>
  <el-dialog
    v-model="props.dialog.editDialogVisible"
    title="更新角色"
    width="50%"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
    @close="this.$refs.roleUpdateFormRef.resetFields()"
  >
    <el-form
      label-position="right"
      label-width="80px"
      :model="props.roleUpdateForm"
      ref="roleUpdateFormRef"
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input v-model="props.roleUpdateForm.name" />
      </el-form-item>
      <el-form-item
        label="角色编码"
        prop="code"
      >
        <el-input v-model="props.roleUpdateForm.code" />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="flag"
      >
        <el-radio-group v-model="props.roleUpdateForm.flag">
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
          v-model="props.roleUpdateForm.remark"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.dialog.editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updateRole"
        >
          确 认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { inject } from '@vue/runtime-core'
import ViewUIPlus from 'view-ui-plus';

export default {
  name: 'RoleEdit',
  props: ['dialog', 'roleUpdateForm'],
  setup(props, context) {
    const axios = inject('axios')
    const ElMessage = inject('ElMessage')

    function updateRole() {
      ViewUIPlus.LoadingBar.start();

      axios.put('/resNav/role/updateRole', props.roleUpdateForm).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();
          ElMessage({
            message: response.data.msg,
            type: 'success'
          })

          context.emit('listRoles')
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
      updateRole,
    }
  }
}
</script>

<style>
</style>