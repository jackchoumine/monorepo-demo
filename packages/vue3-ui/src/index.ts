/*
 * @Author      : ZhouQiJun
 * @Date        : 2025-04-28 20:43:55
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2025-04-28 20:47:07
 * @Description :
 */
import type { App } from 'vue'

import HelloWorld from './components/HelloWorld.vue'

HelloWorld.install = (app: App) => {
  app.component('HelloWorld', HelloWorld)
  HelloWorld.installed = true
}

export { HelloWorld }

export default {
  install: (app: App) => {
    app.component('HelloWorld', HelloWorld)
  },
}
