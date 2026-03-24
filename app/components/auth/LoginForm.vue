<template>
  <form class="login-form" novalidate @submit.prevent="emit('submit')">
    <div
      v-if="formError"
      class="login-form__alert"
      role="alert"
      aria-live="polite"
    >
      {{ formError }}
    </div>

    <BaseInput
      ref="accountInput"
      :model-value="account"
      label="帳號"
      autocomplete="username"
      inputmode="email"
      placeholder="admin@example.com"
      :error="accountError"
      :disabled="pending"
      @update:model-value="emit('update:account', $event)"
      @blur="emit('blur:account', $event)"
    />

    <BaseInput
      ref="passwordInput"
      :model-value="password"
      label="密碼"
      :type="showPassword ? 'text' : 'password'"
      autocomplete="current-password"
      placeholder="Admin123!"
      :error="passwordError"
      :disabled="pending"
      @update:model-value="emit('update:password', $event)"
      @blur="emit('blur:password', $event)"
    >
      <template #suffix>
        <button
          class="login-form__toggle"
          type="button"
          :disabled="pending"
          :aria-label="showPassword ? '隱藏密碼' : '顯示密碼'"
          :aria-pressed="showPassword"
          @click="showPassword = !showPassword"
        >
          <Icon
            class="login-form__toggle-icon"
            :name="
              showPassword
                ? 'heroicons:eye-slash-20-solid'
                : 'heroicons:eye-20-solid'
            "
            aria-hidden="true"
          />
        </button>
      </template>
    </BaseInput>

    <div class="login-form__actions">
      <NuxtLink class="login-form__link" to="/forgot-password">
        忘記密碼？
      </NuxtLink>
    </div>

    <BaseButton type="submit" :pending="pending" pending-label="登入中…">
      登入後台
    </BaseButton>

    <p class="login-form__footer">
      登入即代表您同意遵循內部資料安全與操作規範。
    </p>
  </form>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  pending: {
    type: Boolean,
    default: false,
  },
  formError: {
    type: String,
    default: "",
  },
  account: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  accountError: {
    type: String,
    default: "",
  },
  passwordError: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "update:account",
  "update:password",
  "blur:account",
  "blur:password",
  "submit",
]);
const showPassword = ref(false);
const accountInput = ref(null);
const passwordInput = ref(null);

function focusField(field) {
  if (field === "password") {
    passwordInput.value?.focusInput();
    return;
  }

  accountInput.value?.focusInput();
}

defineExpose({
  focusField,
});
</script>

<style scoped>
.login-form {
  display: grid;
  gap: var(--space-4);
}

.login-form__alert {
  padding: var(--space-3) var(--space-4);
  border: 1px solid rgba(181, 69, 69, 0.2);
  border-radius: 16px;
  background: rgba(181, 69, 69, 0.08);
  color: var(--color-danger);
  font-size: var(--text-sm);
  line-height: 20px;
}

.login-form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: calc(var(--space-2) * -1);
}

.login-form__link {
  color: var(--color-primary-600);
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 20px;
}

.login-form__link:hover {
  color: var(--color-primary-700);
}

.login-form__link:focus-visible,
.login-form__toggle:focus-visible {
  outline: 0;
  border-radius: 999px;
  box-shadow: 0 0 0 4px rgba(142, 173, 146, 0.24);
}

.login-form__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  min-width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--color-primary-600);
  cursor: pointer;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.login-form__toggle:hover {
  color: var(--color-primary-700);
  background: rgba(var(--color-primary-600-rgb), 0.08);
}

.login-form__toggle-icon {
  width: 20px;
  height: 20px;
}

.login-form__toggle:disabled {
  color: var(--color-text-soft);
  background: transparent;
  cursor: not-allowed;
}

.login-form__footer {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  line-height: 20px;
}
</style>
