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
        <h1 style="color: white">登录</h1>
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            type="password"
            v-model="loginForm.password"
          />
        </el-form-item>
        <el-form-item
          label="验证码"
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
          />
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
            @click="this.$refs.loginFormRef.resetFields()"
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
import { useStore } from 'vuex';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  setup() {
    const axios = inject('axios');
    const { proxy } = getCurrentInstance()
    const router = useRouter()
    const store = useStore()
    const ElMessage = inject('ElMessage')

    // 登录表单
    let loginForm = reactive({
      username: '',
      password: '',
      captcha: '',
      loginToken: ''
    });
    let captchaImg = ref('');
    let loadingStatus = ref(false);

    // 登录表单验证规则
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

          axios.post('/resNav/login?' + qs.stringify(loginForm)).then((response) => {
            loadingStatus.value = false;

            if (response.data.code == 200) {
              ViewUIPlus.LoadingBar.finish();
              ElMessage({
                message: response.data.msg,
                type: 'success'
              })

              const JWT = response.headers.authorization
              localStorage.setItem('JWT', JWT)
              store.state.menu.tabs = []
              store.state.menu.activeTabName = store.state.menu.homeTab.name

              router.push('/home');
              store.state.menu.hasRoute = false
            } else {
              ViewUIPlus.LoadingBar.error();
              ElMessage({
                message: response.data.msg,
                type: 'error'
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

    return {
      loginForm,
      captchaImg,
      loginFormRules,
      login,
      loadingStatus,
      getCaptcha,
    };
  },
};
</script>

<style scoped>
.el-col {
  background-image: url("@/assets/images/background.jpg");
  background-size: 100% 100%;
  height: 100vh;
  min-height: 521px;
  min-width: 650px;
  display: flex;
  align-items: center;
}
.el-form {
  background-color: rgb(0, 0, 0, 0.4);
  border-radius: 15px;
  height: 330px;
  width: 620px;
  margin: 0 auto;
  padding-top: 20px;
  text-align: center;
}
.el-form-item {
  width: 90%;
}
.el-input {
  height: 40px;
}
:deep(.el-form-item__label) {
  color: #fff;
  font-weight: bold;
  font-size: 16px;
}
.login-btn {
  padding-top: 10px;
}
</style>
