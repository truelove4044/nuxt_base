<template>
  <section class="base-card">
    <slot />
  </section>
</template>

<style scoped>
.base-card {
  border: 1px solid color-mix(in srgb, var(--color-border) 92%, #ffffff);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
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
    box-shadow: var(--shadow-card-hover);
  }
}
</style>
