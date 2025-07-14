<script setup lang="ts">
import VButton from './components/Button/Button.vue'
import { onMounted, ref } from 'vue'
import type { ButtonInstance } from './components/Button/types'
const buttonElement = ref<ButtonInstance | null>(null)
onMounted(() => {
  console.log('Button Element:', buttonElement?.value?.ref)
})
defineOptions({
  name: 'App',
})
</script>

<template>
  <div class="App">
    <!-- 基础五种类型 -->
    <v-button type="primary">type primary</v-button>
    <v-button type="success">type success</v-button>
    <v-button type="danger">type danger</v-button>
    <v-button type="warning">type warning</v-button>
    <!-- 默认矩形 -->
    <v-button type="primary" shape="default">shape default</v-button>
    <!-- 圆角按钮（通常和 round 搭配） -->
    <v-button type="success" shape="round">shape round</v-button>
    <!-- 圆形按钮（通常用于图标） -->
    <v-button type="danger" shape="circle">中</v-button>
    <!-- 默认实线 -->
    <v-button border="solid">border solid</v-button>
    <!-- 虚线边框 -->
    <v-button border="dashed">border dashed</v-button>
    <!-- 点状边框 -->
    <v-button border="dotted" color="red">border dotted</v-button>
    <!-- 禁用按钮 -->
    <v-button type="danger" disabled>disabled</v-button>
    <!-- 自动聚焦按钮 -->
    <v-button type="primary" autofocus>autofocus</v-button>
    <!-- 圆形+禁用 -->
    <v-button type="danger" shape="circle" disabled>c</v-button>
    <v-button type="primary" size="large">Primary</v-button>
    <v-button type="primary" size="small">Primary</v-button>
  </div>
</template>

<style scoped lang="scss">
.App {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-items: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  gap: 24px;
}
</style>
