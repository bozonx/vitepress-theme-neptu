<script setup lang="ts">
/**
 * Thin announcement strip — a release, a webinar, a discount. Sits above the
 * hero, which is the one place a block is allowed to precede it.
 *
 * Dismissal is remembered in `localStorage` under `storageKey`. The banner is
 * rendered on the server and hidden after mount, never the other way round:
 * hiding first would mean a visible pop-in for everyone who has not dismissed
 * it. Bump `storageKey` to show a new announcement to everyone again.
 */
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import LnSection from '../primitives/LnSection.vue'
import LnIcon from '../primitives/LnIcon.vue'
import type { IconLike, SectionProps } from './types.ts'
import { useSectionProps } from './sectionProps.ts'
import { externalLinkTarget, resolveUrl } from '../utils/url.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      /** Supports inline HTML. */
      text?: string
      /** Short label in front of the text. */
      badge?: string
      icon?: IconLike
      link?: string
      linkText?: string
      /** Show a close button and remember the choice. */
      dismissible?: boolean
      /** `localStorage` key. Change it to re-show a dismissed banner. */
      storageKey?: string
      placement?: 'inline' | 'top' | 'bottom'
      sticky?: boolean
    }
  >(),
  { bg: 'brand', width: 'wide', padding: 'none', dismissible: false, storageKey: 'ln-banner', placement: 'inline', sticky: false }
)

const { theme } = useData()
const bannerText = computed(() => {
  const t = theme.value.t as { landing?: { banner?: Record<string, string> } } | undefined
  return t?.landing?.banner ?? {}
})

const hidden = ref(false)

onMounted(() => {
  if (!props.dismissible) return
  try {
    hidden.value = localStorage.getItem(props.storageKey) === 'dismissed'
  } catch {
    // Private mode / blocked storage — just keep showing the banner.
  }
})

const dismiss = (): void => {
  hidden.value = true
  try {
    localStorage.setItem(props.storageKey, 'dismissed')
  } catch {
    // Nothing to do: the banner is hidden for this page view either way.
  }
}

const sectionProps = useSectionProps(props)
</script>

<template>
  <LnSection
    v-if="!hidden"
    v-bind="sectionProps"
    class="ln-banner"
    :class="[`ln-banner--${props.placement}`, { 'ln-banner--sticky': props.sticky }]"
  >
    <div class="ln-banner__inner">
      <LnIcon v-if="props.icon" :icon="props.icon" size="1rem" class="ln-banner__icon" />
      <span v-if="props.badge" class="ln-banner__badge">{{ props.badge }}</span>

      <p v-if="props.text" class="ln-banner__text" v-html="props.text" />
      <slot />

      <a
        v-if="props.link && props.linkText"
        class="ln-banner__link"
        :href="resolveUrl(props.link)"
        :target="externalLinkTarget(props.link)"
        :rel="externalLinkTarget(props.link) ? 'noreferrer' : undefined"
      >
        {{ props.linkText }}
      </a>

      <button
        v-if="props.dismissible"
        type="button"
        class="ln-banner__close"
        :aria-label="bannerText.dismiss ?? 'Dismiss'"
        @click="dismiss"
      >
        <LnIcon icon="fa6-solid:xmark" size="0.8rem" />
      </button>
    </div>
  </LnSection>
</template>

<style scoped>
.ln-banner--sticky { position: sticky; z-index: 50; }
.ln-banner--sticky.ln-banner--top { top: var(--vp-nav-height, 64px); }
.ln-banner--sticky.ln-banner--bottom { bottom: 0; }
.ln-banner__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
  padding-block: 0.625rem;
  font-size: 0.875rem;
  text-align: center;
}

.ln-banner__icon {
  flex: none;
}

.ln-banner__badge {
  flex: none;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-brand-soft);
  padding: 0.1rem 0.55rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ln-banner__text {
  margin: 0;
  min-width: 0;
  line-height: 1.5;
}

.ln-banner__text :deep(a) {
  color: inherit;
  text-decoration: underline;
}

.ln-banner__link {
  flex: none;
  color: inherit;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.ln-banner__link:hover {
  text-decoration-thickness: 2px;
}

.ln-banner__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* Pinned right on wide screens, inline when the text wraps. */
  margin-left: auto;
  flex: none;
  width: 1.75rem;
  height: 1.75rem;
  border: 0;
  border-radius: var(--ln-radius-pill);
  background-color: transparent;
  color: inherit;
  opacity: 0.75;
  cursor: pointer;
  transition:
    background-color var(--ln-duration) var(--ln-ease),
    opacity var(--ln-duration) var(--ln-ease);
}

.ln-banner__close:hover {
  background-color: var(--ln-c-brand-soft);
  opacity: 1;
}

.ln-banner__close:focus-visible {
  outline: 2px solid currentcolor;
  outline-offset: 1px;
}
</style>
