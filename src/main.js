import { createApp } from 'vue'
import App from './App.vue'

// vue-router
import router from '@/router'
// VueX
import store from '@/store'
// Element UI
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import { ElMessage } from 'element-plus'
// Element UI语言包
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// Element UI图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// vue-axios
import request from '@/axios'
import VueAxios from 'vue-axios'
// View Design
import 'view-ui-plus/dist/styles/viewuiplus.css'
import { LoadingBar } from 'view-ui-plus'
// 引入全局混入
import mixin from '@/mixin'


const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('LoadingBar', LoadingBar);

app.mixin(mixin)

app.use(store)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .use(VueAxios, request)
  .mount('#app')

app.provide('axios', request)
app.provide('ElMessage', ElMessage)