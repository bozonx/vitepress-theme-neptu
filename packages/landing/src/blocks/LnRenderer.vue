<script setup lang="ts">
/**
 * Renders a landing page from data — the declarative half of the library.
 *
 * ```md
 * ---
 * layout: landing
 * blocks:
 *   - type: hero
 *     title: Ship faster
 *   - type: features
 *     items: [...]
 * ---
 * <LnRenderer />
 * ```
 *
 * With no `blocks` prop it reads `frontmatter.blocks` of the current page, so
 * a whole page can be authored in YAML with no Vue in sight.
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import LnPage from '../primitives/LnPage.vue'
import { blockTypes, resolveBlockComponent } from './registry.ts'
import type { BlockSpec } from './types.ts'

const props = defineProps<{
  /** Explicit list. Falls back to `frontmatter.blocks`. */
  blocks?: BlockSpec<string>[]
}>()

const { frontmatter } = useData()

const specs = computed<BlockSpec<string>[]>(() => {
  const list = props.blocks ?? (frontmatter.value.blocks as BlockSpec<string>[] | undefined)
  return Array.isArray(list) ? list : []
})

const warned = new Set<string>()
/** `import.meta.env` is provided by Vite; typed loosely to stay build-agnostic. */
const isDev = (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true

const resolved = computed(() =>
  specs.value.map((spec, index) => {
    const { type, ...blockProps } = spec
    const component = type ? resolveBlockComponent(type) : undefined

    if (!component && isDev && type && !warned.has(type)) {
      warned.add(type)
      console.warn(
        `[neptu-landing] Unknown block type "${type}" at index ${index}. ` +
          `Known types: ${blockTypes.join(', ')}.`
      )
    }

    return { key: spec.id ?? `${type}-${index}`, component, props: blockProps, type }
  })
)
</script>

<template>
  <LnPage>
    <slot name="before" />
    <template v-for="entry in resolved" :key="entry.key">
      <component :is="entry.component" v-if="entry.component" v-bind="entry.props" />
      <div v-else-if="isDev" class="ln-unknown-block" role="alert">
        Unknown landing block: <code>{{ entry.type || '(missing type)' }}</code>
      </div>
    </template>
    <slot />
  </LnPage>
</template>
