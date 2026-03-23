function createOnResponse(handler) {
  return async (context) => {
    if (typeof handler === "function") {
      await handler(context);
    }
  };
}

function createOnResponseError(handler, { skipAuthRedirectOn401 = false } = {}) {
  return async (context) => {
    if (typeof handler === "function") {
      await handler(context);
    }

    if (skipAuthRedirectOn401) {
      return;
    }

    if (context.response.status === 401) {
      const authStore = useAuthStore();

      authStore.clearAuth();
      await navigateTo("/login", { replace: true });
    }
  };
}

/**
 * 適用於伺服器端的 API 請求。
 * 不需要伺服器端渲染的 API 請求，請使用 useClientFetch
 * See docs: https://nuxt.com/docs/getting-started/data-fetching#return-values
 */
export const useServerFetch = (request, opts) => {
  const { origin } = useRequestURL();
  const authStore = useAuthStore();
  const {
    baseURL = origin,
    credentials = "include",
    headers: customHeaders,
    onResponse,
    onResponseError,
    ...fetchOptions
  } = opts ?? {};

  authStore.hydrate();

  return useFetch(request, {
    ...fetchOptions,
    baseURL,
    credentials, // 包含 cookie
    headers: {
      ...customHeaders,
      ...(authStore.token
        ? { Authorization: `Bearer ${authStore.token}` }
        : {}),
    },
    onResponse: createOnResponse(onResponse),
    onResponseError: createOnResponseError(onResponseError),
  });
};

/**
 * 適用於客戶端的 API 請求。
 */
export const useClientFetch = async (request, opts) => {
  const pageStore = usePageStore();
  const authStore = useAuthStore();
  const {
    skipAuthRedirectOn401 = false,
    headers: customHeaders,
    onResponse,
    onResponseError,
    ...fetchOptions
  } = opts ?? {};

  authStore.hydrate();

  // 顯示載入動畫
  pageStore.showLoading = true;

  try {
    const result = await $fetch(request, {
      ...fetchOptions,
      headers: {
        ...customHeaders,
        ...(authStore.token
          ? { Authorization: `Bearer ${authStore.token}` }
          : {}),
      },
      credentials: "include",
      onResponse: createOnResponse(onResponse),
      onResponseError: createOnResponseError(onResponseError, {
        skipAuthRedirectOn401,
      }),
    });
    return result;
  } catch (error) {
    throw error;
  } finally {
    pageStore.showLoading = false;
  }
};
