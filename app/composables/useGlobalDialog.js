import { storeToRefs } from "pinia";

export const useGlobalDialog = () => {
  const dialogStore = useGlobalDialogStore();
  const { isOpen, title, content, articles, isLoading, error } = storeToRefs(dialogStore);

  return {
    isOpen,
    title,
    content,
    articles,
    isLoading,
    error,
    openDialog: dialogStore.openDialog,
    closeDialog: dialogStore.closeDialog,
    setLoading: dialogStore.setLoading,
    setError: dialogStore.setError,
    setContent: dialogStore.setContent,
    setArticles: dialogStore.setArticles,
    setTitle: dialogStore.setTitle,
  };
};
