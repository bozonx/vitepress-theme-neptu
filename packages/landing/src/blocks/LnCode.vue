<script setup lang="ts">
/**
 * Code showcase — the "one line to install" block.
 *
 * Highlighting is not done here: a landing block has no business shipping a
 * syntax highlighter to the browser. Pass pre-highlighted markup in `html`
 * (from Shiki at build time) and it is used as is; otherwise the raw `code` is
 * printed, which is exactly right for shell one-liners. In component mode you
 * can also drop a normal fenced block into the default slot and let VitePress
 * highlight it.
 */
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnIcon from '../primitives/LnIcon.vue'
import LnButtonGroup from '../primitives/LnButtonGroup.vue'
import type { ActionItem, CodeSample, SectionProps } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: CodeSample[]
      /** Copy-to-clipboard button on the sample. */
      copy?: boolean
      /** Fake window chrome above the sample. */
      chrome?: boolean
      actions?: ActionItem[]
      /** `split` puts the copy on the left and the sample on the right. */
      variant?: 'stacked' | 'split'
    }
  >(),
  { copy: true, chrome: true, variant: 'stacked', width: 'narrow', align: 'center' }
)

const { theme } = useData()
const codeText = computed(() => {
  const t = theme.value.t as { landing?: { code?: Record<string, string> } } | undefined
  return t?.landing?.code ?? {}
})
const label = (key: string, fallback: string): string => codeText.value[key] ?? fallback

const active = ref(0)
const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | null = null

const samples = computed(() => props.items ?? [])
const current = computed(() => samples.value[active.value])
const tabLabel = (sample: CodeSample, index: number): string =>
  sample.label ?? sample.lang ?? `${index + 1}`

const select = (index: number): void => {
  active.value = index
  copied.value = false
}

/** Keyboard support required by the tablist pattern. */
const onTabKeydown = (event: KeyboardEvent, index: number): void => {
  const total = samples.value.length
  let next: number
  if (event.key === 'ArrowRight') next = (index + 1) % total
  else if (event.key === 'ArrowLeft') next = (index - 1 + total) % total
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = total - 1
  else return

  event.preventDefault()
  select(next)
  const tabs = (event.currentTarget as HTMLElement).parentElement?.children
  ;(tabs?.[next] as HTMLElement | undefined)?.focus()
}

const copySample = async (): Promise<void> => {
  const source = current.value?.code
  if (!source || !navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(source)
    copied.value = true
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => (copied.value = false), 2000)
  } catch {
    // A denied clipboard permission is not worth breaking the page over.
  }
}
</script>

<template>
  <LnSection
    :id="props.id"
    :bg="props.bg"
    :width="props.width"
    :padding="props.padding"
    :divider="props.divider"
    :no-reveal="props.noReveal"
    class="ln-code"
    :class="`ln-code--${props.variant}`"
  >
    <div class="ln-code__layout">
      <div class="ln-code__copy">
        <LnHeading
          :eyebrow="props.eyebrow"
          :title="props.title"
          :text="props.text"
          :align="props.variant === 'split' ? 'start' : props.align"
          :spacing="false"
        />
        <LnButtonGroup
          v-if="props.actions?.length"
          :actions="props.actions"
          :align="props.variant === 'split' ? 'start' : props.align"
          class="ln-code__actions"
        />
      </div>

      <div class="ln-code__frame">
        <div v-if="props.chrome || samples.length > 1" class="ln-code__bar">
          <span v-if="props.chrome" class="ln-code__dots" aria-hidden="true">
            <i /><i /><i />
          </span>

          <div
            v-if="samples.length > 1"
            class="ln-code__tabs"
            role="tablist"
            :aria-label="props.title ?? label('region', 'Code samples')"
          >
            <button
              v-for="(sample, i) in samples"
              :id="`${props.id ?? 'ln-code'}-tab-${i}`"
              :key="`tab-${i}`"
              type="button"
              role="tab"
              class="ln-code__tab"
              :class="{ 'is-active': i === active }"
              :aria-selected="i === active"
              :aria-controls="`${props.id ?? 'ln-code'}-panel-${i}`"
              :tabindex="i === active ? 0 : -1"
              @click="select(i)"
              @keydown="onTabKeydown($event, i)"
            >
              {{ tabLabel(sample, i) }}
            </button>
          </div>
          <span v-else-if="current?.lang" class="ln-code__lang">{{ current.lang }}</span>

          <button
            v-if="props.copy && current?.code"
            type="button"
            class="ln-code__copy-btn"
            :aria-label="copied ? label('copied', 'Copied') : label('copy', 'Copy code')"
            @click="copySample"
          >
            <LnIcon :icon="copied ? 'fa6-solid:check' : 'fa6-solid:copy'" size="0.85rem" />
            <span>{{ copied ? label('copied', 'Copied') : label('copy', 'Copy') }}</span>
          </button>
        </div>

        <div
          v-for="(sample, i) in samples"
          v-show="i === active"
          :id="`${props.id ?? 'ln-code'}-panel-${i}`"
          :key="`panel-${i}`"
          class="ln-code__panel"
          :role="samples.length > 1 ? 'tabpanel' : undefined"
          :aria-labelledby="samples.length > 1 ? `${props.id ?? 'ln-code'}-tab-${i}` : undefined"
          :tabindex="samples.length > 1 ? 0 : undefined"
        >
          <!-- eslint-disable-next-line vue/no-v-html -- pre-highlighted markup is author-supplied -->
          <div v-if="sample.html" class="ln-code__pre" v-html="sample.html" />
          <pre v-else class="ln-code__pre"><code>{{ sample.code }}</code></pre>
          <p v-if="sample.caption" class="ln-code__caption">{{ sample.caption }}</p>
        </div>

        <div v-if="!samples.length" class="ln-code__panel"><slot /></div>
      </div>
    </div>
  </LnSection>
