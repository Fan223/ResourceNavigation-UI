<template>
  <el-dialog
    v-model="props.dialog.editDialogVisible"
    title="修改角色"
    width="50%"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
    @close="this.$refs.roleUpdateRowRef.resetFields()"
  >
    <el-form
      label-position="right"
      label-width="80px"
      :model="props.roleUpdateRow"
      ref="roleUpdateRowRef"
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input v-model="props.roleUpdateRow.name" />
      </el-form-item>
      <el-form-item
        label="角色编码"
        prop="code"
      >
        <el-input v-model="props.roleUpdateRow.code" />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="flag"
      >
        <el-radio-group v-model="props.roleUpdateRow.flag">
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
          v-model="props.roleUpdateRow.remark"
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
  props: ['dialog', 'roleUpdateRow'],
  setup(props, context) {
    const axios = inject('axios')
    const ElMessage = inject('ElMessage')

    function updateRole() {
      ViewUIPlus.LoadingBar.start();

      axios.put('/resNav/role/updateRole', props.roleUpdateRow).then(response => {
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