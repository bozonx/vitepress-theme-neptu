<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import { resolveNavigatorLang } from '../utils/client/browser.ts'

interface LocaleEntry {
  label?: string
  lang?: string
  dir?: string
}

const props = defineProps<{
  title?: string
  description?: string
  recommendedLabel?: string
}>()

const { site, frontmatter } = useData()
const recommendedLocale = ref<string>()

const selectorConfig = computed(() =>
  (frontmatter.value.localeSelector || {}) as {
    title?: string
    description?: string
    recommendedLabel?: string
  }
)
const title = computed(() =>
  props.title || selectorConfig.value.title || 'Choose your language'
)
const description = computed(() =>
  props.description ||
  selectorConfig.value.description ||
  'Select the language you want to use.'
)
const recommendedLabel = computed(() =>
  props.recommendedLabel ||
  selectorConfig.value.recommendedLabel ||
  'Recommended for your browser'
)

const locales = computed(() =>
  Object.entries(site.value.locales || {})
    .filter(([code]) => code !== 'root')
    .map(([code, rawLocale]) => {
      const locale = rawLocale as LocaleEntry
      const base = site.value.base || '/'
      const normalizedBase = base.endsWith('/') ? base : `${base}/`

      return {
        code,
        label: locale.label || code,
        lang: locale.lang || code,
        dir: locale.dir,
        link: `${normalizedBase}${code}/`,
      }
    })
)

onMounted(() => {
  recommendedLocale.value = resolveNavigatorLang(
    navigator,
    locales.value.map((locale) => locale.code)
  )
})
</script>

<template>
  <main class="locale-selector">
    <section class="locale-selector__panel" aria-labelledby="locale-selector-title">
      <p class="locale-selector__eyebrow" aria-hidden="true">Neptu</p>
      <h1 id="locale-selector-title">{{ title }}</h1>
      <p class="locale-selector__description">{{ description }}</p>

      <nav class="locale-selector__links" aria-label="Languages">
        <a
          v-for="locale in locales"
          :key="locale.code"
          class="locale-selector__link"
          :class="{ 'locale-selector__link--recommended': locale.code === recommendedLocale }"
          :href="locale.link"
          :lang="locale.lang"
          :dir="locale.dir"
          :aria-describedby="locale.code === recommendedLocale ? `recommended-${locale.code}` : undefined"
        >
          <span>
            <strong>{{ locale.label }}</strong>
            <small>{{ locale.code }}</small>
          </span>
          <span
            v-if="locale.code === recommendedLocale"
            :id="`recommended-${locale.code}`"
            class="locale-selector__recommended"
          >
            {{ recommendedLabel }}
          </span>
          <span class="locale-selector__arrow" aria-hidden="true">→</span>
        </a>
      </nav>
    </section>
  </main>
</template>

<style scoped>
.locale-selector {
  box-sizing: border-box;
  display: grid;
  min-height: 100vh;
  min-height: 100svh;
  place-items: center;
  padding: 2rem 1rem;
  color: var(--vp-c-text-1, #172033);
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--vp-c-brand-1, #3451b2) 14%, transparent), transparent 42%),
    var(--vp-c-bg, #fff);
}

.locale-selector__panel {
  width: min(100%, 34rem);
}

.locale-selector__eyebrow {
  margin: 0 0 0.75rem;
  color: var(--vp-c-brand-1, #3451b2);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.locale-selector h1 {
  margin: 0;
  font-size: clamp(2rem, 7vw, 3.5rem);
  letter-spacing: -0.04em;
  line-height: 1.05;
}

.locale-selector__description {
  margin: 1rem 0 2rem;
  color: var(--vp-c-text-2, #596579);
  font-size: 1.05rem;
  line-height: 1.6;
}

.locale-selector__links {
  display: grid;
  gap: 0.75rem;
}

.locale-selector__link {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.1rem;
  color: inherit;
  text-decoration: none;
  background: color-mix(in srgb, var(--vp-c-bg-soft, #f6f6f7) 90%, transparent);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 0.9rem;
  transition: border-color 160ms ease, transform 160ms ease, background-color 160ms ease;
}

.locale-selector__link:hover,
.locale-selector__link:focus-visible,
.locale-selector__link--recommended {
  background: var(--vp-c-bg-soft, #f6f6f7);
  border-color: var(--vp-c-brand-1, #3451b2);
}

.locale-selector__link:hover {
  transform: translateY(-2px);
}

.locale-selector__link:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--vp-c-brand-1, #3451b2) 30%, transparent);
  outline-offset: 2px;
}

.locale-selector__link strong,
.locale-selector__link small {
  display: block;
}

.locale-selector__link strong {
  font-size: 1.05rem;
}

.locale-selector__link small {
  margin-top: 0.15rem;
  color: var(--vp-c-text-3, #8e99a8);
  font-size: 0.75rem;
  text-transform: uppercase;
}

.locale-selector__recommended {
  color: var(--vp-c-brand-1, #3451b2);
  font-size: 0.75rem;
  font-weight: 650;
  text-align: right;
}

.locale-selector__arrow {
  color: var(--vp-c-brand-1, #3451b2);
  font-size: 1.25rem;
}

@media (max-width: 32rem) {
  .locale-selector__recommended {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .locale-selector__link {
    transition: none;
  }
}
</style>
