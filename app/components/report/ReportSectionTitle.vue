<template>
  <div class="report-section-title">
    <p class="report-section-title__eyebrow">{{ eyebrow }}</p>
    <h2 class="report-section-title__heading">{{ title }}</h2>
  </div>
</template>

<script setup>
  defineProps({
    eyebrow: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  });
</script>

<style scoped>
  .report-section-title {
    display: grid;
    gap: var(--space-2);
  }

  .report-section-title__eyebrow {
    color: var(--color-accent);
    font-size: var(--text-sm);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .report-section-title__heading {
    font-size: clamp(1.3rem, 2vw, 1.7rem);
  }
</style>
