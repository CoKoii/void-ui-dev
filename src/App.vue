<script setup lang="ts">
import VButton from '@/components/Button/Button.vue'
defineOptions({
  name: 'App',
})
</script>

<template>
  <div class="App">
    <VButton>主要按钮</VButton>
    <VButton type="secondary">次要按钮</VButton>
    <VButton type="outline">线框按钮</VButton>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <VButton size="s">按钮</VButton>
    <VButton size="m">按钮</VButton>
    <VButton size="l">按钮</VButton>
    <VButton size="xl">按钮</VButton>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <VButton>默认形状</VButton>
    <VButton shape="round">全圆角</VButton>
    <VButton shape="circle">C</VButton>
    <VButton shape="square">S</VButton>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <VButton>主要按钮</VButton>
    <VButton type="secondary">次要按钮</VButton>
    <VButton type="outline">线框按钮</VButton>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <VButton status="primary">主要按钮</VButton>
    <VButton type="secondary" status="primary">次要按钮</VButton>
    <VButton type="outline" status="primary">线框按钮</VButton>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <VButton status="success">主要按钮</VButton>
    <VButton type="secondary" status="success">次要按钮</VButton>
    <VButton type="outline" status="success">线框按钮</VButton>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <VButton status="warning">主要按钮</VButton>
    <VButton type="secondary" status="warning">次要按钮</VButton>
    <VButton type="outline" status="warning">线框按钮</VButton>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <VButton status="danger">主要按钮</VButton>
    <VButton type="secondary" status="danger">次要按钮</VButton>
    <VButton type="outline" status="danger">线框按钮</VButton>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <VButton disabled>主要按钮</VButton>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <VButton long>主要按钮</VButton>
  </div>
</template>

<style scoped lang="scss">
.App {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  justify-items: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
}
</style>
