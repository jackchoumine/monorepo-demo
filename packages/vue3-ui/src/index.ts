/*
 * @Author      : ZhouQiJun
 * @Date        : 2025-04-28 20:43:55
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2025-04-28 22:09:00
 * @Description :
 */
import type { App } from 'vue'

import HelloWorld from './components/HelloWorld.vue'
import EcButton from './components/EcButton.vue'
import TodoItem from './components/TodoItem.vue'

HelloWorld.install = (app: App) => {
  app.component('HelloWorld', HelloWorld)
  HelloWorld.installed = true
}

export { HelloWorld, EcButton, TodoItem }

export default {
  install: (app: App) => {
    app.component('HelloWorld', HelloWorld)
    app.component('EcButton', EcButton)
    app.component('TodoItem', TodoItem)
  },
}
