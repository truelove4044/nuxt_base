export default defineNuxtPlugin(() => {
  addRouteMiddleware(
    "auth-guard",
    (to) => {
      if (to.path === "/forgot-password") {
        return;
      }

      const authStore = useAuthStore();
      authStore.hydrate();

      if (to.path === "/login" && authStore.isAuthenticated) {
        return navigateTo("/");
      }

      if (to.path === "/" && !authStore.isAuthenticated) {
        return navigateTo("/login");
      }
    },
    { global: true },
  );
});
