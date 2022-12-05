<template>
  <el-dialog
    v-model="props.dialog.editDialogVisible"
    title="修改用户"
    width="50%"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
    @close="this.$refs.userUpdateRowRef.resetFields()"
  >
    <el-form
      label-position="right"
      label-width="80px"
      :model="props.userUpdateRow"
      ref="userUpdateRowRef"
    >
      <el-form-item
        label="用户名"
        prop="username"
      >
        <el-input
          v-model="props.userUpdateRow.username"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          type="password"
          v-model="props.userUpdateRow.password"
          show-password
          placeholder="请输入密码"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="头像"
        prop="avatar"
      >
        <el-input
          v-model="props.userUpdateRow.avatar"
          placeholder="请输入头像"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="flag"
      >
        <el-radio-group v-model="props.userUpdateRow.flag">
          <el-radio label='Y'>正常</el-radio>
          <el-radio label='N'>禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.dialog.editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updateUser"
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
  name: 'UserEdit',
  props: ['dialog', 'userUpdateRow'],
  setup(props, context) {
    const axios = inject('axios')
    const ElMessage = inject('ElMessage')

    function updateUser() {
      ViewUIPlus.LoadingBar.start();

      axios.put('/resNav/user/updateUser', props.userUpdateRow).then(response => {
        if (response.data.code === 200) {
          ViewUIPlus.LoadingBar.finish();
          ElMessage({
            message: response.data.msg,
            type: 'success'
          })

          context.emit('listUsers')
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
      updateUser,
    }
  }
}
</script>

<style>
</style>