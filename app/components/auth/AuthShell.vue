<template>
  <section class="auth-shell">
    <div class="auth-shell__brand">
      <slot name="brand" />
    </div>
    <main id="main-content" class="auth-shell__content">
      <slot />
    </main>
  </section>
</template>

<style scoped>
.auth-shell {
  display: grid;
  min-height: 100dvh;
}

.auth-shell__brand {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(130, 216, 78, 0.18), transparent 30%),
    radial-gradient(circle at bottom right, rgba(238, 125, 59, 0.12), transparent 28%),
    linear-gradient(160deg, #33432d 0%, #42543a 48%, #55684d 100%);
}

.auth-shell__content {
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: var(--space-10) var(--space-5);
}

@media (min-width: 768px) {
  .auth-shell__content {
    padding: var(--space-12) var(--space-8);
  }
}

@media (min-width: 1024px) {
  .auth-shell {
    grid-template-columns: minmax(0, 58fr) minmax(0, 42fr);
  }

  .auth-shell__content {
    padding: var(--space-12) var(--space-8);
  }
}
</style>
