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
    radial-gradient(circle at top, rgba(182, 138, 82, 0.24), transparent 30%),
    linear-gradient(160deg, #28442d 0%, #35573a 45%, #47704c 100%);
}

.auth-shell__content {
  display: flex;
  align-items: center;
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
