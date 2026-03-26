<template>
  <Teleport to="body">
    <Transition name="global-dialog-fade">
      <div
        v-if="dialog.isOpen.value"
        class="global-dialog"
        aria-hidden="false"
        @click="handleBackdropClick"
      >
        <section
          ref="dialogPanelRef"
          class="global-dialog__panel app-scrollbar"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="dialogTitleId"
          :aria-describedby="dialogContentId"
          tabindex="-1"
        >
          <header class="global-dialog__header">
            <h2 :id="dialogTitleId" class="global-dialog__title">
              {{ dialog.title.value || "保密與隱私條款" }}
            </h2>
            <button
              ref="dialogCloseRef"
              class="global-dialog__close"
              type="button"
              aria-label="關閉對話框"
              @click="closeDialog"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                />
              </svg>
            </button>
          </header>

          <div :id="dialogContentId" class="global-dialog__body">
            <p v-if="dialog.isLoading.value" class="global-dialog__state">
              正在載入條款內容...
            </p>
            <p
              v-else-if="dialog.error.value"
              class="global-dialog__state global-dialog__state--error"
            >
              {{ dialog.error.value }}
            </p>
            <div
              v-else-if="dialog.articles.value.length"
              class="global-dialog__content"
            >
              <article
                v-for="(article, index) in dialog.articles.value"
                :key="`${article.numberLabel}-${index}`"
                class="global-dialog__article"
              >
                <h3 class="global-dialog__article-heading">
                  <span class="global-dialog__article-number">
                    {{ article.numberLabel }}
                  </span>
                  <span>{{ article.heading }}</span>
                </h3>
                <p
                  v-for="(paragraph, paragraphIndex) in article.paragraphs"
                  :key="`${article.numberLabel}-p-${paragraphIndex}`"
                  class="global-dialog__article-paragraph"
                >
                  {{ paragraph }}
                </p>
                <ul
                  v-if="article.items.length"
                  class="global-dialog__article-list"
                >
                  <li
                    v-for="(item, itemIndex) in article.items"
                    :key="`${article.numberLabel}-i-${itemIndex}`"
                  >
                    {{ item }}
                  </li>
                </ul>
              </article>
            </div>
            <p v-else class="global-dialog__state">
              目前沒有可顯示的條款內容。
            </p>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
  import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

  const dialog = useGlobalDialog();
  const dialogPanelRef = ref(null);
  const dialogCloseRef = ref(null);
  const activeElementBeforeOpen = ref(null);
  const dialogTitleId = "global-dialog-title";
  const dialogContentId = "global-dialog-content";
  let bodyOverflowBackup = "";

  function closeDialog() {
    dialog.closeDialog();
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  function handleKeydown(event) {
    if (!dialog.isOpen.value) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
    }
  }

  async function handleDialogOpen() {
    activeElementBeforeOpen.value =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    bodyOverflowBackup = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    await nextTick();
    dialogCloseRef.value?.focus();
  }

  function handleDialogClose() {
    document.body.style.overflow = bodyOverflowBackup;
    activeElementBeforeOpen.value?.focus?.();
  }

  onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown);
    document.body.style.overflow = bodyOverflowBackup;
  });

  watch(
    () => dialog.isOpen.value,
    async (isOpen) => {
      if (isOpen) {
        await handleDialogOpen();
        return;
      }

      handleDialogClose();
    },
  );
</script>

<style scoped>
  .global-dialog {
    position: fixed;
    inset: 0;
    z-index: 1500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
    background: rgba(46, 55, 42, 0.52);
    backdrop-filter: blur(3px);
  }

  .global-dialog__panel {
    width: min(760px, calc(100vw - 32px));
    min-height: min(58vh, 520px);
    max-height: min(82vh, 760px);
    display: flex;
    flex-direction: column;
    overflow: auto;
    border: 1px solid rgba(205, 210, 196, 0.92);
    border-radius: 18px;
    background: var(--color-surface);
    box-shadow: 0 30px 80px rgba(24, 28, 22, 0.28);
  }

  .global-dialog__header {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid rgba(221, 222, 218, 0.95);
    background: rgba(255, 254, 251, 0.96);
  }

  .global-dialog__title {
    color: var(--color-text);
    font-size: var(--text-xl);
    line-height: 1.25;
  }

  .global-dialog__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    min-width: 40px;
    border-radius: 999px;
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    transition:
      color 0.2s ease,
      background-color 0.2s ease;
  }

  .global-dialog__close:hover {
    color: var(--color-text);
    background: rgba(118, 113, 111, 0.09);
  }

  .global-dialog__close:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 4px rgba(var(--color-primary-600-rgb), 0.22);
  }

  .global-dialog__close svg {
    width: 20px;
    height: 20px;
  }

  .global-dialog__body {
    flex: 1;
    min-height: 220px;
    padding: var(--space-5);
  }

  .global-dialog__content {
    color: var(--color-text-muted);
    font-size: var(--text-base);
    line-height: 1.55;
    padding-bottom: var(--space-6);
  }

  .global-dialog__article + .global-dialog__article {
    margin-top: var(--space-6);
    padding-top: var(--space-5);
    border-top: 1px solid rgba(221, 222, 218, 0.82);
  }

  .global-dialog__article-heading {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
    color: var(--color-text);
    font-size: var(--text-lg);
    line-height: 1.4;
  }

  .global-dialog__article-number {
    min-width: 4.8em;
    color: var(--color-primary-600);
    font-weight: 700;
  }

  .global-dialog__article-paragraph + .global-dialog__article-paragraph {
    margin-top: var(--space-2);
  }

  .global-dialog__article-list {
    margin: var(--space-3) 0 0;
    padding-left: 1.4em;
  }

  .global-dialog__article-list li + li {
    margin-top: var(--space-2);
  }

  .global-dialog__state {
    display: flex;
    align-items: center;
    min-height: 180px;
    color: var(--color-text-muted);
    font-size: var(--text-base);
    line-height: 1.5;
  }

  .global-dialog__state--error {
    color: var(--color-danger);
  }

  .global-dialog-fade-enter-active,
  .global-dialog-fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .global-dialog-fade-enter-active .global-dialog__panel {
    transition:
      opacity 0.24s ease-out,
      transform 0.24s ease-out;
  }

  .global-dialog-fade-leave-active .global-dialog__panel {
    transition:
      opacity 0.18s ease-in,
      transform 0.18s ease-in;
  }

  .global-dialog-fade-enter-from,
  .global-dialog-fade-leave-to {
    opacity: 0;
  }

  .global-dialog-fade-enter-from .global-dialog__panel,
  .global-dialog-fade-leave-to .global-dialog__panel {
    opacity: 0;
    transform: translateY(60px);
  }

  .global-dialog-fade-enter-to .global-dialog__panel,
  .global-dialog-fade-leave-from .global-dialog__panel {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 767px) {
    .global-dialog {
      padding: var(--space-3);
      align-items: flex-end;
    }

    .global-dialog__panel {
      width: 100%;
      min-height: min(64vh, 560px);
      max-height: 86vh;
      border-radius: 16px 16px 0 0;
    }

    .global-dialog__header,
    .global-dialog__body {
      padding: var(--space-4);
    }

    .global-dialog__title {
      font-size: var(--text-lg);
    }
  }
</style>
