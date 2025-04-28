<!--
 * @Author      : ZhouQiJun
 * @Date        : 2025-04-28 21:23:38
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2025-04-28 21:24:08
 * @Description :
-->
<script setup>
import { sum } from '@ecbase/utils'
const total = ref(sum(100, 20))
</script>

<template>
  <div class="EcButton">
    <button @click="total++">+ {{ total }}</button>
  </div>
</template>

<style lang="scss">
.EcButton {
  // scss code
}
</style>
