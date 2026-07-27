<script setup lang="ts">
/**
 * Responsive grid used by all multi-item blocks. `cols` is the desktop count;
 * tablet and mobile counts are derived so that blocks stay consistent.
 */
const props = withDefaults(
  defineProps<{
    cols?: 1 | 2 | 3 | 4 | 5 | 6
    gap?: 'sm' | 'md' | 'lg'
    /** Equalize item heights (default) or let them size naturally. */
    stretch?: boolean
  }>(),
  { cols: 3, gap: 'md', stretch: true }
)
</script>

<template>
  <div class="ln-grid-wrap">
    <div
      class="ln-grid"
      :class="[`ln-grid--${props.cols}`, `ln-grid--gap-${props.gap}`, { 'ln-grid--stretch': props.stretch }]"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ln-grid-wrap {
  container-type: inline-size;
  container-name: ln-grid;
}

.ln-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--ln-grid-gap, var(--ln-gap));
}

.ln-grid--gap-sm {
  --ln-grid-gap: var(--ln-gap-sm);
}
.ln-grid--gap-lg {
  --ln-grid-gap: calc(var(--ln-gap) * 1.6);
}

.ln-grid--stretch {
  align-items: stretch;
}

.ln-grid--stretch > :deep(*) {
  height: 100%;
}

@container ln-grid (min-width: 40rem) {
  .ln-grid--2,
  .ln-grid--3,
  .ln-grid--4,
  .ln-grid--5,
  .ln-grid--6 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@container ln-grid (min-width: 60rem) {
  .ln-grid--3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .ln-grid--4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .ln-grid--5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .ln-grid--6 {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

</style>
