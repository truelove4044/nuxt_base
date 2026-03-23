<template>
  <main id="main-content" class="forgot-page">
    <BaseCard class="forgot-page__card">
      <p class="forgot-page__eyebrow">Password Help</p>
      <h1 class="forgot-page__title">忘記密碼</h1>
      <p class="forgot-page__text">
        目前先保留為支援入口。正式串接時可在這裡加入寄送重設信、OTP 或管理員審核流程。
      </p>
      <div class="forgot-page__notice">
        <p>建議後續流程：</p>
        <ul>
          <li>輸入帳號或電子郵件後送出重設申請</li>
          <li>以 email 驗證連結或單次驗證碼完成身份確認</li>
          <li>重設完成後自動返回登入頁並帶成功提示</li>
        </ul>
      </div>
      <NuxtLink class="forgot-page__link" to="/login">返回登入頁</NuxtLink>
    </BaseCard>
  </main>
</template>

<script setup>
definePageMeta({
  layout: "default",
});
</script>

<style scoped>
.forgot-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: var(--space-8) var(--space-5);
}

.forgot-page__card {
  width: min(100%, 560px);
  padding: var(--space-6);
}

.forgot-page__eyebrow {
  color: var(--color-accent);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.forgot-page__title {
  margin-top: var(--space-3);
  font-size: var(--text-2xl);
  line-height: 34px;
}

.forgot-page__text {
  margin-top: var(--space-4);
  color: var(--color-text-muted);
}

.forgot-page__notice {
  margin-top: var(--space-6);
  padding: var(--space-5);
  border-radius: 20px;
  background: var(--color-surface-muted);
  color: var(--color-text);
}

.forgot-page__notice p {
  font-weight: 600;
}

.forgot-page__notice ul {
  padding-left: 1.25rem;
  margin: var(--space-3) 0 0;
  color: var(--color-text-muted);
}

.forgot-page__notice li + li {
  margin-top: var(--space-2);
}

.forgot-page__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: var(--space-6);
  padding: var(--space-3) var(--space-4);
  border-radius: 999px;
  background: var(--color-primary-600);
  color: #fff;
  font-weight: 600;
}

@media (min-width: 768px) {
  .forgot-page__card {
    padding: var(--space-10);
  }
}
</style>
