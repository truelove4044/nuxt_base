<template>
  <div class="app-layout">
    <a class="app-layout__skip" href="#main-content">跳到主要內容</a>
    <slot />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100dvh;
}

.app-layout__skip {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  z-index: 20;
  padding: var(--space-2) var(--space-4);
  border-radius: 999px;
  background: var(--color-primary-700);
  color: #fff;
  transform: translateY(-200%);
  transition: transform 0.2s ease;
}

.app-layout__skip:focus-visible {
  transform: translateY(0);
}
</style>
