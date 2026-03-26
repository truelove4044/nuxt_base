import { ref } from "vue";
import { defineStore } from "pinia";

export const useGlobalDialogStore = defineStore("globalDialog", () => {
  const isOpen = ref(false);
  const title = ref("");
  const content = ref("");
  const articles = ref([]);
  const isLoading = ref(false);
  const error = ref("");

  function openDialog(payload = {}) {
    const {
      title: nextTitle,
      content: nextContent,
      articles: nextArticles,
      isLoading: nextLoading,
      error: nextError,
    } = payload;

    if (typeof nextTitle === "string") {
      title.value = nextTitle;
    }

    if (typeof nextContent === "string") {
      content.value = nextContent;
    }

    if (Array.isArray(nextArticles)) {
      articles.value = nextArticles;
    }

    if (typeof nextLoading === "boolean") {
      isLoading.value = nextLoading;
    }

    if (typeof nextError === "string") {
      error.value = nextError;
    }

    isOpen.value = true;
  }

  function closeDialog() {
    isOpen.value = false;
  }

  function setLoading(value) {
    isLoading.value = Boolean(value);
  }

  function setError(message = "") {
    error.value = message;
  }

  function setContent(value = "") {
    content.value = value;
  }

  function setArticles(value = []) {
    articles.value = Array.isArray(value) ? value : [];
  }

  function setTitle(value = "") {
    title.value = value;
  }

  return {
    isOpen,
    title,
    content,
    articles,
    isLoading,
    error,
    openDialog,
    closeDialog,
    setLoading,
    setError,
    setContent,
    setArticles,
    setTitle,
  };
});
