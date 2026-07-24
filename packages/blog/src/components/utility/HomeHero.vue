<script setup lang="ts">
import NeptuBtn from '../NeptuBtn.vue'
import { useData } from 'vitepress'
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
  src: string
  alt?: string
}

const props = defineProps<{
  firstLine?: string
  secondLine?: string
  buttons?: HeroButton[]
  img?: HeroImage
}>()
</script>

<template>
  <div class="mb-14 md:mb-18 home-hero">
    <div class="flex w-full max-lg:flex-col-reverse gap-x-2 gap-y-6">
      <div class="flex-1 max-lg:text-center home-hero-captions">
        <h1
          class="max-md:text-4xl md:text-6xl font-bold mb-4 home-hero-first-line"
          v-html="props.firstLine"
        ></h1>
        <p
          class="max-md:text-2xl md:text-4xl home-hero-second-line"
          v-html="props.secondLine"
        ></p>
      </div>
      <a
        v-if="props.img"
        :aria-label="theme.t.toHome"
        class="home-logo flex justify-center"
        :href="`/${localeIndex}/recent/1`"
      >
        <img
          :src="props.img.src"
          :alt="props.img.alt"
          width="320"
          height="320"
          class="home-hero-img"
        />
      </a>
    </div>
    <ul
      v-if="props.buttons"
      class="flex w-full max-md:flex-col items-center justify-center gap-x-3 gap-y-6 mt-14 home-hero-buttons"
    >
      <li v-for="(item, index) in props.buttons" :key="item.href || index">
        <NeptuBtn v-bind="item" class="rounded-full! px-7! w-fit" />
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
  text-shadow: 4px 4px 14px rgba(0, 0, 0, 0.8);
}

.home-hero-buttons .btn-base {
  box-shadow: 8px 8px 18px 0px rgba(0, 0, 0, 0.3);
}

.home-hero-buttons .btn-base:not(.btn--primary) {
  background-color: var(--gray-700);
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
