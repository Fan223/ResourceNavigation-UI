<template>
  <el-row>
    <el-col :span="24">
      <el-form
        ref="loginFormRef"
        label-position="right"
        label-width="120px"
        :model="loginForm"
        :rules="loginFormRules"
        :hide-required-asterisk="true"
        @keyup.enter="login"
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
            @click="getCaptcha"
            style="margin-left: 25px"
          >
          </el-image>
        </el-form-item>

        <el-form-item
          label-width="45%"
          class="login-btn"
        >
          <el-button
            type="primary"
            size="large"
            @click="login"
            :loading="loadingStatus"
          >登 录</el-button>
          <el-button
            size="large"
            @click="resetForm('loginFormRef')"
          >重 置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import { getCurrentInstance, inject } from "@vue/runtime-core";
import ViewUIPlus from 'view-ui-plus';
import { useRouter } from 'vue-router'
import qs from 'qs';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  setup() {
    const axios = inject('axios');
    const ElMessage = inject('ElMessage')
    const { proxy } = getCurrentInstance()
    const router = useRouter()

    // 登录表单
    let loginForm = reactive({
      username: 'fan',
      password: 'fan223',
      captcha: '',
      loginToken: ''
    });
    let captchaImg = ref('');
    let loadingStatus = ref(false);

    // 表单验证规则
    let loginFormRules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    };

    function getCaptcha() {
      axios.get('/resNav/api/getCaptcha').then((response) => {
        captchaImg.value = response.data.data.captchaImg;
        loginForm.loginToken = response.data.data.loginToken
      });
    }
    getCaptcha();

    function login() {
      proxy.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          loadingStatus.value = true;
          ViewUIPlus.LoadingBar.start();

          // axios({
          //   method: 'post',
          //   url: '/resNav/login',
          //   data: {
          //     username: loginForm.username,
          //     password: loginForm.password,
          //     captcha: loginForm.captcha,
          //     loginToken: loginForm.loginToken
          //   },
          //   Headers: {
          //     'Content-Type': 'application/x-www-form-urlencoded'
          //   },
          //   transformRequest: [
          //     function (data) {
          //       let ret = ''
          //       for (let it in data) {
          //         ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          //       }

          //       return ret.substring(0, ret.lastIndexOf('&'));
          //     }
          //   ]
          // })
          axios.post('/resNav/login?' + qs.stringify(loginForm)).then((response) => {
            loadingStatus.value = false;

            if (response.data.code == 200) {
              ViewUIPlus.LoadingBar.finish();
              ElMessage({
                message: response.data.msg,
                type: 'success',
              })

              const JWT = response.headers.authorization
              localStorage.setItem('JWT', JWT)

              router.push('/home');
            } else {
              ViewUIPlus.LoadingBar.error();
              ElMessage({
                message: response.data.msg,
                type: 'error',
              })

              getCaptcha()
              loginForm.captcha = ''
            }
          });
        } else {
          return false;
        }
      });
    }

    function resetForm(ref) {
      proxy.$refs[ref].resetFields()
    }

    return {
      loginForm,
      captchaImg,
      loginFormRules,
      login,
      loadingStatus,
      resetForm,
      getCaptcha,
    };
  },
};
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
  height: 330px;
  width: 620px;
  border: 1px solid red;
  margin: 0 auto;
  text-align: center;
}
.el-form-item {
  width: 90%;
}
.el-input {
  height: 40px;
}
:v-deep(.el-form-item__label) {
  color: black;
  font-weight: bold;
  font-size: 16px;
}
.login-btn {
  padding-top: 10px;
}
</style>