<script setup lang="ts">
/**
 * Feature tabs — several scenarios in the space of one section, instead of
 * four `feature-split` rows stacked on top of each other.
 *
 * Implements the WAI-ARIA tabs pattern: roving tabindex, arrow keys, Home/End.
 * All panels stay in the DOM (hidden with `v-show`) so the copy is indexed by
 * search engines and found by in-page search.
 */
import { computed, ref, useId, watch } from 'vue'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnIcon from '../primitives/LnIcon.vue'
import LnMedia from '../primitives/LnMedia.vue'
import LnButtonGroup from '../primitives/LnButtonGroup.vue'
import type { HeadingProps, SectionProps, TabItem } from './types.ts'
import { useSectionProps } from './sectionProps.ts'

const props = withDefaults(
  defineProps<
    SectionProps & HeadingProps & {
      items?: TabItem[]
      /** Tab strip position. `side` becomes a column on desktop. */
      variant?: 'top' | 'side'
      /** Index open on first render. */
      initial?: number
      mediaRatio?: string
    }
  >(),
  { variant: 'top', initial: 0, align: 'center' }
)

const tabs = computed(() => props.items ?? [])
const active = ref(Math.min(Math.max(props.initial, 0), Math.max(tabs.value.length - 1, 0)))
const generatedId = useId()
const uid = computed(() => props.id ?? `ln-tabs-${generatedId}`)
const labelOf = (tab: TabItem, index: number): string => tab.label ?? tab.title ?? `${index + 1}`

const onKeydown = (event: KeyboardEvent, index: number): void => {
  const total = tabs.value.length
  let next: number
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % total
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + total) % total
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = total - 1
  else return

  event.preventDefault()
  active.value = next
  const strip = (event.currentTarget as HTMLElement).parentElement
  ;(strip?.children[next] as HTMLElement | undefined)?.focus()
}
watch(tabs, (list) => {
  if (active.value >= list.length) active.value = Math.max(0, list.length - 1)
})
const sectionProps = useSectionProps(props)
</script>

<template>
  <LnSection
    v-bind="sectionProps"
    class="ln-tabs"
    :class="`ln-tabs--${props.variant}`"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <div class="ln-tabs__shell">
      <div
        class="ln-tabs__strip"
        role="tablist"
        :aria-label="props.title ?? 'Tabs'"
        :aria-orientation="props.variant === 'side' ? 'vertical' : 'horizontal'"
      >
        <button
          v-for="(tab, i) in tabs"
          :id="`${uid}-tab-${i}`"
          :key="`tab-${i}`"
          type="button"
          role="tab"
          class="ln-tabs__tab"
          :class="{ 'is-active': i === active }"
          :aria-selected="i === active"
          :aria-controls="`${uid}-panel-${i}`"
          :tabindex="i === active ? 0 : -1"
          @click="active = i"
          @keydown="onKeydown($event, i)"
        >
          <LnIcon v-if="tab.icon" :icon="tab.icon" size="1.05rem" />
          <span>{{ labelOf(tab, i) }}</span>
        </button>
      </div>

      <div class="ln-tabs__panels">
        <div
          v-for="(tab, i) in tabs"
          v-show="i === active"
          :id="`${uid}-panel-${i}`"
          :key="`panel-${i}`"
          class="ln-tabs__panel"
          role="tabpanel"
          :aria-labelledby="`${uid}-tab-${i}`"
          tabindex="0"
        >
          <div class="ln-tabs__copy">
            <p v-if="tab.badge" class="ln-tabs__badge">{{ tab.badge }}</p>
            <LnHeading
              :eyebrow="tab.eyebrow"
              :title="tab.title"
              :text="tab.text"
              level="h3"
              :spacing="false"
            />

            <ul v-if="tab.bullets?.length" class="ln-tabs__bullets">
              <li v-for="(bullet, bi) in tab.bullets" :key="bi" v-html="bullet" />
            </ul>

            <LnButtonGroup v-if="tab.actions?.length" :actions="tab.actions" />
          </div>

          <div v-if="tab.image" class="ln-tabs__media">
            <LnMedia :media="tab.image" :ratio="props.mediaRatio ?? '16/9'" border shadow />
          </div>
        </div>
      </div>
    </div>

    <slot />
  </LnSection>
</template>

<style scoped>
.ln-tabs__shell {
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 1rem + 2vw, 2.5rem);
}

.ln-tabs__strip {
  display: flex;
  gap: 0.375rem;
  overflow-x: auto;
  scrollbar-width: none;
  /* Room for the focus ring of the first and last tab. */
  padding: 0.25rem;
  margin: -0.25rem;
}

.ln-tabs__strip::-webkit-scrollbar {
  display: none;
}

.ln-tabs--top .ln-tabs__strip {
  justify-content: center;
  flex-wrap: nowrap;
}

.ln-tabs__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex: none;
  border: var(--ln-border-width) solid transparent;
  border-radius: var(--ln-radius-pill);
  background-color: transparent;
  padding: 0.55rem 1.1rem;
  color: var(--ln-c-text-2);
  font: inherit;
  font-weight: 600;
  font-size: 0.9375rem;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color var(--ln-duration) var(--ln-ease),
    border-color var(--ln-duration) var(--ln-ease),
    color var(--ln-duration) var(--ln-ease);
}

.ln-tabs__tab:hover {
  color: var(--ln-c-text-1);
}

.ln-tabs__tab.is-active {
  border-color: var(--ln-c-border);
  background-color: var(--ln-c-bg-elevated);
  color: var(--ln-c-brand-text);
  box-shadow: var(--ln-shadow-1);
}

.ln-tabs__tab:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 2px;
}

.ln-tabs__panel {
  display: grid;
  gap: clamp(1.5rem, 1rem + 3vw, 3.5rem);
  align-items: center;
}

.ln-tabs__panel:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 6px;
  border-radius: var(--ln-radius-md);
}

@media (min-width: 860px) {
  .ln-tabs__panel:has(.ln-tabs__media) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  }
}

@media (min-width: 960px) {
  .ln-tabs--side .ln-tabs__shell {
    flex-direction: row;
    align-items: flex-start;
    gap: clamp(2rem, 1rem + 3vw, 4rem);
  }

  .ln-tabs--side .ln-tabs__strip {
    flex-direction: column;
    flex: 0 0 15rem;
    overflow: visible;
  }

  .ln-tabs--side .ln-tabs__tab {
    justify-content: flex-start;
    border-radius: var(--ln-radius-md);
    text-align: left;
    white-space: normal;
  }

  .ln-tabs--side .ln-tabs__panels {
    flex: 1 1 auto;
    min-width: 0;
  }
}

.ln-tabs__copy {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.ln-tabs__badge {
  margin: 0;
  align-self: flex-start;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-brand-soft);
  padding: 0.125rem 0.625rem;
  color: var(--ln-c-brand-text);
  font-size: 0.75rem;
  font-weight: 600;
}

.ln-tabs__bullets {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--ln-c-text-2);
}

.ln-tabs__bullets li {
  position: relative;
  padding-left: 1.5rem;
  line-height: var(--ln-body-lh);
}

.ln-tabs__bullets li::before {
  content: '';
  position: absolute;
  top: 0.6em;
  left: 0.25rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-brand);
}

.ln-tabs__media {
  min-width: 0;
}
</style>
