<script setup lang="ts">
/**
 * Root wrapper of a landing page. Marks the page as edge-to-edge for the
 * VitePress bridge stylesheet and gives markdown written between blocks a
 * readable measure.
 *
 * ```md
 * ---
 * layout: home
 * markdownStyles: false
 * ---
 * <LnPage>
 *   <LnHero title="..." />
 * </LnPage>
 * ```
 */
</script>

<template>
  <div class="ln-page">
    <slot />
  </div>
</template>
