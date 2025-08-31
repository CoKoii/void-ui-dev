<script setup lang="ts">
defineOptions({
  name: 'App',
})
import VThemeToggle from './components/ThemeToggle/index.vue'
import VCode from './components/Code/index.vue'
const vueTemplateCode = `<template>
  <div class="user-card">
    <div class="user-avatar">
      <img :src="user.avatar" :alt="user.name" />
    </div>
    <div class="user-info">
      <h3 class="user-name">{{ user.name }}</h3>
      <p class="user-email">{{ user.email }}</p>
      <div class="user-badges">
        <span
          v-for="badge in user.badges"
          :key="badge.id"
          class="badge"
          :class="\`badge-\${badge.type}\`"
        >
          {{ badge.label }}
        </span>
      </div>
    </div>
    <div class="user-actions">
      <button
        @click="handleFollow"
        :disabled="isLoading"
        class="btn btn-primary"
      >
        {{ isFollowing ? '取消关注' : '关注' }}
      </button>
      <button
        @click="handleMessage"
        class="btn btn-secondary"
      >
        发消息
      </button>
    </div>
  </div>
</template>`
</script>

<template>
  <div class="App">
    <VThemeToggle class="changeTheme" />
    <VCode
      :line-numbers="true"
      :extra="{ copy: true, showLang: true }"
      lang="template"
      style="width: 600px"
      path="UserCard.vue"
      >{{ vueTemplateCode }}</VCode
    >
  </div>
</template>

<style scoped lang="scss">
.App {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: var(--v-page-bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}
.changeTheme {
  position: fixed;
  right: 30px;
  top: 30px;
}
</style>
