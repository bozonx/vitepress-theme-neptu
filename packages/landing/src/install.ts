import type { App } from 'vue'
import * as primitives from './primitives/index.ts'
import { blockComponents } from './blocks/registry.ts'
import LandingRenderer from './blocks/LandingRenderer.vue'
import {
  LocaleSelector,
  ColorThemePicker,
  StylePresetPicker,
} from 'vitepress-theme-neptu/components'

/**
 * Registers every block, primitive and helper component globally, so markdown
 * pages can use `<LnHero>`, `<LnFeatureGrid>`, `<LandingRenderer>` and friends
 * without a `<script setup>` import block.
 *
 * Called for you by the default theme export; call it manually only if you
 * build your own `enhanceApp`.
 */
export function registerLandingComponents(app: App): void {
  for (const [name, component] of Object.entries({
    ...primitives,
    ...blockComponents,
    LandingRenderer,
    landing: LandingRenderer,
    ColorThemePicker,
    StylePresetPicker,
    LocaleSelector,
  })) {
    app.component(name, component)
  }
}
