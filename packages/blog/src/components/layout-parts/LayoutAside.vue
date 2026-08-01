<template>
  <aside v-if="hasContent" class="aside-container">
    <div class="aside-content">
      <TocAside v-if="showToc" />
      <!-- The configured ad unit, framed by the theme. -->
      <NeptuAd v-if="showAd" placement="aside" />
      <!-- Anything the site passes to the `aside` slot renders as-is: it is
           not necessarily an ad, so it gets no disclosure label. -->
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
// Right-hand column of the post layout: the table of contents on top, ad unit
// below. Rendered when the current page is allowed by
// `themeConfig.asideLayouts` / frontmatter `aside` and there is something to
// put in it.
//
// Hidden below --aside-breakpoint (1550px) because the column would otherwise
// squeeze the article — 320px sidebar plus 840px of content already fills a
// 1280px viewport. Below the breakpoint the TOC falls back to a collapsible
// block above the article and ads to their in-content slots, so nothing is
// simply lost on narrower screens. The default width matches the standard
// 300px ad block.

import { useData } from 'vitepress'
import { computed } from 'vue'

import NeptuAd from '../NeptuAd.vue'
import TocAside from '../toc/TocAside.vue'
import { useToc } from '../../composables/useToc.ts'
import { isAdsEnabled, isPlacementEnabled } from '../../utils/shared/ads.ts'
import type { PostFrontmatter, ThemeConfig } from '../../types.d.ts'

const slots = defineSlots<{ default?: () => unknown }>()

const { theme, frontmatter } = useData<ThemeConfig>()
const { show: tocReady } = useToc()

const showToc = computed(
  () => tocReady.value && (theme.value?.toc?.position ?? 'auto') !== 'top'
)

const showAd = computed(
  () =>
    Boolean(theme.value?.ads?.component) &&
    isAdsEnabled(theme.value, frontmatter.value as PostFrontmatter) &&
    isPlacementEnabled(theme.value?.ads, 'aside')
)

// An empty column would still consume its width and shove the article left.
const hasContent = computed(
  () => showToc.value || showAd.value || Boolean(slots.default)
)
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
