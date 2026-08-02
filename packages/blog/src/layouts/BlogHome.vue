<script setup lang="ts">
import { useData, inBrowser } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import TopBar from '../components/layout-parts/TopBar.vue'
import HomeHero from '../components/utility/HomeHero.vue'
import HomeSections from '../components/utility/HomeSections.vue'
import { useBreakpoint } from '../composables/useBreakpoint.ts'
import type { ThemeConfig } from '../types.d.ts'

const props = withDefaults(
  defineProps<{
    scrollY?: number
  }>(),
  { scrollY: 0 }
)
const { theme, frontmatter, isDark } = useData<ThemeConfig>()
const { isMobile } = useBreakpoint()
const valueY = ref(0)
const wrapperRef = ref<HTMLElement | null>(null)

const home = computed(() => theme.value.home || {})
const appearance = computed(() =>
  (frontmatter.value?.homeTheme as 'auto' | 'light' | 'dark' | undefined) ||
  home.value.appearance || 'auto'
)
const homeMaxWidth = computed(() =>
  (frontmatter.value?.homeMaxWidth as number) || home.value.maxWidth || 800
)
const homeBackground = computed(() =>
  (frontmatter.value?.homeBackground as 'parallax' | 'none' | undefined) ||
  home.value.background || 'none'
)
const homeBackgroundImage = computed(() =>
  (frontmatter.value?.homeBackgroundImage as string) || home.value.backgroundImage || ''
)
const BG_HEIGHT_OFFSET = computed(
  () => (frontmatter.value?.homeBgParallaxOffset as number) ?? home.value.bgParallaxOffset ?? 0
)

let previousAppearance: boolean | null = null
onMounted(() => {
  if (appearance.value === 'auto') return
  previousAppearance = isDark.value
  isDark.value = appearance.value === 'dark'
})
onBeforeUnmount(() => {
  if (previousAppearance !== null) isDark.value = previousAppearance
})

watchEffect(() => {
  if (!inBrowser) return
  if (homeBackground.value === 'none') {
    valueY.value = 0
    return
  }

  const totalHeight = wrapperRef.value?.scrollHeight || 0
  const windowHeight = window.innerHeight
  const totalScroll = totalHeight - windowHeight

  // Avoid division by zero when there is no scroll
  if (totalScroll <= 0) {
    valueY.value = 0
    return
  }

  // Scroll progress from 0 to 1
  const scrollProgress = Math.min(Math.max(props.scrollY / totalScroll, 0), 1)

  // Parallax formula: background moves slower than content.
  // Initial position is 0, then it shifts upward on scroll.
  // At full scroll the background shifts by the full BG_HEIGHT_OFFSET
  // so the whole image is revealed (background size: 100vh + BG_HEIGHT_OFFSET).
  //
  // Logic:
  // - scrollProgress = 0: background at 0 (top of image visible)
  // - scrollProgress = 1: background at -BG_HEIGHT_OFFSET (bottom of image visible)
  valueY.value = -(BG_HEIGHT_OFFSET.value * scrollProgress)
})
</script>

<template>
  <div
    ref="wrapperRef"
    class="home-layout flex flex-col justify-center items-center w-full min-h-screen relative transition-[background-position-y] duration-100 ease-out will-change-[background-position]"
    :class="[
      `home-appearance-${appearance}`,
      homeBackground === 'none' ? '' : 'bg-no-repeat bg-center bg-fixed bg-cover',
    ]"
    :style="[
      homeBackground !== 'none' ? `background-position-y: ${valueY}px; background-size: max(100vw, calc((100vh + ${BG_HEIGHT_OFFSET}px) * 1.78)) calc(100vh + ${BG_HEIGHT_OFFSET}px);` : '',
      homeBackgroundImage ? `background-image: url(${homeBackgroundImage});` : '',
    ].join(' ')"
  >
    <header class="w-full absolute top-0 left-0 z-10">
      <TopBar
        :is-mobile="isMobile"
        :hide-appearance="appearance !== 'auto'"
        :hide-menu-button="true"
        :minimal="true"
      >
        <template #nav-bar-content-before>
          <slot name="nav-bar-content-before" />
        </template>
      </TopBar>
    </header>
    <slot name="home-before" />
    <div class="home-layout-page pt-16 sm:pt-20 my-12 md:my-16 mx-7 flex flex-col gap-12 md:gap-16 w-full" :style="{ maxWidth: `${homeMaxWidth}px` }">
      <HomeHero v-if="home.hero" v-bind="home.hero" />
      <div class="home-content vp-doc"><Content /></div>
      <HomeSections />
    </div>
    <slot name="home-after" />
  </div>
</template>

<style scoped>
.home-layout {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.home-content:empty,
.home-content:not(:has(*)) {
  display: none;
}
</style>
