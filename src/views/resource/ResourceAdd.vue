<template>
  <el-dialog
    v-model="props.dialog.addDialogVisible"
    title="添加用户"
    width="50%"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
    @close="this.$refs.userAddFormRef.resetFields()"
  >
    <el-form
      label-position="right"
      label-width="80px"
      :model="userAddForm"
      ref="userAddFormRef"
      :rules="userAddFormRules"
    >
      <el-form-item
        label="用户名"
        prop="username"
      >
        <el-input
          v-model="userAddForm.username"
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
          v-model="userAddForm.password"
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
          v-model="userAddForm.avatar"
          placeholder="请输入头像"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="flag"
      >
        <el-radio-group v-model="userAddForm.flag">
          <el-radio label='Y'>正常</el-radio>
          <el-radio label='N'>禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.dialog.addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
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
import ViewUIPlus from 'view-ui-plus';

export default {
  name: 'ResourceAdd',
  props: ['dialog'],
  setup(props, context) {
    const axios = inject('axios')
    const ElMessage = inject('ElMessage')
    const { proxy } = getCurrentInstance()

    let userAddForm = reactive({
      password: '123456',
      flag: 'Y',
    })
    let userAddFormRules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    };

    function addUser() {
      proxy.$refs.userAddFormRef.validate((valid) => {
        if (valid) {
          ViewUIPlus.LoadingBar.start()

          axios.post('/resNav/user/addUser', userAddForm).then(response => {
            if (response.data.code === 200) {
              ViewUIPlus.LoadingBar.finish()
              ElMessage({
                message: response.data.msg,
                type: 'success'
              })

              context.emit('listUsers')
            } else {
              ViewUIPlus.LoadingBar.error()
              ElMessage({
                message: response.data.msg,
                type: 'error'
              })
            }
          })
        } else {
          return false;
        }
      });
    }

    return {
      props,
      userAddForm,
      userAddFormRules,
      addUser,
    }
  }
}
</script>

<style>
</style>
