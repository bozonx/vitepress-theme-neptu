<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, provide, resolveDynamicComponent } from 'vue'

import NotFound from '../components/layout-parts/NotFound.vue'
import { useScrollY } from '../composables/useScrollY.ts'
import ImageLightbox from '../components/doc-components/ImageLightbox.vue'
import BlogHome from './BlogHome.vue'
import DefaultLayout from './DefaultLayout.vue'
import { LightboxLocalesKey } from '../composables/useLightbox.ts'
import { TranslationsKey } from '../composables/useTranslations.ts'
import { resolveTranslationsByFilePath } from '../utils/shared/index.ts'

const { page, frontmatter } = useData()
const route = useRoute()
const { scrollY } = useScrollY()

const BUILTIN_LAYOUTS = [
  'home',
  'post',
  'page',
  'util',
  'tag',
  'archive',
  'author',
]

const customLayout = computed(() => {
  const l = frontmatter.value?.layout
  if (!l || typeof l !== 'string') return null
  if (BUILTIN_LAYOUTS.includes(l)) return null
  const resolved = resolveDynamicComponent(l)
  return typeof resolved === 'object' ? resolved : null
})

// `layout: false` -> raw <Content />
// `layout: home`  -> BlogHome (parallax full-takeover)
// otherwise (`post`, `page`, `util`, `tag`, `archive`, `author`, undefined) -> DefaultLayout chrome,
// inner content is dispatched by PageContent.vue based on the same `frontmatter.layout`.
// Custom globally-registered components can override the layout entirely.
const layoutKind = computed(() => {
  if (page.value.isNotFound) return 'not-found'
  const l = frontmatter.value?.layout
  if (l === false) return 'raw'
  if (l === 'home') return 'home'
  if (customLayout.value) return 'custom'
  return 'default'
})

const translations = computed(() => resolveTranslationsByFilePath(route.path))
provide(TranslationsKey, translations)

const lightboxLocales = computed(() => translations.value.t.lightbox ?? {})
provide(LightboxLocalesKey, lightboxLocales)
</script>

<template>
  <div id="modals"></div>

  <ImageLightbox />

  <NotFound v-if="layoutKind === 'not-found'" />

  <Content v-else-if="layoutKind === 'raw'" />

  <BlogHome v-else-if="layoutKind === 'home'" :scroll-y="scrollY" />

  <component :is="customLayout" v-else-if="layoutKind === 'custom'" />

  <DefaultLayout v-else>
    <template v-if="$slots['post-header-before']" #post-header-before>
      <slot name="post-header-before" />
    </template>
    <template v-if="$slots['post-header-after']" #post-header-after>
      <slot name="post-header-after" />
    </template>
    <template v-if="$slots['post-content-before']" #post-content-before>
      <slot name="post-content-before" />
    </template>
    <template v-if="$slots['post-content-after']" #post-content-after>
      <slot name="post-content-after" />
    </template>
    <template v-if="$slots['post-footer']" #post-footer>
      <slot name="post-footer" />
    </template>
    <template v-if="$slots['sidebar-top']" #sidebar-top>
      <slot name="sidebar-top" />
    </template>
    <template v-if="$slots['sidebar-middle']" #sidebar-middle>
      <slot name="sidebar-middle" />
    </template>
    <template v-if="$slots['sidebar-bottom']" #sidebar-bottom>
      <slot name="sidebar-bottom" />
    </template>
    <template v-if="$slots['sub-sidebar']" #sub-sidebar>
      <slot name="sub-sidebar" />
    </template>
    <template v-if="$slots['nav-bar-content-before']" #nav-bar-content-before>
      <slot name="nav-bar-content-before" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="$slots['aside']" #aside>
      <slot name="aside" />
    </template>
  </DefaultLayout>
</template>
