import { createApp } from 'vue'
import App from './App.vue'

// vue-router
import router from './router'
// VueX
import store from './store'
// 饿了么UI
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 饿了么UI 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// vue-axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// import ViewUIPlus from 'view-ui-plus'
// import 'view-ui-plus/dist/styles/viewuiplus.css'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store)
  .use(router)
  .use(ElementPlus)
  .use(VueAxios, axios)
  // .use(ViewUIPlus)
  .mount('#app')

app.provide('axios', app.config.globalProperties.axios)