import type { EnhanceAppContext } from 'vitepress'
import { resolveTranslationsByFilePath } from 'vitepress-theme-neptu-blog/utils'
import LandingTheme from 'vitepress-theme-neptu-landing'
import Layout from './Layout.vue'
import './styles.css'

export default {
  extends: LandingTheme,
  Layout,
  enhanceApp(ctx: EnhanceAppContext) {
    ctx.app.config.globalProperties.getLocales = () =>
      resolveTranslationsByFilePath(ctx.router.route.path)
  },
}
