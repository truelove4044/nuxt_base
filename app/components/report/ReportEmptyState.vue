<template>
  <BaseCard class="report-empty-state">
    <div class="report-empty-state__icon" aria-hidden="true">
      <slot name="icon">⋯</slot>
    </div>
    <div class="report-empty-state__body">
      <h3 class="report-empty-state__title">{{ title }}</h3>
      <p class="report-empty-state__description">{{ description }}</p>
    </div>
    <button
      v-if="actionLabel"
      class="report-empty-state__action"
      type="button"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </BaseCard>
</template>

<script setup>
defineEmits(["action"]);

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  actionLabel: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.report-empty-state {
  display: grid;
  justify-items: center;
  gap: var(--space-4);
  padding: var(--space-8);
  text-align: center;
}

.report-empty-state__icon {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(105, 186, 58, 0.16), rgba(238, 125, 59, 0.12)),
    var(--color-surface-muted);
  color: var(--color-primary-700);
  font-size: 28px;
  font-weight: 700;
}

.report-empty-state__body {
  display: grid;
  gap: var(--space-2);
}

.report-empty-state__title {
  font-size: var(--text-xl);
}

.report-empty-state__description {
  max-width: 42ch;
  color: var(--color-text-muted);
}

.report-empty-state__action {
  padding: var(--space-3) var(--space-4);
  border: 1px solid rgba(var(--color-focus-ring-rgb), 0.35);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.84);
  color: var(--color-primary-700);
  font-weight: 600;
  cursor: pointer;
}
</style>
