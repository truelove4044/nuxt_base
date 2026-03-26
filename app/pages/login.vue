<template>
  <AuthShell>
    <template #brand>
      <AuthBrandPanel
        eyebrow="Administration Portal"
        title="馥華營運管理系統"
        subtitle="系統資料屬馥華全球電商機密文件"
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
          v-model:account="account"
          v-model:password="password"
          :account-error="accountError"
          :password-error="passwordError"
          :pending="pending"
          :form-error="formError"
          @blur:account="handleAccountBlur"
          @blur:password="handlePasswordBlur"
          @credential-copy="handleCredentialCopy"
          @submit="handleSubmit"
        />

        <div class="login-page__meta">
          <p class="login-page__support">
            需要重設密碼或開通權限，請聯絡系統管理員。
          </p>
        </div>
      </BaseCard>

      <p class="login-page__copyright">
        Copyright © Forwardmall. All rights reserved.
      </p>
    </div>

    <Transition name="login-copy-toast">
      <div
        v-if="copyToast.visible"
        class="login-copy-toast"
        :class="`login-copy-toast--${copyToast.type}`"
        role="status"
        aria-live="polite"
      >
        {{ copyToast.message }}
      </div>
    </Transition>
  </AuthShell>
</template>

<script setup>
  import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
  import { useField, useForm } from "vee-validate";
  import * as yup from "yup";

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

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validationSchema = yup.object({
    account: yup
      .string()
      .trim()
      .required("請輸入帳號。")
      .matches(EMAIL_PATTERN, "請輸入有效的電子郵件地址。"),
    password: yup
      .string()
      .required("請輸入密碼。")
      .min(6, "密碼至少需要 6 碼。"),
  });

  const loginFormRef = ref(null);
  const authStore = useAuthStore();
  const pending = computed({
    get: () => authStore.isLoading,
    set: (value) => {
      authStore.isLoading = value;
    },
  });
  const formError = ref("");
  const copyToast = ref({
    visible: false,
    type: "success",
    message: "",
  });
  let copyToastTimerId = null;

  const { handleSubmit: withValidation, setErrors } = useForm({
    validationSchema,
    initialValues: {
      account: "",
      password: "",
    },
  });

  const {
    value: account,
    errorMessage: accountError,
    handleBlur: handleAccountBlur,
  } = useField("account", undefined, {
    validateOnValueUpdate: true,
  });

  const {
    value: password,
    errorMessage: passwordError,
    handleBlur: handlePasswordBlur,
  } = useField("password", undefined, {
    validateOnValueUpdate: true,
  });

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

    if (preferredField === "account") {
      loginFormRef.value?.focusField("account");
      return;
    }

    if (preferredField === "password") {
      loginFormRef.value?.focusField("password");
      return;
    }

    loginFormRef.value?.focusField("account");
  }

  const submitLogin = withValidation(async (values) => {
    if (pending.value) {
      return;
    }

    formError.value = "";
    pending.value = true;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("timeout"), 8000);

    try {
      const result = await useClientFetch("/api/login", {
        method: "POST",
        body: values,
        signal: controller.signal,
        skipAuthRedirectOn401: true,
      });

      authStore.setAuth(result);
      await navigateTo("/");
    } catch (error) {
      const payload = getErrorPayload(error);
      const statusCode =
        error?.statusCode || error?.status || error?.response?.status;

      if (isAbortError(error)) {
        formError.value = "登入逾時，請檢查網路狀態後重新嘗試。";
        return;
      }

      if (payload.fieldErrors) {
        setErrors(payload.fieldErrors);
        formError.value = payload.formError || "請修正欄位內容後再試。";
        await focusFirstInvalid(Object.keys(payload.fieldErrors)[0]);
        return;
      }

      if (statusCode === 401) {
        formError.value =
          payload.formError || payload.message || "帳號或密碼錯誤。";
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
  }, async ({ errors }) => {
    formError.value = "請修正欄位內容後再試。";
    await focusFirstInvalid(Object.keys(errors)[0]);
  });

  async function handleSubmit() {
    if (pending.value) {
      return;
    }

    await submitLogin();
  }

  function clearCopyToastTimer() {
    if (copyToastTimerId !== null) {
      clearTimeout(copyToastTimerId);
      copyToastTimerId = null;
    }
  }

  function showCopyToast(message, type) {
    clearCopyToastTimer();
    copyToast.value = {
      visible: true,
      type,
      message,
    };
    copyToastTimerId = setTimeout(() => {
      copyToast.value.visible = false;
      copyToastTimerId = null;
    }, 1800);
  }

  function handleCredentialCopy(payload) {
    if (payload?.success) {
      const label = payload.field === "password" ? "密碼" : "帳號";
      showCopyToast(`已複製測試${label}`, "success");
      return;
    }

    showCopyToast("無法複製到剪貼簿，請手動複製。", "error");
  }

  watch([account, password], () => {
    if (formError.value) {
      formError.value = "";
    }
  });

  onBeforeUnmount(() => {
    clearCopyToastTimer();
  });
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
  .login-page__support {
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

  .login-page__copyright {
    margin-top: var(--space-5);
    color: var(--color-text-soft);
    font-size: var(--text-xs);
    line-height: 18px;
    text-align: center;
  }

  .login-copy-toast {
    position: fixed;
    top: var(--space-5);
    right: var(--space-5);
    z-index: 1200;
    max-width: min(92vw, 320px);
    padding: 10px 14px;
    border: 1px solid transparent;
    border-radius: 12px;
    font-size: var(--text-sm);
    font-weight: 600;
    line-height: 20px;
    box-shadow: 0 16px 38px rgba(0, 0, 0, 0.18);
  }

  .login-copy-toast--success {
    color: #1d5220;
    border-color: rgba(90, 164, 69, 0.32);
    background: rgba(90, 164, 69, 0.16);
  }

  .login-copy-toast--error {
    color: #7f2d2d;
    border-color: rgba(var(--color-danger-rgb), 0.34);
    background: rgba(var(--color-danger-rgb), 0.12);
  }

  .login-copy-toast-enter-active,
  .login-copy-toast-leave-active {
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }

  .login-copy-toast-enter-from,
  .login-copy-toast-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }

  @media (min-width: 768px) {
    .login-page__card {
      padding: var(--space-10);
    }
  }

  @media (min-width: 1024px) {
    .login-page__copyright {
      position: absolute;
      bottom: -20px;
      left: 50%;
      width: 100%;
      padding-top: 0;
      transform: translateX(-50%);
    }
  }

  @media (max-width: 1023px) {
    .login-page__column {
      flex-direction: column;
    }

    .login-copy-toast {
      top: var(--space-4);
      right: var(--space-4);
    }
  }
</style>
