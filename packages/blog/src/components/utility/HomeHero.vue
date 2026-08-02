<script setup lang="ts">
import NeptuBtn from '../NeptuBtn.vue'
import { useData, withBase } from 'vitepress'
import { useUiTheme } from '../../composables/useUiTheme.ts'

const { localeIndex } = useData()
const { theme } = useUiTheme()
interface HeroButton {
  text?: string
  href?: string
  icon?: string
  primary?: boolean
}

interface HeroImage {
  src?: string
  alt?: string
}

const props = defineProps<{
  firstLine?: string
  secondLine?: string
  title?: string
  description?: string
  buttons?: HeroButton[]
  actions?: HeroButton[]
  img?: HeroImage
  image?: HeroImage
}>()

const heroTitle = props.title || props.firstLine
const heroDescription = props.description || props.secondLine
const heroActions = props.actions || props.buttons
const heroImage = props.image || props.img

const homeHref = `/${localeIndex.value}/recent/1`
const imageSrc = (src?: string) => (src?.startsWith('/') ? withBase(src) : src)
</script>

<template>
  <div class="mb-14 md:mb-18 home-hero">
    <div class="flex w-full max-lg:flex-col-reverse gap-x-2 gap-y-6">
      <div class="flex-1 max-lg:text-center home-hero-captions">
        <h1
          class="max-md:text-4xl md:text-6xl font-bold mb-4 home-hero-first-line"
          v-html="heroTitle"
        ></h1>
        <p
          class="max-md:text-2xl md:text-4xl home-hero-second-line"
          v-html="heroDescription"
        ></p>
      </div>
      <a
        v-if="heroImage?.src"
        :aria-label="theme.t.toHome"
        class="home-logo flex justify-center"
        :href="withBase(homeHref)"
      >
        <img
          :src="imageSrc(heroImage.src)"
          :alt="heroImage.alt"
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
  filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.5));
}

.home-hero h1,
.home-hero p {
  text-shadow: 2px 2px 12px color-mix(in srgb, var(--vp-c-bg) 65%, transparent);
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
}

@media (max-width: 519px) {
  .home-hero-img {
    width: 240px;
    height: 240px;
  }
}
</style>
