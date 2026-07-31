<template>
  <aside v-if="$slots.default" class="aside-container">
    <div class="aside-content">
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
// Right-hand column of the post layout, typically used for ad units.
// Rendered only when the `aside` slot of `Layout.vue` has content and the
// current page is allowed by `themeConfig.asideLayouts` / frontmatter `aside`.
//
// Hidden below --aside-breakpoint (1550px) because the column would otherwise
// squeeze the article. The default width matches the standard 300px ad block.
</script>

<style scoped>
.aside-container {
  display: none;
}

.aside-content {
  width: 100%;
}

/* Keep in sync with --aside-breakpoint in blog-vars.css: media queries
   cannot read CSS custom properties. */
@media (min-width: 1550px) {
  .aside-container {
    display: block;
    flex: 0 0 var(--aside-width);
    width: var(--aside-width);
    min-width: var(--aside-width);
    max-width: var(--aside-width);
    padding-inline: var(--aside-padding-x);
    margin-left: var(--aside-gap);
  }

  .aside-content {
    position: sticky;
    top: var(--aside-top);
  }
}
</style>
