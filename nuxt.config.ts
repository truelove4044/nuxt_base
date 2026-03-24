// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "@vuepic/vue-datepicker/dist/main.css"],
  ssr: false,
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },

  modules: [
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/eslint",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],
  fonts: {
    families: [
      {
        name: "Manrope",
        provider: "google",
        weights: ["400", "500", "600", "700"],
        global: true,
      },
      {
        name: "Noto Sans TC",
        provider: "google",
        weights: ["400", "500", "600", "700"],
        global: true,
      },
    ],
  },
});
