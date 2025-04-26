<!--
 * @Author      : ZhouQiJun
 * @Date        : 2025-04-25 23:00:07
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2025-04-26 23:27:01
 * @Description :
-->
<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { sum } from 'utils'
const total = sum(1, 2)
</script>

<template>
  <main>
    <p>{{ total }}</p>
    <TheWelcome />
  </main>
</template>
