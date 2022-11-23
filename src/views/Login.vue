<template>
  <el-row>
    <el-col :span="24">
      <el-form
        label-position="right"
        label-width="100px"
        :model="loginForm"
      >
        <h1>登录</h1>
        <el-form-item
          label="用户名："
          prop="username"
        >
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item
          label="密码："
          prop="password"
        >
          <el-input v-model="loginForm.password" />
        </el-form-item>
        <el-form-item
          label="验证码："
          prop="captcha"
        >
          <el-input
            v-model="loginForm.captcha"
            style="width: 55%"
          />
          <el-image
            :src="captchaImg"
            style="margin-left: 25px"
          >
          </el-image>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">Create</el-button>
          <el-button>Reset</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  setup() {
    const axios = inject('axios')

    let loginForm = reactive({
      username: '',
      password: '',
      captcha: ''
    })
    let captchaImg = ref('');

    // 表单验证规则
    let rules = {
      username: [
        // required 表示是否必填，message 表示提示信息，trigger 表示触发方式
        { required: true, message: '请输入用户名', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
      ],
      captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
      ],
    }

    function getCaptcha() {
      axios.get('/resNav/api/getCaptcha').then(response => {
        captchaImg.value = response.data.data
      })
    }
    getCaptcha();

    return {
      rules,
      loginForm,
      captchaImg
    }
  }
}
</script>

<style scoped>
.el-col {
  height: 100vh;
  min-height: 521px;
  min-width: 650px;
  display: flex;
  align-items: center;
}
.el-form {
  height: 300px;
  width: 600px;
  border: 1px solid red;
  margin: 0 auto;
  text-align: center;
}
.el-form-item {
  width: 90%;
}
</style>