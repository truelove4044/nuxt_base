import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref(null);
    const user = ref(null);
    const isLoading = ref(false);
    const hydrated = ref(false);
    const tokenCookie = useCookie("auth_token", {
      sameSite: "lax",
      path: "/",
    });
    const isAuthenticated = computed(() => Boolean(token.value));

    function syncCookie() {
      tokenCookie.value = token.value || null;
    }

    function hydrate() {
      if (hydrated.value) {
        syncCookie();
        return;
      }

      hydrated.value = true;
      isLoading.value = true;

      try {
        if (!token.value && tokenCookie.value) {
          token.value = tokenCookie.value;
        }

        syncCookie();
      } finally {
        isLoading.value = false;
      }
    }

    function setAuth(payload) {
      token.value = payload?.accessToken || null;
      user.value = payload?.user || null;
      isLoading.value = false;
      syncCookie();
    }

    function clearAuth() {
      token.value = null;
      user.value = null;
      isLoading.value = false;
      syncCookie();
    }

    return {
      token,
      user,
      isLoading,
      isAuthenticated,
      hydrate,
      setAuth,
      clearAuth,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ["token", "user"],
    },
  },
);
