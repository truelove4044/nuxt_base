function onResponse(context) {
  const { response } = context;
}

function onResponseError({ response }) {
  if (response.status === 403) {
    // const userStore = useUserStore()
    // const pageStore = usePageStore()

    // userStore.token = null
    // userStore.userInfo = {}
    // pageStore.loginType = null

    navigateTo("/", { replace: true });
  }
}

/**
 * 適用於伺服器端的 API 請求。
 * 不需要伺服器端渲染的 API 請求，請使用 useClientFetch
 * See docs: https://nuxt.com/docs/getting-started/data-fetching#return-values
 */
export const useServerFetch = (request, opts) => {
  const { origin } = useRequestURL();

  // let token
  // if (process.client) {
  //   const userStore = useUserStore()
  //   token = userStore.token
  // }

  return useFetch(request, {
    baseURL: origin,
    credentials: "include", // 包含 cookie
    headers: {
      ...opts?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    onResponse,
    onResponseError,
    ...opts,
  });
};

/**
 * 適用於客戶端的 API 請求。
 */
export const useClientFetch = async (request, opts) => {
  const pageStore = usePageStore();
  // const userStore = useUserStore()
  // const token = userStore.token

  // 顯示載入動畫
  pageStore.showLoading = true;

  try {
    const result = await $fetch(request, {
      ...opts,
      headers: {
        ...opts?.headers,
        // ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      credentials: "include",
      onResponse,
      onResponseError,
    });
    return result;
  } catch (error) {
    throw error;
  } finally {
    pageStore.showLoading = false;
  }
};
