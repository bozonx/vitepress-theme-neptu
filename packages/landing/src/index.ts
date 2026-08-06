import './styles/landing.css'

import DefaultTheme from 'vitepress/theme-without-fonts'
import type { EnhanceAppContext, Theme } from 'vitepress'
import { registerLandingComponents } from './install.ts'
import { addCollection } from '@iconify/vue'
import bundledIcons from './generated/icons-bundle.ts'
import LandingLayout from './layouts/LandingLayout.vue'

export type {
  LandingUserConfig,
  LandingThemeConfig,
  ResolvedLandingConfig,
  ThemeConfig,
  I18nTranslations,
  SeoConfig,
  DeepPartial,
  Author,
  LocaleDefinition,
  ExtendedPageData,
  ExtendedSiteConfig,
} from './types.d.ts'

export { registerLandingComponents } from './install.ts'

/**
 * Landing theme: the VitePress default theme (nav bar, docs sidebar, outline)
 * plus the landing token layer and the globally registered block library.
 *
 * ```ts
 * // .vitepress/theme/index.ts
 * import LandingTheme from 'vitepress-theme-neptu-landing'
 * export default LandingTheme
 * ```
 *
 * To add your own nav bar slots, spread it and override `Layout`:
 *
 * ```ts
 * export default { ...LandingTheme, Layout: MyLayout }
 * ```
 */
const theme: Theme = {
  extends: DefaultTheme,
  Layout: LandingLayout,
  enhanceApp(ctx: EnhanceAppContext) {
    for (const collection of bundledIcons) addCollection(collection)
    registerLandingComponents(ctx.app)
  },
}

export default theme
