import type { Theme } from 'vitepress'
import { resolveTranslationsByFilePath } from 'vitepress-theme-neptu-blog/utils'
import Layout from './Layout.vue'
import 'vitepress-theme-neptu-landing/site-theme-fix.css'
import 'vitepress-theme-neptu-blog/pagefind-fix.css'
import './styles.css'

const theme: Theme = {
  Layout,
  enhanceApp(ctx) {
    ctx.app.config.globalProperties.getLocales = () =>
      resolveTranslationsByFilePath(ctx.router.route.path)
  },
}

export default theme
