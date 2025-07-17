<script setup lang="ts">
import VButton from '@/components/Button/Button.vue'
import { ref, onMounted } from 'vue'

defineOptions({
  name: 'App',
})

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.body.style.backgroundColor = '#1E2025'
  } else {
    document.documentElement.removeAttribute('data-theme')
    document.body.style.backgroundColor = ''
  }
}

onMounted(() => {
  // 检查系统主题偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
    document.body.style.backgroundColor = '#1E2025'
  }
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

  <!-- 主题切换按钮 -->
  <VButton
    class="theme-toggle"
    shape="circle"
    @click="toggleTheme"
    :title="isDark ? '切换到浅色主题' : '切换到深色主题'"
  >
    {{ isDark ? '☀️' : '🌙' }}
  </VButton>
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

.theme-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
}
</style>
