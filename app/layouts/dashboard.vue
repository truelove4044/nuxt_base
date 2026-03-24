<template>
  <div class="dashboard-layout">
    <a class="dashboard-layout__skip" href="#main-content">跳到主要內容</a>

    <header class="dashboard-header">
      <div class="dashboard-header__leading">
        <button
          class="dashboard-header__menu-button"
          type="button"
          aria-label="開啟導覽選單"
          aria-controls="dashboard-sidebar"
          :aria-expanded="sidebarOpen ? 'true' : 'false'"
          @click="openSidebar"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
            />
          </svg>
        </button>

        <NuxtLink class="dashboard-header__brand" to="/" aria-label="ForwardMall">
          <img class="dashboard-header__brand-logo" src="/logo.svg" alt="ForwardMall" />
        </NuxtLink>
      </div>

      <div class="dashboard-header__user" aria-label="目前登入使用者">
        <span class="dashboard-header__avatar-wrap">
          <span class="dashboard-header__avatar">{{ userInitials }}</span>
          <span class="dashboard-header__presence" aria-hidden="true" />
        </span>
        <div class="dashboard-header__user-copy">
          <strong>{{ userName }}</strong>
          <span class="dashboard-header__user-meta">
            <small>{{ userRoleLabel }}</small>
            <button
              class="dashboard-header__logout"
              type="button"
              @click="handleLogout"
            >
              登出
            </button>
          </span>
        </div>
      </div>
    </header>

    <div
      v-if="sidebarOpen"
      class="dashboard-layout__scrim"
      aria-hidden="true"
      @click="closeSidebar"
    />

    <aside
      id="dashboard-sidebar"
      class="dashboard-sidebar"
      :class="{ 'dashboard-sidebar--open': sidebarOpen }"
      aria-label="後台導覽"
    >
      <div class="dashboard-sidebar__top">
        <div>
          <p class="dashboard-sidebar__eyebrow">Navigation</p>
          <p class="dashboard-sidebar__label">管理後台</p>
        </div>

        <button
          class="dashboard-sidebar__close"
          type="button"
          aria-label="關閉導覽選單"
          @click="closeSidebar"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
            />
          </svg>
        </button>
      </div>

      <nav class="dashboard-sidebar__nav">
        <p class="dashboard-sidebar__section-title">報表總覽</p>

        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          class="dashboard-sidebar__link"
          :class="{ 'dashboard-sidebar__link--active': item.to === route.path }"
          :to="item.to"
          @click="closeSidebar"
        >
          <span class="dashboard-sidebar__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                d="M5 19V9.5m7 9.5V5m7 14v-7"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
              />
            </svg>
          </span>
          <span class="dashboard-sidebar__link-copy">
            <strong>{{ item.label }}</strong>
            <small>{{ item.description }}</small>
          </span>
        </NuxtLink>
      </nav>
    </aside>

    <div class="dashboard-layout__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const route = useRoute();
const authStore = useAuthStore();

const sidebarOpen = ref(false);

const navItems = [
  {
    to: "/",
    label: "整體報表",
    description: "KPI、趨勢與月別明細",
  },
];

const userName = computed(() => authStore.user?.name || "管理者");

const userRoleLabel = computed(() => {
  const role = authStore.user?.role;

  if (role === "admin") {
    return "系統管理員";
  }

  return "營運後台";
});

const userInitials = computed(() => userName.value.slice(0, 1).toUpperCase());

function openSidebar() {
  sidebarOpen.value = true;
}

function closeSidebar() {
  sidebarOpen.value = false;
}

async function handleLogout() {
  closeSidebar();
  authStore.clearAuth();
  await navigateTo("/login", { replace: true });
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    closeSidebar();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

watch(
  () => route.path,
  () => {
    closeSidebar();
  },
);
</script>

<style scoped>
.dashboard-layout {
  --dashboard-header-height: 88px;
  min-height: 100dvh;
}

.dashboard-layout__skip {
  position: fixed;
  top: var(--space-4);
  left: var(--space-4);
  z-index: 80;
  padding: var(--space-2) var(--space-4);
  border-radius: 999px;
  background: var(--color-primary-700);
  color: #fff;
  transform: translateY(-200%);
  transition: transform 0.2s ease;
}

.dashboard-layout__skip:focus-visible {
  transform: translateY(0);
}

.dashboard-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  min-height: var(--dashboard-header-height);
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid rgba(196, 201, 186, 0.6);
  background: rgba(255, 254, 251, 0.94);
  backdrop-filter: blur(12px);
}

