/*
 * @Author      : ZhouQiJun
 * @Date        : 2025-04-25 23:00:07
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2025-04-26 00:29:27
 * @Description :
 */
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