</template>

<style scoped>
.ln-code__layout {
  display: grid;
  gap: clamp(1.5rem, 1rem + 2vw, 3rem);
}

.ln-code--stacked .ln-code__copy:not(:empty) {
  margin-bottom: 0;
}

@media (min-width: 960px) {
  .ln-code--split .ln-code__layout {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    align-items: center;
  }
}

.ln-code__copy {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
}

.ln-code__copy:empty {
  display: none;
}

.ln-code__frame {
  min-width: 0;
  overflow: hidden;
  border: var(--ln-border-width) solid var(--ln-c-border);
  border-radius: var(--ln-radius-lg);
  background-color: var(--ln-c-code-bg);
  box-shadow: var(--ln-card-shadow);
  color: var(--ln-c-code-text);
}

.ln-code__bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: var(--ln-border-width) solid var(--ln-c-code-border);
  padding: 0.5rem 0.75rem;
}

.ln-code__dots {
  display: inline-flex;
  gap: 0.375rem;
  flex: none;
}

.ln-code__dots i {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-code-border);
}

.ln-code__tabs {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.ln-code__tab {
  border: 0;
  border-radius: var(--ln-radius-sm);
  background-color: transparent;
  padding: 0.3rem 0.7rem;
  color: var(--ln-c-code-muted);
  font: inherit;
  font-family: var(--ln-font-mono);
  font-size: 0.8125rem;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color var(--ln-duration) var(--ln-ease),
    color var(--ln-duration) var(--ln-ease);
}

.ln-code__tab.is-active {
  background-color: var(--ln-c-code-border);
  color: var(--ln-c-code-text);
}

.ln-code__tab:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 1px;
}

.ln-code__lang {
  color: var(--ln-c-code-muted);
  font-family: var(--ln-font-mono);
  font-size: 0.8125rem;
}

.ln-code__copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-left: auto;
  flex: none;
  border: var(--ln-border-width) solid var(--ln-c-code-border);
  border-radius: var(--ln-radius-sm);
  background-color: transparent;
  padding: 0.25rem 0.625rem;
  color: var(--ln-c-code-muted);
  font: inherit;
  font-size: 0.8125rem;
  cursor: pointer;
  transition:
    border-color var(--ln-duration) var(--ln-ease),
    color var(--ln-duration) var(--ln-ease);
}

.ln-code__copy-btn:hover {
  border-color: var(--ln-c-brand);
  color: var(--ln-c-code-text);
}

.ln-code__panel:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: -2px;
}

.ln-code__pre {
  margin: 0;
  overflow-x: auto;
  padding: clamp(1rem, 0.75rem + 0.5vw, 1.5rem);
  font-family: var(--ln-font-mono);
  font-size: 0.875rem;
  line-height: 1.7;
  tab-size: 2;
}

.ln-code__pre :deep(pre) {
  margin: 0;
  background: transparent;
  padding: 0;
}

.ln-code__pre code {
  font-family: inherit;
  white-space: pre;
}

.ln-code__caption {
  margin: 0;
  border-top: var(--ln-border-width) solid var(--ln-c-code-border);
  padding: 0.625rem 1rem;
  color: var(--ln-c-code-muted);
  font-size: 0.8125rem;
}
</style>
