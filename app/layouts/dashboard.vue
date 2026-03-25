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

        <NuxtLink
          class="dashboard-header__brand"
          to="/"
          aria-label="ForwardMall"
        >
          <img
            class="dashboard-header__brand-logo"
            src="/logo.svg"
            alt="ForwardMall"
          />
        </NuxtLink>
      </div>

      <div class="dashboard-header__actions">
        <button
          class="dashboard-header__mobile-logout"
          type="button"
          aria-label="登出"
          @click="handleLogout"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M10 7.5H7.5A1.5 1.5 0 0 0 6 9v6a1.5 1.5 0 0 0 1.5 1.5H10m3.5-7 3 2.5-3 2.5m2.5-2.5H10.5M14 6l2.5 2.5M14 18l2.5-2.5"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
            />
          </svg>
          <span class="dashboard-header__mobile-logout-label">登出</span>
        </button>

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
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M10 7.5H7.5A1.5 1.5 0 0 0 6 9v6a1.5 1.5 0 0 0 1.5 1.5H10m3.5-7 3 2.5-3 2.5m2.5-2.5H10.5M14 6l2.5 2.5M14 18l2.5-2.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                  />
                </svg>
                <span class="dashboard-header__logout-label">登出</span>
              </button>
            </span>
          </div>
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
        <section
          v-for="section in navSections"
          :key="section.title"
          class="dashboard-sidebar__group"
        >
          <p class="dashboard-sidebar__section-title">{{ section.title }}</p>

          <div class="dashboard-sidebar__group-links">
            <template v-for="item in section.items" :key="item.label">
              <NuxtLink
                v-if="item.to"
                class="dashboard-sidebar__link"
                :class="{
                  'dashboard-sidebar__link--active': item.to === route.path,
                }"
                :to="item.to"
                @click="closeSidebar"
              >
                <span class="dashboard-sidebar__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      :d="item.icon"
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

              <div
                v-else
                class="dashboard-sidebar__link dashboard-sidebar__link--muted"
                aria-disabled="true"
              >
                <span class="dashboard-sidebar__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      :d="item.icon"
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
              </div>
            </template>
          </div>
        </section>
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

  const navSections = [
    {
      title: "數據分析",
      items: [
        {
          to: "/",
          label: "報表總覽",
          description: "KPI、趨勢與月別明細",
          icon: "M5 19V9.5m7 9.5V5m7 14v-7",
        },
        {
          to: "/productAnalysis",
          label: "商品分析",
          description: "品類熱度與銷售動能",
          icon: "m7 8 5-3 5 3v8l-5 3-5-3Z M12 5v11",
        },
        {
          to: "/advertisingEffectiveness",
          label: "廣告成效",
          description: "投放漏斗與佔比分析",
          icon: "M5.5 16.5 18.5 7.5M14 7.5h4.5V12M7 16.5H4.5V12",
        },
        {
          label: "訂單分析",
          description: "訂單結構與轉換率",
          icon: "M7 7.5h10M7 12h10m-10 4.5h6M6 4.5h12a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z",
        },
        {
          label: "會員分析",
          description: "留存與回購即將開放",
          icon: "M8 11a4 4 0 1 1 8 0a4 4 0 1 1-8 0m-2.5 8.5a6.5 6.5 0 0 1 13 0",
        },
      ],
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
    --dashboard-header-height: 72px;
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
    gap: var(--space-3);
    min-height: var(--dashboard-header-height);
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid rgba(186, 192, 175, 0.9);
    background: rgba(252, 251, 247, 0.98);
    backdrop-filter: blur(10px);
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
    height: 24px;
  }

  .dashboard-header__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 0;
  }

  .dashboard-sidebar__section-title {
    color: var(--color-accent);
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .dashboard-header__user {
    display: grid;
    grid-template-columns: auto minmax(0, auto);
    align-items: center;
    gap: var(--space-3);
    flex: 0 0 auto;
    min-width: 0;
  }

  .dashboard-header__logout,
  .dashboard-header__mobile-logout {
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 44px;
    height: 44px;
    padding: 0 var(--space-3);
    border: 1px solid rgba(var(--color-danger-rgb), 0.18);
    border-radius: 14px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.96) 0%,
      rgba(255, 244, 244, 0.98) 100%
    );
    color: var(--color-danger);
    box-shadow: 0 10px 22px rgba(181, 69, 69, 0.08);
    cursor: pointer;
    transition:
      transform 0.14s ease,
      color 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .dashboard-header__logout {
    display: inline-flex;
    flex: 0 0 auto;
  }

  .dashboard-header__mobile-logout {
    display: none;
  }

  .dashboard-header__logout svg,
  .dashboard-header__mobile-logout svg {
    width: 18px;
    height: 18px;
  }

  .dashboard-header__logout-label,
  .dashboard-header__mobile-logout-label {
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  .dashboard-header__avatar-wrap {
    position: relative;
    display: inline-flex;
  }

  .dashboard-header__avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
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
    grid-template-columns: minmax(0, auto) auto;
    grid-template-areas:
      "name logout"
      "role logout";
    column-gap: var(--space-3);
    row-gap: 2px;
    align-items: center;
    min-width: 0;
  }

  .dashboard-header__user-copy strong {
    grid-area: name;
    font-size: 0.875rem;
    font-weight: 800;
    line-height: 1.1;
    white-space: nowrap;
  }

  .dashboard-header__user-meta {
    display: contents;
  }

  .dashboard-header__user-meta small {
    grid-area: role;
    color: var(--color-text-muted);
    font-size: 0.72rem;
    line-height: 1.2;
    white-space: nowrap;
  }

  .dashboard-header__logout {
    grid-area: logout;
    color: var(--color-danger);
    align-self: center;
  }

  .dashboard-header__logout:hover,
  .dashboard-header__mobile-logout:hover,
  .dashboard-header__logout:focus-visible {
    color: var(--color-accent);
  }

  .dashboard-header__mobile-logout:hover {
    border-color: rgba(var(--color-danger-rgb), 0.28);
    background: rgba(255, 242, 242, 0.98);
    box-shadow: 0 12px 24px rgba(181, 69, 69, 0.14);
  }

  .dashboard-header__mobile-logout:active {
    transform: translateY(1px);
  }

  .dashboard-header__mobile-logout:focus-visible {
    color: var(--color-danger);
    outline: 0;
    border-color: rgba(var(--color-danger-rgb), 0.34);
    box-shadow:
      0 0 0 4px rgba(var(--color-danger-rgb), 0.18),
      0 12px 24px rgba(181, 69, 69, 0.12);
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
    width: min(calc(100vw - 24px), 292px);
    height: calc(100dvh - var(--dashboard-header-height));
    padding: var(--space-4) var(--space-4) var(--space-5);
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
    justify-content: flex-end;
  }

  .dashboard-sidebar__nav {
    display: grid;
    align-content: start;
    gap: var(--space-4);
    padding-top: 0;
  }

  .dashboard-sidebar__group {
    display: grid;
    gap: var(--space-2);
  }

  .dashboard-sidebar__group-links {
    display: grid;
    gap: 2px;
  }

  .dashboard-sidebar__link {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr);
    gap: var(--space-2);
    align-items: center;
    min-height: 52px;
    padding: 10px 0 10px var(--space-3);
    border-left: 3px solid transparent;
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
    border-left-color: var(--color-primary-700);
    background: rgba(229, 244, 217, 0.7);
    color: var(--color-primary-700);
  }

  .dashboard-sidebar__link--muted {
    color: rgba(91, 87, 84, 0.72);
  }

  .dashboard-sidebar__link--muted .dashboard-sidebar__icon,
  .dashboard-sidebar__link--muted .dashboard-sidebar__link-copy small {
    color: rgba(118, 113, 111, 0.68);
  }

  .dashboard-sidebar__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: rgba(118, 113, 111, 0.78);
  }

  .dashboard-sidebar__link-copy {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .dashboard-sidebar__link-copy strong {
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .dashboard-sidebar__link-copy small {
    color: var(--color-text-muted);
    font-size: 0.72rem;
    line-height: 1.25;
  }

  .dashboard-sidebar__link--active .dashboard-sidebar__icon {
    color: var(--color-primary-700);
  }

  .dashboard-sidebar__link--active .dashboard-sidebar__link-copy strong {
    font-weight: 800;
  }

  .dashboard-sidebar__link--active .dashboard-sidebar__link-copy small {
    color: rgba(79, 104, 67, 0.72);
  }

  .dashboard-layout__content {
    min-width: 0;
    padding-top: var(--dashboard-header-height);
  }

  @media (max-width: 767px) {
    .dashboard-header {
      padding: var(--space-3) var(--space-3);
    }

    .dashboard-header__leading {
      gap: var(--space-2);
    }

    .dashboard-header__actions {
      min-width: 44px;
    }

    .dashboard-header__mobile-logout {
      display: inline-flex;
      padding-inline: 10px;
    }

    .dashboard-header__user {
      display: none;
    }

    .dashboard-header__user-meta small {
      display: none;
    }

    .dashboard-header__logout {
      padding-inline: 0;
    }
  }

  @media (min-width: 1024px) {
    .dashboard-header {
      left: 0;
      padding: var(--space-3) var(--space-6);
    }

    .dashboard-header__brand-logo {
      height: 32px;
    }

    .dashboard-header__menu-button,
    .dashboard-sidebar__close {
      display: none;
    }

    .dashboard-sidebar {
      width: 248px;
      padding: var(--space-4) var(--space-4) var(--space-5);
      transform: translateX(0);
      visibility: visible;
    }

    .dashboard-layout__scrim {
      display: none;
    }

    .dashboard-layout__content {
      padding-left: 248px;
    }
  }
</style>
