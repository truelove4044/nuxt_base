<template>
  <section class="auth-brand-panel">
    <div class="auth-brand-panel__decor" aria-hidden="true">
      <div class="auth-brand-panel__grid"></div>
      <div class="auth-brand-panel__scanline"></div>

      <div class="auth-brand-panel__cluster auth-brand-panel__cluster--north">
        <span class="auth-brand-panel__node auth-brand-panel__node--anchor"></span>
        <span class="auth-brand-panel__node auth-brand-panel__node--minor"></span>
        <span class="auth-brand-panel__node auth-brand-panel__node--minor"></span>
      </div>

      <div class="auth-brand-panel__cluster auth-brand-panel__cluster--south">
        <span class="auth-brand-panel__node auth-brand-panel__node--anchor"></span>
        <span class="auth-brand-panel__node auth-brand-panel__node--minor"></span>
        <span class="auth-brand-panel__node auth-brand-panel__node--minor"></span>
      </div>

      <div class="auth-brand-panel__hud auth-brand-panel__hud--primary">
        <p class="auth-brand-panel__hud-label">System Signal</p>
        <p class="auth-brand-panel__hud-value">98.4%</p>
        <p class="auth-brand-panel__hud-meta">Secure channel stable</p>
      </div>

      <div class="auth-brand-panel__hud auth-brand-panel__hud--secondary">
        <p class="auth-brand-panel__hud-label">Access Nodes</p>
        <p class="auth-brand-panel__hud-value">24</p>
        <p class="auth-brand-panel__hud-meta">Synced across teams</p>
      </div>

      <span class="auth-brand-panel__pulse auth-brand-panel__pulse--one"></span>
      <span class="auth-brand-panel__pulse auth-brand-panel__pulse--two"></span>
    </div>

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

      <ul v-if="items.length" class="auth-brand-panel__list">
        <li
          v-for="item in items"
          :key="item.title"
          class="auth-brand-panel__item"
        >
          <span class="auth-brand-panel__dot"></span>
          <div>
            <p class="auth-brand-panel__item-title">{{ item.title }}</p>
            <p class="auth-brand-panel__item-text">{{ item.text }}</p>
          </div>
        </li>
      </ul>
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
  items: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.auth-brand-panel {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100%;
  padding: var(--space-8) var(--space-5) var(--space-6);
  color: rgba(255, 255, 255, 0.92);
  isolation: isolate;
}

.auth-brand-panel::before,
.auth-brand-panel::after {
  position: absolute;
  border-radius: 999px;
  content: "";
  pointer-events: none;
}

.auth-brand-panel::before {
  top: -72px;
  left: -72px;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(182, 138, 82, 0.26) 0%, rgba(182, 138, 82, 0.02) 72%);
  filter: blur(14px);
}

.auth-brand-panel::after {
  right: -140px;
  bottom: -120px;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(93, 138, 99, 0.24) 0%, rgba(255, 255, 255, 0.02) 74%);
  filter: blur(18px);
}

.auth-brand-panel__decor {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.auth-brand-panel__grid,
.auth-brand-panel__scanline,
.auth-brand-panel__cluster,
.auth-brand-panel__hud,
.auth-brand-panel__pulse {
  position: absolute;
}

.auth-brand-panel__grid {
  inset: 8% 6%;
  border: 1px solid rgba(236, 241, 232, 0.07);
  border-radius: 28px;
  background-image:
    linear-gradient(rgba(236, 241, 232, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(236, 241, 232, 0.05) 1px, transparent 1px);
  background-size: 22px 22px;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 0 80px rgba(24, 35, 26, 0.18);
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.22));
}

.auth-brand-panel__scanline {
  top: 18%;
  left: 10%;
  width: 46%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(220, 232, 220, 0.5) 25%, rgba(182, 138, 82, 0.55) 50%, transparent 100%);
  box-shadow: 0 0 18px rgba(220, 232, 220, 0.12);
  animation: brand-scan 9s ease-in-out infinite;
}

.auth-brand-panel__cluster {
  width: 220px;
  height: 120px;
}

.auth-brand-panel__cluster::before,
.auth-brand-panel__cluster::after {
  position: absolute;
  background: linear-gradient(90deg, rgba(220, 232, 220, 0.08), rgba(220, 232, 220, 0.34));
  content: "";
}

.auth-brand-panel__cluster::before {
  top: 22px;
  left: 12px;
  width: 138px;
  height: 1px;
}

.auth-brand-panel__cluster::after {
  top: 22px;
  left: 138px;
  width: 1px;
  height: 58px;
}

.auth-brand-panel__cluster--north {
  top: 16%;
  right: 9%;
  animation: brand-float 8s ease-in-out infinite;
}

.auth-brand-panel__cluster--south {
  right: 12%;
  bottom: 22%;
  transform: scaleX(-1);
  opacity: 0.74;
  animation: brand-float-mirrored 10s ease-in-out infinite;
}

