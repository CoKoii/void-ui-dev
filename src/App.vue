<script setup lang="ts">
import VButton from '@/components/Button/Button.vue'
import { ref, onMounted } from 'vue'
import VCollapseGroup from '@/components/Collapse/CollapseGroup.vue'
import VCollapse from '@/components/Collapse/Collapse.vue'
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
const active = ref(false)
onMounted(() => {
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
    <VCollapseGroup>
      <VCollapse title="道生一" :active="active">
        <template #title>
          <h4>标题111</h4>
        </template>
        <template #right>
          <VButton type="primary" status="danger" @click.stop="active = !active">按钮</VButton>
        </template>
        <VCollapseGroup>
          <VCollapse title="一生二">
            <template #title>
              <h4>标题111</h4>
            </template>
            <template #right>
              <span>666</span>
            </template>
            <VCollapseGroup>
              <VCollapse title="二生三">
                <template #title>
                  <h4>标题111</h4>
                </template>
                <template #right>
                  <span>666</span>
                </template>
                <VCollapseGroup>
                  <VCollapse title="三生万物">
                    <template #title>
                      <h4>标题111</h4>
                    </template>
                    <template #right>
                      <span>666</span>
                    </template>
                    <p>这是折叠内容的示例文本。</p>
                  </VCollapse>
                </VCollapseGroup>
              </VCollapse>
            </VCollapseGroup>
          </VCollapse>
        </VCollapseGroup>
      </VCollapse>
      <VCollapse title="标题3">
        <template #title>
          <h4>标题111</h4>
        </template>
        <template #right>
          <span>666</span>
        </template>
        <p>这是折叠内容的示例文本。</p>
      </VCollapse>
      <VCollapse title="标题4" disabled>
        <template #title>
          <h4>标题111</h4>
        </template>
        <template #right>
          <span>666</span>
        </template>
        <p>这是折叠内容的示例文本。</p>
      </VCollapse>
    </VCollapseGroup>
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
  padding: 0 24px;
  grid-template-columns: repeat(1, 1fr);
  justify-items: center;
  align-items: center;
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
