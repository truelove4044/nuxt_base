<template>
  <AuthShell>
    <template #brand>
      <AuthBrandPanel
        eyebrow="Administration Portal"
        title="系統資料屬馥華全球電商機密文件"
        description="未經授權，禁止複製、轉錄或攝影等其他洩密行為。"
      />
    </template>

    <div class="login-page__column">
      <BaseCard class="login-page__card">
        <div class="login-page__header">
          <p class="login-page__overline">Welcome back</p>
          <h2 class="login-page__title">登入管理後台</h2>
          <p class="login-page__description">
            請使用您的內部帳號與密碼登入。若超過 8
            秒未完成驗證，系統會提示您重新嘗試。
          </p>
        </div>

        <AuthLoginForm
          ref="loginFormRef"
          v-model="form"
          :pending="pending"
          :field-errors="fieldErrors"
          :form-error="formError"
          @submit="handleSubmit"
        />

        <div class="login-page__meta">
          <p class="login-page__support">
            需要重設密碼或開通權限，請聯絡系統管理員。
          </p>
          <p class="login-page__demo">
            示範環境帳密：
            <strong>admin@example.com</strong>
            /
            <strong>Admin123!</strong>
          </p>
        </div>
      </BaseCard>

      <p class="login-page__copyright">
        Copyright © Forwardmall. All rights reserved.
      </p>
    </div>
  </AuthShell>
</template>

<script setup>
  import { nextTick, ref } from "vue";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "後台登入",
    meta: [
      {
        name: "description",
        content: "Nuxt 3 後台登入頁，採深綠品牌語氣與清楚的表單互動狀態。",
      },
    ],
  });

  const loginFormRef = ref(null);
  const form = ref({
    account: "",
    password: "",
  });
  const pending = ref(false);
  const fieldErrors = ref({});
  const formError = ref("");

  function validateFields() {
    const errors = {};

    if (!form.value.account.trim()) {
      errors.account = "請輸入帳號。";
    }

    if (!form.value.password) {
      errors.password = "請輸入密碼。";
    }

    return errors;
  }

  function getErrorPayload(error) {
    return error?.data || error?.response?._data || {};
  }

  function isAbortError(error) {
    return (
      error?.name === "AbortError" ||
      error?.cause?.name === "AbortError" ||
      error?.message === "timeout"
    );
  }

  async function focusFirstInvalid(preferredField) {
    await nextTick();

    if (preferredField) {
      loginFormRef.value?.focusField(preferredField);
      return;
    }

    if (fieldErrors.value.account) {
      loginFormRef.value?.focusField("account");
      return;
    }

    if (fieldErrors.value.password) {
      loginFormRef.value?.focusField("password");
    }
  }

  async function handleSubmit() {
    if (pending.value) {
      return;
    }

    fieldErrors.value = validateFields();
    formError.value = "";

    if (Object.keys(fieldErrors.value).length > 0) {
      formError.value = "請先完成必填欄位。";
      await focusFirstInvalid();
      return;
    }

    pending.value = true;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("timeout"), 8000);

    try {
      const result = await $fetch("/api/auth/login", {
        method: "POST",
        body: form.value,
        signal: controller.signal,
      });

      await navigateTo(result.redirectTo || "/");
    } catch (error) {
      const payload = getErrorPayload(error);
      const statusCode =
        error?.statusCode || error?.status || error?.response?.status;

      if (isAbortError(error)) {
        formError.value = "登入逾時，請檢查網路狀態後重新嘗試。";
        return;
      }

      if (payload.fieldErrors) {
        fieldErrors.value = payload.fieldErrors;
      }

      if (statusCode === 401) {
        formError.value =
          payload.formError || "帳號或密碼錯誤，請重新確認後再試。";
        await focusFirstInvalid("account");
        return;
      }

      if (statusCode === 400) {
        formError.value = payload.formError || "請修正欄位內容後再試。";
        await focusFirstInvalid();
        return;
      }

      formError.value = "目前無法登入，請稍後再試。";
    } finally {
      clearTimeout(timeoutId);
      pending.value = false;
    }
  }
</script>

<style scoped>
  .login-page__column {
    position: relative;
    display: flex;
    align-items: center;
    width: min(100%, 440px);
    min-height: 100%;
  }

  .login-page__card {
    width: 100%;
    padding: var(--space-6);
    align-self: center;
  }

  .login-page__header {
    display: grid;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }

  .login-page__overline {
    color: var(--color-accent);
    font-size: var(--text-sm);
    font-weight: 600;
    line-height: 20px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .login-page__title {
    font-size: var(--text-2xl);
    line-height: 34px;
  }

  .login-page__description,
  .login-page__support,
  .login-page__demo {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    line-height: 20px;
  }

  .login-page__meta {
    display: grid;
    gap: var(--space-2);
    margin-top: var(--space-6);
    padding-top: var(--space-5);
    border-top: 1px solid rgba(215, 222, 211, 0.9);
  }

  .login-page__demo strong {
    color: var(--color-text);
    font-weight: 600;
  }

  .login-page__copyright {
    margin-top: var(--space-5);
    color: var(--color-text-soft);
    font-size: var(--text-xs);
    line-height: 18px;
    text-align: center;
  }

  @media (min-width: 768px) {
    .login-page__card {
      padding: var(--space-10);
    }

    .login-page__copyright {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 100%;
      padding-top: 0;
      transform: translateX(-50%);
    }
  }
</style>
