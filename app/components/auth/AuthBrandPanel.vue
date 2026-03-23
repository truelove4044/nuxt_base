<template>
  <section class="auth-brand-panel">
    <AuthBrandParticles />
    <div class="auth-brand-panel__content">
      <img
        class="auth-brand-panel__logo"
        src="/logo.svg"
        alt="品牌識別"
        width="1938"
        height="321"
      />
      <p class="auth-brand-panel__eyebrow">{{ eyebrow }}</p>
      <h1 class="auth-brand-panel__title">{{ title }}</h1>
      <p class="auth-brand-panel__description">{{ description }}</p>
    </div>
  </section>
</template>

<script setup>
  defineProps({
    eyebrow: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  });
</script>

<style scoped>
  .auth-brand-panel {
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: center;
    min-height: 100%;
    padding: var(--space-8) var(--space-5) var(--space-6);
    color: rgba(255, 255, 255, 0.92);
  }

  .auth-brand-panel::before,
  .auth-brand-panel::after {
    position: absolute;
    border-radius: 999px;
    content: "";
    filter: blur(12px);
    pointer-events: none;
  }

  .auth-brand-panel::before {
    top: -72px;
    left: -72px;
    width: 240px;
    height: 240px;
    background: rgba(182, 138, 82, 0.18);
  }

  .auth-brand-panel::after {
    right: -120px;
    bottom: -100px;
    width: 280px;
    height: 280px;
    background: rgba(255, 255, 255, 0.08);
  }

  .auth-brand-panel__content {
    position: relative;
    z-index: 1;
    display: grid;
    gap: var(--space-4);
    width: min(100%, 560px);
  }

  .auth-brand-panel__logo {
    width: min(260px, 65vw);
    height: auto;
    filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.14));
  }

  .auth-brand-panel__eyebrow {
    color: rgba(236, 241, 232, 0.82);
    font-size: var(--text-sm);
    line-height: 20px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .auth-brand-panel__title {
    max-width: 12ch;
    color: #fff;
    font-size: clamp(2rem, 4vw, 3.5rem);
    line-height: 1.08;
  }

  .auth-brand-panel__description {
    max-width: 34ch;
    color: rgba(255, 255, 255, 0.78);
    font-size: var(--text-base);
    line-height: 24px;
  }

  .auth-brand-panel__list {
    display: none;
    gap: var(--space-4);
    padding: 0;
    margin: var(--space-2) 0 0;
    list-style: none;
  }

  .auth-brand-panel__item {
    display: grid;
    grid-template-columns: 12px 1fr;
    gap: var(--space-3);
    align-items: start;
  }

  .auth-brand-panel__dot {
    width: 12px;
    height: 12px;
    margin-top: 6px;
    border-radius: 999px;
    background: radial-gradient(
      circle at 35% 35%,
      #f3dfb9 0%,
      #d4a86b 45%,
      rgba(212, 168, 107, 0.3) 100%
    );
    box-shadow: 0 0 0 6px rgba(212, 168, 107, 0.08);
  }

  .auth-brand-panel__item-title {
    color: #fff;
    font-size: var(--text-base);
    font-weight: 600;
    line-height: 24px;
  }

  .auth-brand-panel__item-text {
    margin-top: var(--space-1);
    color: rgba(255, 255, 255, 0.72);
    font-size: var(--text-sm);
    line-height: 20px;
  }

  @media (min-width: 768px) {
    .auth-brand-panel {
      padding: var(--space-12) var(--space-8);
    }
  }

  @media (min-width: 1024px) {
    .auth-brand-panel {
      padding: var(--space-16) var(--space-12);
    }

    .auth-brand-panel__list {
      display: grid;
    }
  }
</style>
