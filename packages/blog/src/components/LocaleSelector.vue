<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import { resolveNavigatorLang } from '../utils/client/browser.ts'

interface LocaleEntry {
  label?: string
  lang?: string
  dir?: string
}

const props = defineProps<{
  title?: string
}>()

const { site, frontmatter } = useData()
const detectedLocale = ref<string>()
const listEl = ref<HTMLElement>()

const selectorConfig = computed(
  () => (frontmatter.value.localeSelector || {}) as { title?: string }
)

// The page is language-neutral on purpose: no prose to translate. The only text
// is the site title, which falls back to the primary locale's title in
// `mergeBlogConfig`.
const title = computed(() => props.title || selectorConfig.value.title || site.value.title)

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

onMounted(async () => {
  detectedLocale.value = resolveNavigatorLang(
    navigator,
    locales.value.map((locale) => locale.code)
  )
  if (!detectedLocale.value) return

  // Highlight the browser language visually instead of labelling it, and bring
  // it into view so it stays reachable in a long locale list. Deliberately no
  // redirect: Google needs to crawl every locale from this page.
  await nextTick()
  listEl.value
    ?.querySelector('.locale-selector__link--detected')
    ?.scrollIntoView({ block: 'nearest' })
})
</script>

<template>
  <main class="locale-selector">
    <section class="locale-selector__panel" aria-labelledby="locale-selector-title">
      <svg
        class="locale-selector__mark"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3.3 9h17.4M3.3 15h17.4" />
      </svg>
      <h1 id="locale-selector-title" class="locale-selector__title">{{ title }}</h1>

      <nav ref="listEl" class="locale-selector__links" aria-label="Languages">
        <a
          v-for="locale in locales"
          :key="locale.code"
          class="locale-selector__link"
          :class="{ 'locale-selector__link--detected': locale.code === detectedLocale }"
          :href="locale.link"
          :lang="locale.lang"
          :dir="locale.dir"
          :aria-current="locale.code === detectedLocale ? 'true' : undefined"
        >
          <span class="locale-selector__label">
            <strong>{{ locale.label }}</strong>
            <small>{{ locale.code }}</small>
          </span>
          <span class="locale-selector__arrow" aria-hidden="true">→</span>
        </a>
      </nav>
    </section>
  </main>
</template>

<style scoped>
.locale-selector {
  --locale-selector-text: var(--body-text-color, var(--ln-c-text-1, var(--vp-c-text-1, #172033)));
  --locale-selector-brand-text: var(--link-a-text, var(--ln-c-brand-text, var(--vp-c-brand-1, #3451b2)));
  box-sizing: border-box;
  display: grid;
  min-height: 100vh;
  min-height: 100svh;
  place-items: center;
  padding: clamp(1rem, 4vw, 3rem);
  color: var(--locale-selector-text);
  background:
    radial-gradient(circle at 50% 12%, color-mix(in srgb, var(--vp-c-brand-1, #3451b2) 18%, transparent), transparent 38%),
    radial-gradient(circle at 85% 85%, color-mix(in srgb, var(--vp-c-brand-2, #5672cd) 9%, transparent), transparent 30%),
    var(--vp-c-bg, #fff);
}

.locale-selector__panel {
  box-sizing: border-box;
  width: min(100%, 30rem);
  padding: clamp(1.5rem, 5vw, 3.25rem);
  background: color-mix(in srgb, var(--vp-c-bg, #fff) 82%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-divider, #e2e2e3) 82%, transparent);
  border-radius: 1.5rem;
  box-shadow: 0 1.5rem 5rem color-mix(in srgb, #000 16%, transparent);
  backdrop-filter: blur(18px);
}

.locale-selector__mark {
  display: block;
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 auto;
  color: var(--locale-selector-brand-text);
  stroke-linecap: round;
}

.locale-selector__title {
  margin: 1rem 0 2rem;
  color: var(--locale-selector-text);
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 750;
  letter-spacing: -0.03em;
  line-height: 1.15;
  text-align: center;
  text-wrap: balance;
}

.locale-selector__links {
  display: grid;
  gap: 0.8rem;
  max-height: min(60vh, 30rem);
  padding-right: 0.15rem;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.locale-selector__link {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  min-height: 5rem;
  padding: 1rem 1.15rem;
  color: var(--locale-selector-text);
  text-decoration: none;
  background: color-mix(in srgb, var(--vp-c-bg-soft, #f6f6f7) 86%, transparent);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 0.9rem;
  transition: border-color 160ms ease, transform 160ms ease, background-color 160ms ease;
}

.locale-selector__link:hover,
.locale-selector__link:focus-visible,
.locale-selector__link--detected {
  background: color-mix(in srgb, var(--vp-c-brand-1, #3451b2) 10%, var(--vp-c-bg-soft, #f6f6f7));
  border-color: var(--vp-c-brand-1, #3451b2);
}

/* The browser language is marked visually only — no "recommended" wording to
   translate, and nothing that reads as a nudge. */
.locale-selector__link--detected {
  box-shadow: inset 0.2rem 0 0 var(--vp-c-brand-1, #3451b2);
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
  color: var(--locale-selector-text);
  font-size: 1.05rem;
  font-weight: 700;
}

.locale-selector__link small {
  margin-top: 0.15rem;
  color: var(--vp-c-text-3, #8e99a8);
  font-size: 0.75rem;
  text-transform: uppercase;
}

.locale-selector__arrow {
  color: var(--locale-selector-brand-text);
  font-size: 1.25rem;
}

@media (max-width: 32rem) {
  .locale-selector__panel {
    padding: 1.35rem;
    border-radius: 1.1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .locale-selector__link {
    transition: none;
  }
}
</style>
