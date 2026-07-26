import './styles/landing.css'
import './styles/site-theme-fix.css'

import DefaultTheme from 'vitepress/theme-without-fonts'
import type { EnhanceAppContext, Theme } from 'vitepress'
import { registerLandingComponents } from './install.ts'

export type {
  LandingUserConfig,
  LandingThemeConfig,
  ResolvedLandingConfig,
  ThemeConfig,
  I18n,
  SeoConfig,
  DeepPartial,
  Author,
  LocaleDefinition,
  ExtendedPageData,
  ExtendedSiteConfig,
  PagefindUITranslations,
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
  enhanceApp(ctx: EnhanceAppContext) {
    registerLandingComponents(ctx.app)
  },
}

export default theme
