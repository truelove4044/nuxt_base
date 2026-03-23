<template>
  <section class="base-card">
    <slot />
  </section>
</template>

<style scoped>
.base-card {
  border: 1px solid rgba(215, 222, 211, 0.92);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(16px);
}

@media (hover: hover) and (pointer: fine) {
  .base-card {
    transition:
      transform 0.24s ease,
      box-shadow 0.24s ease;
  }

  .base-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 24px 72px rgba(24, 35, 26, 0.1);
  }
}
</style>
