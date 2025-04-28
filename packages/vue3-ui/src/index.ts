/*
 * @Author      : ZhouQiJun
 * @Date        : 2025-04-28 20:43:55
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2025-04-28 21:24:55
 * @Description :
 */
import type { App } from 'vue'

import HelloWorld from './components/HelloWorld.vue'
import EcButton from './components/EcButton.vue'

HelloWorld.install = (app: App) => {
  app.component('HelloWorld', HelloWorld)
  HelloWorld.installed = true
}

export { HelloWorld, EcButton }

export default {
  install: (app: App) => {
    app.component('HelloWorld', HelloWorld)
    app.component('EcButton', EcButton)
  },
}
