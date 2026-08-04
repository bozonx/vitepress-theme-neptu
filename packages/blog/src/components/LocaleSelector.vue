<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import { resolveNavigatorLang } from '../utils/client/browser.ts'
import HomeTopBar from './layout-parts/HomeTopBar.vue'

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
  <div class="locale-selector-wrapper min-h-screen flex flex-col relative">
    <header class="w-full absolute top-0 left-0 z-10">
      <HomeTopBar />
    </header>
    <main class="locale-selector flex-1">
      <section class="locale-selector__panel" aria-labelledby="locale-selector-title">
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
  </div>
</template>

<style>
/*
 * Non-scoped: exposes CSS custom properties on .locale-selector-wrapper so
 * users can override any visual aspect from their own CSS without fighting
 * scoped-style specificity.  All defaults match the original design.
 */
.locale-selector-wrapper {
  --locale-selector-text: var(--body-text-color, var(--ln-c-text-1, var(--vp-c-text-1, #172033)));
  --locale-selector-brand-text: var(--link-a-text, var(--ln-c-brand-text, var(--vp-c-brand-1, #3451b2)));

  --locale-selector-bg: var(--vp-c-bg, #fff);
  --locale-selector-bg-glow-1: color-mix(in srgb, var(--vp-c-brand-1, #3451b2) 18%, transparent);
  --locale-selector-bg-glow-2: color-mix(in srgb, var(--vp-c-brand-2, #5672cd) 9%, transparent);

  --locale-selector-panel-bg: color-mix(in srgb, var(--vp-c-bg, #fff) 82%, transparent);
  --locale-selector-panel-border: color-mix(in srgb, var(--vp-c-divider, #e2e2e3) 82%, transparent);
  --locale-selector-panel-radius: var(--neptu-radius-lg);
  --locale-selector-panel-shadow: 0 1.5rem 5rem color-mix(in srgb, #000 16%, transparent);
  --locale-selector-panel-blur: 18px;

  --locale-selector-title-color: var(--locale-selector-text);

  --locale-selector-link-bg: color-mix(in srgb, var(--vp-c-bg-soft, #f6f6f7) 86%, transparent);
  --locale-selector-link-border: var(--vp-c-divider, #e2e2e3);
  --locale-selector-link-radius: var(--neptu-radius-md);
  --locale-selector-link-shadow: none;

  --locale-selector-link-hover-bg: color-mix(in srgb, var(--vp-c-brand-1, #3451b2) 14%, var(--vp-c-bg-soft, #f6f6f7));
  --locale-selector-link-hover-border: var(--vp-c-brand-1, #3451b2);
  --locale-selector-link-hover-shadow: 0 4px 14px color-mix(in srgb, var(--vp-c-brand-1, #3451b2) 18%, transparent);

  --locale-selector-detected-bg: color-mix(in srgb, var(--vp-c-brand-1, #3451b2) 6%, var(--vp-c-bg-soft, #f6f6f7));
  --locale-selector-detected-border: color-mix(in srgb, var(--vp-c-brand-1, #3451b2) 45%, var(--vp-c-divider, #e2e2e3));
  --locale-selector-detected-bar: var(--vp-c-brand-1, #3451b2);
  --locale-selector-detected-shadow: inset 0.25rem 0 0 var(--vp-c-brand-1, #3451b2);

  --locale-selector-detected-hover-bg: color-mix(in srgb, var(--vp-c-brand-1, #3451b2) 18%, var(--vp-c-bg-soft, #f6f6f7));
  --locale-selector-detected-hover-border: var(--vp-c-brand-1, #3451b2);
  --locale-selector-detected-hover-shadow: inset 0.25rem 0 0 var(--vp-c-brand-1, #3451b2), 0 4px 16px color-mix(in srgb, var(--vp-c-brand-1, #3451b2) 22%, transparent);

  --locale-selector-arrow-color: var(--locale-selector-brand-text);
  --locale-selector-arrow-hover-color: var(--vp-c-brand-1, #3451b2);

  --locale-selector-focus-outline: 3px solid color-mix(in srgb, var(--vp-c-brand-1, #3451b2) 30%, transparent);

  --locale-selector-code-color: var(--vp-c-text-3, #8e99a8);
}

.dark .locale-selector-wrapper {
  --locale-selector-bg: var(--vp-c-bg, #0f172a);
  --locale-selector-bg-glow-1: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 22%, transparent);
  --locale-selector-bg-glow-2: color-mix(in srgb, var(--vp-c-brand-2, #708adb) 12%, transparent);

  --locale-selector-panel-bg: color-mix(in srgb, var(--vp-c-bg-elv, #1e293b) 85%, rgba(255, 255, 255, 0.03));
  --locale-selector-panel-border: color-mix(in srgb, var(--vp-c-divider, #3c3c43) 60%, rgba(255, 255, 255, 0.15));
  --locale-selector-panel-shadow: 0 1.5rem 5rem rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);

  --locale-selector-link-bg: color-mix(in srgb, var(--vp-c-bg-soft, #252529) 90%, rgba(255, 255, 255, 0.05));
  --locale-selector-link-border: color-mix(in srgb, var(--vp-c-divider, #3c3c43) 70%, rgba(255, 255, 255, 0.1));
  --locale-selector-link-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);

  --locale-selector-link-hover-bg: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 22%, var(--vp-c-bg-soft, #1e293b));
  --locale-selector-link-hover-border: var(--vp-c-brand-1, #5672cd);
  --locale-selector-link-hover-shadow: 0 4px 20px color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 30%, transparent);

  --locale-selector-detected-bg: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 16%, var(--vp-c-bg-soft, #1e293b));
  --locale-selector-detected-border: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 65%, rgba(255, 255, 255, 0.15));
  --locale-selector-detected-bar: var(--vp-c-brand-1, #5672cd);
  --locale-selector-detected-shadow: inset 0.25rem 0 0 var(--vp-c-brand-1, #5672cd), 0 2px 10px rgba(0, 0, 0, 0.3);

  --locale-selector-detected-hover-bg: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 28%, var(--vp-c-bg-soft, #1e293b));
  --locale-selector-detected-hover-border: var(--vp-c-brand-1, #5672cd);
  --locale-selector-detected-hover-shadow: inset 0.25rem 0 0 var(--vp-c-brand-1, #5672cd), 0 4px 22px color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 35%, transparent);

  --locale-selector-arrow-color: var(--vp-c-brand-1, #5672cd);
  --locale-selector-arrow-hover-color: var(--vp-c-brand-1, #5672cd);

  --locale-selector-code-color: var(--vp-c-text-2, #94a3b8);
}
</style>

<style scoped>
.locale-selector {
  box-sizing: border-box;
  display: grid;
  min-height: 100vh;
  min-height: 100svh;
  place-items: center;
  padding: clamp(1rem, 4vw, 3rem);
  color: var(--locale-selector-text);
  background:
    radial-gradient(circle at 50% 12%, var(--locale-selector-bg-glow-1), transparent 38%),
    radial-gradient(circle at 85% 85%, var(--locale-selector-bg-glow-2), transparent 30%),
    var(--locale-selector-bg);
}

.locale-selector__panel {
  box-sizing: border-box;
  width: min(100%, 30rem);
  padding: clamp(1.5rem, 5vw, 3.25rem);
  background: var(--locale-selector-panel-bg);
  border: 1px solid var(--locale-selector-panel-border);
  border-radius: var(--locale-selector-panel-radius);
  box-shadow: var(--locale-selector-panel-shadow);
  backdrop-filter: blur(var(--locale-selector-panel-blur));
}

.locale-selector__title {
  margin: 0.5rem 0 2rem;
  color: var(--locale-selector-title-color);
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
  background: var(--locale-selector-link-bg);
  border: 1px solid var(--locale-selector-link-border);
  border-radius: var(--locale-selector-link-radius);
  box-shadow: var(--locale-selector-link-shadow);
  transition: border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
}

/* The browser language is marked visually with a subtle left bar and light tint */
.locale-selector__link--detected {
  background: var(--locale-selector-detected-bg);
  border-color: var(--locale-selector-detected-border);
  box-shadow: var(--locale-selector-detected-shadow);
}

.locale-selector__link:hover,
.locale-selector__link:focus-visible {
  background: var(--locale-selector-link-hover-bg);
  border-color: var(--locale-selector-link-hover-border);
  box-shadow: var(--locale-selector-link-hover-shadow);
}

.locale-selector__link--detected:hover,
.locale-selector__link--detected:focus-visible {
  background: var(--locale-selector-detected-hover-bg);
  border-color: var(--locale-selector-detected-hover-border);
  box-shadow: var(--locale-selector-detected-hover-shadow);
}

.locale-selector__link:hover .locale-selector__arrow,
.locale-selector__link:focus-visible .locale-selector__arrow {
  transform: translateX(6px);
  color: var(--locale-selector-arrow-hover-color);
}

.locale-selector__link:focus-visible {
  outline: var(--locale-selector-focus-outline);
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
  color: var(--locale-selector-code-color);
  font-size: 0.75rem;
  text-transform: uppercase;
}

.locale-selector__arrow {
  color: var(--locale-selector-arrow-color);
  font-size: 1.25rem;
  transition: transform 160ms ease;
}

@media (max-width: 32rem) {
  .locale-selector__panel {
    padding: 1.35rem;
    border-radius: var(--neptu-radius-md);
  }
}

@media (prefers-reduced-motion: reduce) {
  .locale-selector__link {
    transition: none;
  }
}
</style>
