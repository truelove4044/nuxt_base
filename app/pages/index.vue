<template>
  <main id="main-content" class="home-page">
    <BaseCard class="home-page__card">
      <p class="home-page__eyebrow">Admin Home</p>
      <h1 class="home-page__title">登入成功後會先抵達這個首頁示意頁。</h1>
      <p class="home-page__text">
        目前專案已接上示範登入流程、全域設計 token 與可重用表單元件。之後可在這裡接上真正的儀表板或路由守衛。
      </p>
      <div class="home-page__actions">
        <button
          class="home-page__link home-page__link--primary"
          type="button"
          @click="handleLogout"
        >
          登出
        </button>
        <NuxtLink class="home-page__link" to="/forgot-password">
          忘記密碼頁
        </NuxtLink>
      </div>
    </BaseCard>
  </main>
</template>

<script setup>
  const authStore = useAuthStore();

  definePageMeta({
    layout: "default",
  });

  async function handleLogout() {
    authStore.clearAuth();
    await navigateTo("/login", { replace: true });
  }
</script>

<style scoped>
.home-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: var(--space-8) var(--space-5);
}

.home-page__card {
  width: min(100%, 720px);
  padding: var(--space-6);
}

.home-page__eyebrow {
  color: var(--color-accent);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.home-page__title {
  margin-top: var(--space-3);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  line-height: 1.15;
}

.home-page__text {
  margin-top: var(--space-4);
  color: var(--color-text-muted);
}

.home-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.home-page__link {
  cursor: pointer;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 500;
}

.home-page__link--primary {
  border-color: transparent;
  background: var(--color-primary-600);
  color: #fff;
}

@media (min-width: 768px) {
  .home-page__card {
    padding: var(--space-10);
  }
}
</style>
