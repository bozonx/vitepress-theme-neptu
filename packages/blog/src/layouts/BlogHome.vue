<script setup lang="ts">
import { useData, inBrowser } from 'vitepress'
import { computed, ref, watchEffect } from 'vue'

const props = withDefaults(
  defineProps<{
    scrollY?: number
  }>(),
  { scrollY: 0 }
)
const { theme, frontmatter } = useData()
const valueY = ref(0)
const wrapperRef = ref<HTMLElement | null>(null)

const homeTheme = computed(() => (frontmatter.value?.homeTheme as string) || 'dark')
const homeMaxWidth = computed(() => (frontmatter.value?.homeMaxWidth as number) || 800)
const homeBackground = computed(() => (frontmatter.value?.homeBackground as string) || 'parallax')
const homeBackgroundImage = computed(() => (frontmatter.value?.homeBackgroundImage as string) || '')
const BG_HEIGHT_OFFSET = computed(
  () => (frontmatter.value?.homeBgParallaxOffset as number) ?? theme.value.homeBgParallaxOffset ?? 0
)

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
    class="home-layout flex flex-col justify-center items-center w-full min-h-screen transition-[background-position-y] duration-100 ease-out will-change-[background-position]"
    :class="[
      homeTheme,
      homeBackground === 'none' ? '' : 'bg-no-repeat bg-center bg-fixed bg-cover',
      homeTheme === 'dark' ? 'text-white!' : '',
    ]"
    :style="[
      homeBackground !== 'none' ? `background-position-y: ${valueY}px; background-size: max(100vw, calc((100vh + ${BG_HEIGHT_OFFSET}px) * 1.78)) calc(100vh + ${BG_HEIGHT_OFFSET}px);` : '',
      homeBackgroundImage ? `background-image: url(${homeBackgroundImage});` : '',
    ].join(' ')"
  >
    <slot name="home-before" />
    <div class="home-layout-page my-20 mx-7" :style="{ maxWidth: `${homeMaxWidth}px` }">
      <Content />
    </div>
    <slot name="home-after" />
  </div>
</template>