.dashboard-header__leading {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.dashboard-header__menu-button,
.dashboard-sidebar__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.dashboard-header__menu-button svg,
.dashboard-sidebar__close svg,
.dashboard-sidebar__icon svg {
  width: 20px;
  height: 20px;
}

.dashboard-header__brand {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.dashboard-header__brand-logo {
  display: block;
  width: auto;
  height: 28px;
}

.dashboard-sidebar__eyebrow,
.dashboard-sidebar__section-title {
  color: var(--color-accent);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dashboard-header__user {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
  padding-left: var(--space-4);
  border-left: 1px solid rgba(196, 201, 186, 0.72);
}

.dashboard-header__avatar-wrap {
  position: relative;
  display: inline-flex;
}

.dashboard-header__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(105, 186, 58, 0.12);
  color: var(--color-primary-700);
  font-family: "Manrope", "Noto Sans TC", sans-serif;
  font-weight: 800;
}

.dashboard-header__presence {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 10px;
  height: 10px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: var(--color-success);
}

.dashboard-header__user-copy {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.dashboard-header__user-copy strong {
  font-size: var(--text-sm);
  font-weight: 800;
}

.dashboard-header__user-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.dashboard-header__user-meta small {
  color: var(--color-text-muted);
  font-size: var(--text-xs);
}

.dashboard-header__logout {
  min-height: auto;
  padding: 0;
  background: transparent;
  color: var(--color-primary-700);
  font-size: var(--text-xs);
  font-weight: 700;
  cursor: pointer;
}

.dashboard-header__logout:hover,
.dashboard-header__logout:focus-visible {
  color: var(--color-accent);
}

.dashboard-layout__scrim {
  position: fixed;
  inset: 0;
  z-index: 39;
  background: rgba(89, 87, 87, 0.32);
  backdrop-filter: blur(4px);
}

.dashboard-sidebar {
  position: fixed;
  top: var(--dashboard-header-height);
  left: 0;
  z-index: 40;
  width: min(calc(100vw - 24px), 320px);
  height: calc(100dvh - var(--dashboard-header-height));
  padding: var(--space-5) var(--space-4);
  border-right: 1px solid rgba(196, 201, 186, 0.62);
  background: rgba(255, 254, 251, 0.98);
  transform: translateX(-110%);
  transition:
    transform 0.24s ease,
    visibility 0.24s ease;
  visibility: hidden;
}

.dashboard-sidebar--open {
  transform: translateX(0);
  visibility: visible;
}

.dashboard-sidebar__top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: var(--space-3);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid rgba(196, 201, 186, 0.58);
}

.dashboard-sidebar__label {
  margin-top: var(--space-2);
  font-family: "Manrope", "Noto Sans TC", sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
}

.dashboard-sidebar__nav {
  display: grid;
  align-content: start;
  gap: var(--space-3);
  padding-top: var(--space-5);
}

.dashboard-sidebar__link {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: var(--space-3);
  align-items: center;
  min-height: 56px;
  padding: 0 0 0 var(--space-3);
  border-left: 2px solid transparent;
  background: transparent;
  color: var(--color-text);
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease;
}

.dashboard-sidebar__link:hover,
.dashboard-sidebar__link:focus-visible {
  color: var(--color-primary-700);
}

.dashboard-sidebar__link--active {
  border-left-color: var(--color-primary-600);
  background: rgba(238, 248, 230, 0.48);
  color: var(--color-primary-700);
}

.dashboard-sidebar__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--color-primary-700);
}

.dashboard-sidebar__link-copy {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.dashboard-sidebar__link-copy strong {
  font-size: var(--text-base);
  font-weight: 700;
}

.dashboard-sidebar__link-copy small {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.dashboard-layout__content {
  min-width: 0;
  padding-top: var(--dashboard-header-height);
}

@media (max-width: 767px) {
  .dashboard-header {
    padding: var(--space-4);
  }

  .dashboard-header__user-meta small {
    display: none;
  }

  .dashboard-header__user {
    min-width: auto;
    padding-left: var(--space-3);
  }

  .dashboard-header__logout {
    padding-inline: 0;
  }
}

@media (min-width: 1024px) {
  .dashboard-header {
    left: 0;
    padding: var(--space-4) var(--space-6);
  }

  .dashboard-header__menu-button,
  .dashboard-sidebar__close {
    display: none;
  }

  .dashboard-sidebar {
    width: 288px;
    padding: var(--space-5) var(--space-4);
    transform: translateX(0);
    visibility: visible;
  }

  .dashboard-layout__scrim {
    display: none;
  }

  .dashboard-layout__content {
    padding-left: 288px;
  }
}
</style>
