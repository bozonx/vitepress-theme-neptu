import type { Theme } from 'vitepress'
import { resolveTranslationsByFilePath } from 'vitepress-theme-neptu-blog/utils'
import LandingTheme from 'vitepress-theme-neptu-landing'
import Layout from './Layout.vue'
import './styles.css'

/**
 * The landing theme already extends the VitePress default theme, registers
 * every block globally and pulls in the token layer — here we only swap in a
 * Layout that adds the theme pickers to the nav bar.
 */
const theme: Theme = {
  ...LandingTheme,
  Layout,
  enhanceApp(ctx) {
    LandingTheme.enhanceApp?.(ctx)
    ctx.app.config.globalProperties.getLocales = () =>
      resolveTranslationsByFilePath(ctx.router.route.path)
  },
}

export default theme
