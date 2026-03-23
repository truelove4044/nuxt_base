<template>
  <section class="auth-brand-panel">
    <div class="auth-brand-panel__art-shell" aria-hidden="true">
      <div class="auth-brand-panel__art-glow" />
      <img
        class="auth-brand-panel__art-image"
        src="/login.png"
        alt=""
        width="800"
        height="800"
      />
    </div>
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
      <h2 class="auth-brand-panel__subtitle">{{ subtitle }}</h2>
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
    subtitle: {
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

  .auth-brand-panel__art-shell {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }

  .auth-brand-panel__art-shell::before {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(34, 46, 31, 0.65) 15%,
      rgba(34, 46, 31, 0.35) 40%,
      rgba(34, 46, 31, 0.12) 65%,
      rgba(34, 46, 31, 0.02) 95%,
      transparent 100%
    );
    content: "";
  }

  .auth-brand-panel__art-glow {
    position: absolute;
    right: 4%;
    bottom: 2%;
    width: min(38vw, 360px);
    aspect-ratio: 1;
    border-radius: 999px;
    background: radial-gradient(
      circle,
      rgba(130, 216, 78, 0.2) 0%,
      rgba(130, 216, 78, 0.04) 58%,
      transparent 76%
    );
    filter: blur(10px);
    opacity: 0.9;
  }

  .auth-brand-panel__art-image {
    position: absolute;
    right: -10%;
    bottom: -2%;
    width: min(46vw, 560px);
    height: auto;
    opacity: 0.85;
    object-fit: contain;
    filter: drop-shadow(0 22px 48px rgba(18, 25, 17, 0.34));
  }

  .auth-brand-panel::before,
  .auth-brand-panel::after {
    position: absolute;
    z-index: 2;
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
    background: rgba(238, 125, 59, 0.2);
  }

  .auth-brand-panel::after {
    right: -120px;
    bottom: -100px;
    width: 280px;
    height: 280px;
    background: rgba(130, 216, 78, 0.14);
  }

  .auth-brand-panel__content {
    position: relative;
    z-index: 3;
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
    color: rgba(255, 255, 255, 0.78);
    font-size: var(--text-sm);
    line-height: 20px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .auth-brand-panel__title {
    max-width: 12ch;
    color: #fff;
    font-size: clamp(2.4rem, 4.4vw, 3.75rem);
    line-height: 1.08;
  }

  .auth-brand-panel__subtitle {
    max-width: 17ch;
    color: rgba(255, 255, 255, 0.92);
    font-size: clamp(1.25rem, 2.2vw, 1.75rem);
    font-weight: 600;
    line-height: 1.18;
  }

  .auth-brand-panel__description {
    max-width: 42ch;
    color: rgba(255, 255, 255, 0.72);
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

    .auth-brand-panel__art-image {
      top: 50%;
      right: -5%;
      transform: translateY(-50%);
      width: min(44vw, 360px);
    }
  }

  @media (min-width: 1024px) {
    .auth-brand-panel {
      padding: var(--space-16) var(--space-12);
    }

    .auth-brand-panel__content {
      transform: translateY(-30%);
    }

    .auth-brand-panel__list {
      display: grid;
    }

    .auth-brand-panel__art-image {
      transform: none;
      top: auto;
      right: 0;
      bottom: 0;
      width: min(38vw, 500px);
    }
  }

  @media (max-width: 767px) {
    .auth-brand-panel__art-shell::before {
      background: linear-gradient(
        180deg,
        rgba(34, 46, 31, 0.34) 0%,
        rgba(34, 46, 31, 0.14) 100%
      );
    }

    .auth-brand-panel__art-glow {
      right: -12%;
      bottom: -10%;
      width: 220px;
      opacity: 0.72;
    }

    .auth-brand-panel__art-image {
      top: 50%;
      transform: translateY(-50%);
      right: -5%;
      width: 260px;
    }
  }

  @media (max-width: 520px) {
    .auth-brand-panel__art-image {
      display: none;
    }
  }
</style>
