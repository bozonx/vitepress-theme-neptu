import type { App } from 'vue'
import * as primitives from './primitives/index.ts'
import { blockComponents } from './blocks/registry.ts'
import LnRenderer from './blocks/LnRenderer.vue'
import {
  LocaleSelector,
  ColorThemePicker,
  StylePresetPicker,
  NeptuAd,
} from 'vitepress-theme-neptu/components'

/**
 * Registers every block, primitive and helper component globally, so markdown
 * pages can use `<LnHero>`, `<LnFeatureGrid>`, `<LnRenderer>` and friends
 * without a `<script setup>` import block.
 *
 * Called for you by the default theme export; call it manually only if you
 * build your own `enhanceApp`.
 */
export function registerLandingComponents(app: App): void {
  for (const [name, component] of Object.entries({
    ...primitives,
    ...blockComponents,
    LnRenderer,
    landing: LnRenderer,
    ColorThemePicker,
    StylePresetPicker,
    LocaleSelector,
    // Global so the markdown plugin can emit `<NeptuAd />` into page HTML,
    // and so authors can place a unit by hand anywhere in their markdown.
    NeptuAd,
  })) {
    app.component(name, component)
  }
}
