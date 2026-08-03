<script setup lang="ts">
import NeptuBtn from '../NeptuBtn.vue'
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'

const { localeIndex, isDark, theme } = useData()

interface HeroButton {
  text?: string
  href?: string
  icon?: string
  primary?: boolean
}

type HeroImageProp =
  | string
  | {
      src?: string | { light: string; dark: string }
      light?: string
      dark?: string
      alt?: string
    }

const props = defineProps<{
  firstLine?: string
  secondLine?: string
  title?: string
  description?: string
  buttons?: HeroButton[]
  actions?: HeroButton[]
  img?: HeroImageProp
  image?: HeroImageProp
}>()

const heroTitle = computed(() => props.title || props.firstLine)
const heroDescription = computed(() => props.description || props.secondLine)
const heroActions = computed(() => props.actions || props.buttons)
const rawImage = computed(() => props.image || props.img)

const imageSrc = (src?: string) => (src?.startsWith('/') ? withBase(src) : src)

const currentImageSrc = computed(() => {
  const img = rawImage.value
  if (!img) return undefined

  let srcVal: string | undefined

  if (typeof img === 'string') {
    srcVal = img
  } else if (typeof img === 'object' && img !== null) {
    if (typeof img.src === 'string') {
      srcVal = img.src
    } else if (typeof img.src === 'object' && img.src !== null) {
      srcVal = isDark.value ? img.src.dark : img.src.light
    } else if ('light' in img || 'dark' in img) {
      srcVal = isDark.value ? img.dark : img.light
    }
  }

  return srcVal ? imageSrc(srcVal) : undefined
})

const currentImageAlt = computed(() => {
  const img = rawImage.value
  if (typeof img === 'object' && img !== null) {
    return img.alt
  }
  return undefined
})

const homeHref = `/${localeIndex.value}/recent/1`
</script>

<template>
  <div class="home-hero">
    <div class="flex w-full max-lg:flex-col-reverse gap-x-2 gap-y-6">
      <div class="flex-1 max-lg:text-center home-hero-captions">
        <h1
          v-if="heroTitle"
          class="max-md:text-4xl md:text-6xl font-bold mb-4 home-hero-first-line"
          v-html="heroTitle"
        ></h1>
        <p
          v-if="heroDescription"
          class="max-md:text-2xl md:text-4xl home-hero-second-line"
          v-html="heroDescription"
        ></p>
      </div>
      <a
        v-if="currentImageSrc"
        :aria-label="theme.t?.toHome"
        class="home-logo flex justify-center items-center"
        :href="withBase(homeHref)"
      >
        <img
          :src="currentImageSrc"
          :alt="currentImageAlt"
          width="320"
          height="320"
          class="home-hero-img"
        />
      </a>
    </div>
    <ul
      v-if="heroActions?.length"
      class="flex w-full max-md:flex-col items-center justify-center gap-x-3 gap-y-6 mt-14 home-hero-buttons"
    >
      <li v-for="(item, index) in heroActions" :key="item.href || index">
        <NeptuBtn v-bind="item" class="rounded-[var(--neptu-radius-pill)]! px-7! w-fit" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.home-logo img {
  filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.15));
  transition: filter 0.3s ease, transform 0.3s ease;
}

.home-logo:hover img {
  filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.22));
  transform: translateY(-2px);
}

:deep(.dark) .home-logo img,
.dark .home-logo img {
  filter: drop-shadow(0 12px 26px rgba(0, 0, 0, 0.45));
}

.home-hero-buttons .btn-base {
  box-shadow: 8px 8px 18px 0px rgba(0, 0, 0, 0.3);
}

.home-hero-buttons .btn-base:not(.btn--primary) {
  background-color: var(--vp-c-bg-soft);
}

.home-hero-img {
  width: 320px;
  height: 320px;
  object-fit: contain;
}

@media (max-width: 519px) {
  .home-hero-img {
    width: 240px;
    height: 240px;
  }
}
</style>
