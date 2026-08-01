<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, resolveDynamicComponent } from 'vue'

import { useConsent } from '../composables/useConsent.ts'
import {
  isAdsEnabled,
  isPlacementEnabled,
  requiresAdConsent,
  type AdPlacement,
} from '../utils/shared/ads.ts'
import type { PostFrontmatter, ThemeConfig } from '../types.d.ts'

// The frame around an ad unit, not the unit itself. The theme owns placement,
// reserved space, the disclosure label and the consent gate; the network
// snippet stays with the site, either as the default slot or as the globally
// registered component named by `themeConfig.ads.component`.

const props = withDefaults(
  defineProps<{
    placement?: AdPlacement
    /** Ordinal among slots of the same placement, 0-based. */
    index?: number
  }>(),
  { placement: 'in-content', index: 0 }
)

const { theme, frontmatter } = useData<ThemeConfig>()
const route = useRoute()
const { adsAllowed } = useConsent()

const ads = computed(() => theme.value?.ads)

const unit = computed(() => {
  const name = ads.value?.component
  if (!name) return null
  const resolved = resolveDynamicComponent(name)

  return typeof resolved === 'object' ? resolved : null
})

const consentOk = computed(
  () => !requiresAdConsent(ads.value) || adsAllowed.value
)

const show = computed(
  () =>
    isAdsEnabled(theme.value, frontmatter.value as PostFrontmatter) &&
    isPlacementEnabled(ads.value, props.placement) &&
    consentOk.value
)

// Reserving the height up front is what keeps a mid-article unit from
// shoving the paragraph below it down once the network responds.
const minHeight = computed(() => {
  const configured = ads.value?.minHeight?.[props.placement]

  return typeof configured === 'number' ? `${configured}px` : undefined
})

const label = computed(() => ads.value?.label ?? theme.value?.t?.adLabel)

// VitePress reuses components across navigations, so a unit that needs a
// fresh request per page would otherwise render the previous page's creative.
const unitKey = computed(() => `${route.path}::${props.placement}::${props.index}`)
</script>

<template>
  <aside
    v-if="show"
    class="neptu-ad"
    :class="`neptu-ad--${placement}`"
    :style="minHeight ? { minHeight } : undefined"
  >
    <span v-if="label" class="neptu-ad__label">{{ label }}</span>
    <slot>
      <component :is="unit" v-if="unit" :key="unitKey" v-bind="props" />
    </slot>
  </aside>
</template>

<style scoped>
.neptu-ad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  /* Never let a creative widen the article and cause a horizontal scrollbar. */
  max-width: 100%;
  overflow: hidden;
}

.neptu-ad--in-content,
.neptu-ad--after-content {
  margin-block: var(--ad-block-margin);
}

.neptu-ad--aside {
  margin-block-start: var(--ad-block-margin);
}

.neptu-ad__label {
  align-self: flex-start;
  font-size: var(--ad-label-font-size);
  line-height: 1.2;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ad-label-color);
}
</style>
