import { computed, ref } from "vue";
import { defineStore } from "pinia";

const STORAGE_KEY = "auth_state";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(null);
  const user = ref(null);
  const hydrated = ref(false);
  const tokenCookie = useCookie("auth_token", {
    sameSite: "lax",
    path: "/",
  });
  const isAuthenticated = computed(() => Boolean(token.value));

  function syncCookie() {
    tokenCookie.value = token.value || null;
  }

  function persist() {
    syncCookie();

    if (!import.meta.client) {
      return;
    }

    if (!token.value) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: token.value,
        user: user.value,
      }),
    );
  }

  function hydrate() {
    if (hydrated.value) {
      return;
    }

    hydrated.value = true;

    if (import.meta.client) {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          token.value = parsed?.token || null;
          user.value = parsed?.user || null;
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }

    if (!token.value && tokenCookie.value) {
      token.value = tokenCookie.value;
    }

    syncCookie();
  }

  function setAuth(payload) {
    token.value = payload?.accessToken || null;
    user.value = payload?.user || null;
    persist();
  }

  function clearAuth() {
    token.value = null;
    user.value = null;
    persist();
  }

  return {
    token,
    user,
    isAuthenticated,
    hydrate,
    setAuth,
    clearAuth,
  };
});
