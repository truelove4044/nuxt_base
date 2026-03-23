import { defineStore } from "pinia";

export const usePageStore = defineStore("pageStore", {
  state: () => ({
    token: null,
  }),
  actions: {},
  persist: import.meta.client
    ? {
        storage: sessionStorage,
        paths: ["token"],
      }
    : false,
});