.auth-brand-panel__node {
  position: absolute;
  border-radius: 999px;
}

.auth-brand-panel__node--anchor {
  top: 16px;
  left: 0;
  width: 14px;
  height: 14px;
  background: radial-gradient(circle, #f3dfb9 0%, #d4a86b 55%, rgba(212, 168, 107, 0.1) 100%);
  box-shadow:
    0 0 0 6px rgba(182, 138, 82, 0.08),
    0 0 24px rgba(212, 168, 107, 0.26);
}

.auth-brand-panel__node--minor:nth-of-type(2) {
  top: 16px;
  left: 142px;
}

.auth-brand-panel__node--minor:nth-of-type(3) {
  top: 76px;
  left: 142px;
}

.auth-brand-panel__node--minor {
  width: 10px;
  height: 10px;
  background: radial-gradient(circle, rgba(220, 232, 220, 0.95) 0%, rgba(93, 138, 99, 0.76) 70%, rgba(93, 138, 99, 0.08) 100%);
  box-shadow: 0 0 18px rgba(142, 173, 146, 0.22);
}

.auth-brand-panel__hud {
  min-width: 160px;
  padding: var(--space-4);
  border: 1px solid rgba(236, 241, 232, 0.08);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(24, 35, 26, 0.12) 100%);
  backdrop-filter: blur(14px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 16px 40px rgba(12, 21, 14, 0.22);
}

.auth-brand-panel__hud--primary {
  top: 17%;
  left: 8%;
  animation: brand-float 11s ease-in-out infinite;
}

.auth-brand-panel__hud--secondary {
  right: 18%;
  bottom: 12%;
  min-width: 148px;
  animation: brand-float 9s ease-in-out infinite reverse;
}

.auth-brand-panel__hud-label,
.auth-brand-panel__hud-meta {
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.auth-brand-panel__hud-label {
  color: rgba(236, 241, 232, 0.55);
}

.auth-brand-panel__hud-value {
  margin-top: var(--space-2);
  color: #fff;
  font-family: "Manrope", "Noto Sans TC", sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.auth-brand-panel__hud-meta {
  margin-top: var(--space-2);
  color: rgba(236, 241, 232, 0.66);
}

.auth-brand-panel__pulse {
  border-radius: 999px;
  border: 1px solid rgba(220, 232, 220, 0.12);
}

.auth-brand-panel__pulse--one {
  top: 22%;
  right: 28%;
  width: 16px;
  height: 16px;
  background: rgba(93, 138, 99, 0.26);
  box-shadow: 0 0 0 0 rgba(93, 138, 99, 0.24);
  animation: brand-pulse 4.6s ease-out infinite;
}

.auth-brand-panel__pulse--two {
  bottom: 18%;
  left: 22%;
  width: 12px;
  height: 12px;
  background: rgba(182, 138, 82, 0.22);
  box-shadow: 0 0 0 0 rgba(182, 138, 82, 0.2);
  animation: brand-pulse 5.2s ease-out infinite 1.2s;
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
  background: radial-gradient(circle at 35% 35%, #f3dfb9 0%, #d4a86b 45%, rgba(212, 168, 107, 0.3) 100%);
  box-shadow:
    0 0 0 6px rgba(212, 168, 107, 0.08),
    0 0 18px rgba(212, 168, 107, 0.18);
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

@keyframes brand-scan {
  0%,
  100% {
    transform: translate3d(-2%, 0, 0);
    opacity: 0.38;
  }

  50% {
    transform: translate3d(76%, 0, 0);
    opacity: 0.7;
  }
}

@keyframes brand-float {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, -8px, 0);
  }
}

@keyframes brand-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(220, 232, 220, 0.18);
    opacity: 0.4;
  }

  70% {
    box-shadow: 0 0 0 16px rgba(220, 232, 220, 0);
    opacity: 0.85;
  }

  100% {
    box-shadow: 0 0 0 0 rgba(220, 232, 220, 0);
    opacity: 0.3;
  }
}

@keyframes brand-float-mirrored {
  0%,
  100% {
    transform: scaleX(-1) translate3d(0, 0, 0);
  }

  50% {
    transform: scaleX(-1) translate3d(0, -8px, 0);
  }
}

@media (max-width: 767px) {
  .auth-brand-panel__hud,
  .auth-brand-panel__cluster--south,
  .auth-brand-panel__pulse--two {
    display: none;
  }

  .auth-brand-panel__grid {
    inset: 10% 8%;
    opacity: 0.78;
  }

  .auth-brand-panel__cluster--north {
    top: auto;
    right: -24px;
    bottom: -10px;
    transform: scale(0.8);
    opacity: 0.5;
  }
}

@media (min-width: 768px) {
  .auth-brand-panel {
    padding: var(--space-12) var(--space-8);
  }
}

@media (max-width: 1023px) {
  .auth-brand-panel__hud--secondary,
  .auth-brand-panel__pulse--two {
    display: none;
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
