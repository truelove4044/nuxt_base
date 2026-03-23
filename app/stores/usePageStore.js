import { defineStore } from "pinia";

export const usePageStore = defineStore("pageStore", {
  state: () => ({
    showLoading: false,
  }),
  actions: {},
});
